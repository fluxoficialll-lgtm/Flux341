
import axios from 'axios';
import { userRepositorio } from '../../GerenciadoresDeDados/user.repositorio.js';
import { LogDeOperacoes } from '../ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const PAYPAL_API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

/**
 * Obtém um Token de Acesso do PayPal usando Client ID e Secret.
 */
const getAccessToken = async (clientId, clientSecret, traceId) => {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    try {
        LogDeOperacoes.log('PAYPAL_GET_TOKEN_START', { clientId }, traceId);
        const response = await axios.post(`${PAYPAL_API_URL}/v1/oauth2/token`, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        LogDeOperacoes.log('PAYPAL_GET_TOKEN_SUCCESS', { clientId }, traceId);
        return response.data.access_token;
    } catch (error) {
        LogDeOperacoes.error('PAYPAL_AUTH_ERROR', { 
            clientId, 
            error: error.response?.data || error.message 
        }, traceId);
        const authError = new Error('Falha na autenticação com o PayPal.');
        authError.statusCode = 401;
        throw authError;
    }
};

export const paypalGatewayService = {
    /**
     * Verifica se as credenciais são válidas tentando obter um token.
     */
    verifyCredentials: async (clientId, clientSecret, traceId) => {
        const token = await getAccessToken(clientId, clientSecret, traceId);
        return { success: true, token };
    },

    /**
     * Cria uma Ordem de Pagamento no PayPal.
     */
    createOrder: async (orderData, traceId) => {
        const { clientId, clientSecret, amount, currency, description } = orderData;
        LogDeOperacoes.log('PAYPAL_CREATE_ORDER_START', { amount, currency }, traceId);
        
        if (!clientId || !clientSecret) {
            const error = new Error("Credenciais do vendedor ausentes.");
            error.statusCode = 400;
            throw error;
        }

        const token = await getAccessToken(clientId, clientSecret, traceId);
        
        const payload = {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency || 'BRL',
                    value: amount.toFixed(2)
                },
                description: description || ''
            }],
            application_context: {
                brand_name: 'Flux Platform',
                user_action: 'PAY_NOW',
                shipping_preference: 'NO_SHIPPING'
            }
        };

        try {
            const response = await axios.post(`${PAYPAL_API_URL}/v2/checkout/orders`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const approvalLink = response.data.links.find(link => link.rel === 'approve')?.href;
            LogDeOperacoes.log('PAYPAL_CREATE_ORDER_SUCCESS', { orderId: response.data.id }, traceId);
            
            return {
                id: response.data.id,
                status: response.data.status,
                approvalLink
            };
        } catch (error) {
            LogDeOperacoes.error('PAYPAL_CREATE_ORDER_ERROR', { error: error.response?.data || error.message }, traceId);
            throw new Error('Falha ao criar pedido no PayPal.');
        }
    },

    /**
     * Verifica o status e captura a ordem se aprovada.
     */
    checkStatus: async (statusData, traceId) => {
        const { clientId, clientSecret, orderId } = statusData;
        LogDeOperacoes.log('PAYPAL_CHECK_STATUS_START', { orderId }, traceId);

        if (!clientId || !clientSecret) {
            const error = new Error("Credenciais do vendedor ausentes.");
            error.statusCode = 400;
            throw error;
        }

        const token = await getAccessToken(clientId, clientSecret, traceId);
        
        try {
            const checkRes = await axios.get(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (checkRes.data.status === 'APPROVED') {
                LogDeOperacoes.log('PAYPAL_ORDER_APPROVED', { orderId }, traceId);
                const captureRes = await axios.post(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                LogDeOperacoes.log('PAYPAL_CAPTURE_SUCCESS', { orderId }, traceId);
                return { status: 'paid', details: captureRes.data };
            }

            if (checkRes.data.status === 'COMPLETED') {
                LogDeOperacoes.log('PAYPAL_ORDER_ALREADY_COMPLETED', { orderId }, traceId);
                return { status: 'paid', details: checkRes.data };
            }

            LogDeOperacoes.log('PAYPAL_CHECK_STATUS_PENDING', { orderId, status: checkRes.data.status }, traceId);
            return { status: 'pending', rawStatus: checkRes.data.status };

        } catch (error) {
            LogDeOperacoes.error('PAYPAL_CAPTURE_STATUS_ERROR', { orderId, error: error.response?.data || error.message }, traceId);
            if (error.response?.status === 422) {
                return { status: 'paid', note: 'Likely already captured' };
            }
            throw new Error('Falha ao verificar status no PayPal.');
        }
    },

    /**
     * Desconecta a conta do PayPal de um usuário.
     */
    disconnect: async (userId, traceId) => {
        LogDeOperacoes.log('PAYPAL_DISCONNECT_START', { userId }, traceId);
        try {
            if (!userId) {
                const error = new Error("Usuário não autenticado.");
                error.statusCode = 401;
                throw error;
            }

            const user = await userRepositorio.findById(userId);
            if (!user) {
                const error = new Error("Usuário não encontrado.");
                error.statusCode = 404;
                throw error;
            }

            const paymentConfigs = user.paymentConfigs || {};
            if (paymentConfigs.paypal) {
                paymentConfigs.paypal.isConnected = false;
                paymentConfigs.paypal.clientId = null;
                paymentConfigs.paypal.clientSecret = null;
            }

            await userRepositorio.update(userId, { paymentConfigs });

            LogDeOperacoes.log('PAYPAL_DISCONNECT_SUCCESS', { userId }, traceId);
            return { success: true, message: 'PayPal desconectado com sucesso.' };

        } catch (error) {
            // O erro já pode ter um statusCode (401, 404), então não o sobrescrevemos.
            if (!error.statusCode) {
                 LogDeOperacoes.error('PAYPAL_DISCONNECT_ERROR', { userId, error: error.message, stack: error.stack }, traceId);
            }
            throw error;
        }
    }
};
