
import axios from 'axios';
import { userRepositorio } from '../../GerenciadoresDeDados/user.repositorio.js';
import { LogDeOperacoes } from '../ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const SYNC_PAY_API_URL = process.env.SYNC_PAY_API_URL || 'https://api.syncpay.com.br';

/**
 * Obtém o token de acesso da API SyncPay.
 */
const getAccessTokenInternal = async (clientId, clientSecret, traceId) => {
    LogDeOperacoes.log('SYNC_PAY_GET_TOKEN_START', { clientId }, traceId);
    try {
        const response = await axios.post(`${SYNC_PAY_API_URL}/oauth/token`, {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
        });
        LogDeOperacoes.log('SYNC_PAY_GET_TOKEN_SUCCESS', { clientId }, traceId);
        return response.data.access_token;
    } catch (error) {
        LogDeOperacoes.error('SYNC_PAY_AUTH_ERROR', { clientId, error: error.response?.data || error.message }, traceId);
        const authError = new Error('Falha na autenticação com o SyncPay.');
        authError.statusCode = 401;
        throw authError;
    }
};

/**
 * Obtém o token de acesso de um vendedor (parceiro) com base em seu ID ou e-mail.
 */
const getPartnerTokenForSeller = async (sellerIdOrEmail, traceId) => {
    if (!sellerIdOrEmail) {
        const error = new Error('ID ou e-mail do vendedor não fornecido.');
        error.statusCode = 400;
        throw error;
    }

    const user = await userRepositorio.findByEmail(sellerIdOrEmail) || await userRepositorio.findById(sellerIdOrEmail);
    if (!user) {
        const error = new Error('Vendedor não encontrado.');
        error.statusCode = 404;
        throw error;
    }

    const config = user.paymentConfigs?.syncpay;
    if (!config || !config.clientId || !config.clientSecret) {
        const error = new Error('Este vendedor ainda não configurou as credenciais de pagamento (SyncPay).');
        error.statusCode = 401; // Unauthorized or Precondition Failed
        throw error;
    }

    return await getAccessTokenInternal(config.clientId, config.clientSecret, traceId);
};

export const syncpayGatewayService = {
    /**
     * Verifica as credenciais e retorna um token.
     */
    getAuthToken: async (clientId, clientSecret, traceId) => {
        const token = await getAccessTokenInternal(clientId, clientSecret, traceId);
        return { success: true, token };
    },

    /**
     * Desconecta a conta SyncPay de um usuário.
     */
    disconnect: async (userId, traceId) => {
        LogDeOperacoes.log('SYNC_PAY_DISCONNECT_START', { userId }, traceId);
        try {
            const user = await userRepositorio.findById(userId);
            if (!user) {
                const error = new Error('Usuário não encontrado.');
                error.statusCode = 404;
                throw error;
            }

            const paymentConfigs = user.paymentConfigs || {};
            if (paymentConfigs.syncpay) {
                paymentConfigs.syncpay.isConnected = false;
                paymentConfigs.syncpay.clientId = null;
                paymentConfigs.syncpay.clientSecret = null;
            }

            await userRepositorio.update(userId, { paymentConfigs });
            LogDeOperacoes.log('SYNC_PAY_DISCONNECT_SUCCESS', { userId }, traceId);
            return { success: true, message: 'SyncPay desconectado com sucesso.' };
        } catch (error) {
            if(!error.statusCode) {
                 LogDeOperacoes.error('SYNC_PAY_DISCONNECT_ERROR', { userId, error: error.message }, traceId);
            }
            throw error;
        }
    },

    /**
     * Processa um pagamento (cash-in).
     */
    createPayment: async (paymentData, traceId) => {
        const { payload } = paymentData;
        const sellerId = payload.ownerEmail || payload.metadata?.ownerEmail || payload.sellerId;
        LogDeOperacoes.log('SYNC_PAY_CASH_IN_START', { sellerId }, traceId);
        
        try {
            const token = await getPartnerTokenForSeller(sellerId, traceId);
            const { ownerEmail, ...cleanPayload } = payload; // Remove o email do payload final

            const response = await axios.post(`${SYNC_PAY_API_URL}/v1/payments/cash-in`, cleanPayload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            LogDeOperacoes.log('SYNC_PAY_CASH_IN_SUCCESS', { transactionId: response.data.transactionId }, traceId);
            return response.data;
        } catch (error) {
             if(!error.statusCode) { // Evita log duplo de erros já tratados
                LogDeOperacoes.error('SYNC_PAY_CASH_IN_ERROR', { sellerId, error: error.response?.data || error.message }, traceId);
             }
            throw error;
        }
    },

    /**
     * Verifica o status de uma transação.
     */
    getTransactionStatus: async (statusData, traceId) => {
        const { transactionId, ownerEmail } = statusData;
        LogDeOperacoes.log('SYNC_PAY_CHECK_STATUS_START', { transactionId }, traceId);
        try {
            const token = await getPartnerTokenForSeller(ownerEmail, traceId);
            const response = await axios.get(`${SYNC_PAY_API_URL}/v1/transactions/${transactionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            LogDeOperacoes.log('SYNC_PAY_CHECK_STATUS_SUCCESS', { transactionId, status: response.data.status }, traceId);
            return response.data;
        } catch (error) {
            if(!error.statusCode) {
                LogDeOperacoes.error('SYNC_PAY_CHECK_STATUS_ERROR', { transactionId, error: error.response?.data || error.message }, traceId);
            }
            // Em caso de erro, retorna um status pendente para evitar falha na UI
            return { status: 'pending', error: error.message };
        }
    },

    /**
     * Verifica o saldo de um vendedor.
     */
    getBalance: async (balanceData, traceId) => {
        const { email } = balanceData;
        LogDeOperacoes.log('SYNC_PAY_BALANCE_START', { email }, traceId);
        try {
            const token = await getPartnerTokenForSeller(email, traceId);
            const response = await axios.get(`${SYNC_PAY_API_URL}/v1/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            LogDeOperacoes.log('SYNC_PAY_BALANCE_SUCCESS', { email }, traceId);
            const balance = parseFloat(response.data.balance || 0);
            return { balance };
        } catch (error) {
            if(!error.statusCode) {
                LogDeOperacoes.error('SYNC_PAY_BALANCE_ERROR', { email, error: error.response?.data || error.message }, traceId);
            }
            throw error;
        }
    }
};
