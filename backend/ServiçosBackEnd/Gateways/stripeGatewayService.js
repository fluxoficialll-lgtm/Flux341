
import Stripe from 'stripe';
import { userRepositorio } from '../../GerenciadoresDeDados/user.repositorio.js';
import { LogDeOperacoes } from '../ServiçosDeLogsSofisticados/LogDeOperacoes.js';

/**
 * Inicializa o cliente Stripe com a chave secreta.
 */
const getStripeClient = (secretKey) => {
    if (!secretKey) {
        throw new Error("Chave secreta do Stripe não fornecida.");
    }
    return new Stripe(secretKey);
};

/**
 * Obtém o usuário e sua chave secreta do Stripe.
 */
const getUserWithStripeKey = async (userId, traceId) => {
    const user = await userRepositorio.findById(userId);
    if (!user) {
        const error = new Error('Usuário não encontrado.');
        error.statusCode = 404;
        throw error;
    }
    const secretKey = user.paymentConfigs?.stripe?.secretKey;
    if (!secretKey) {
        const error = new Error('Chave secreta do Stripe não configurada para este usuário.');
        error.statusCode = 400;
        throw error;
    }
    return { user, secretKey };
};

export const stripeGatewayService = {
    /**
     * Verifica as credenciais do Stripe fazendo uma chamada à API.
     */
    verifyCredentials: async (secretKey, traceId) => {
        LogDeOperacoes.log('STRIPE_VERIFY_CREDENTIALS_START', {}, traceId);
        try {
            const stripe = getStripeClient(secretKey);
            const account = await stripe.account.retrieve();
            LogDeOperacoes.log('STRIPE_VERIFY_CREDENTIALS_SUCCESS', { accountId: account.id }, traceId);
            return { success: true, account };
        } catch (error) {
            LogDeOperacoes.error('STRIPE_VERIFY_CREDENTIALS_ERROR', { error: error.message }, traceId);
            const authError = new Error('Credenciais do Stripe inválidas.');
            authError.statusCode = 401;
            throw authError;
        }
    },

    /**
     * Cria uma sessão de checkout do Stripe.
     */
    createCheckoutSession: async (sessionData, traceId) => {
        const { group, userId, successUrl, cancelUrl } = sessionData;
        LogDeOperacoes.log('STRIPE_CREATE_SESSION_START', { groupId: group.id, userId }, traceId);

        try {
            const { secretKey } = await getUserWithStripeKey(group.ownerId, traceId);
            const stripe = getStripeClient(secretKey);

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: group.name,
                            description: group.description || 'Assinatura de grupo na Flux Platform',
                        },
                        unit_amount: group.price * 100, // Preço em centavos
                    },
                    quantity: 1,
                }],
                mode: 'payment', // ou 'subscription' se for recorrente
                success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: cancelUrl,
                client_reference_id: userId, // ID do usuário que está comprando
                metadata: {
                    groupId: group.id,
                    groupOwnerId: group.ownerId
                }
            });

            LogDeOperacoes.log('STRIPE_CREATE_SESSION_SUCCESS', { sessionId: session.id, groupId: group.id }, traceId);
            return { id: session.id, url: session.url };
        
        } catch (error) {
            LogDeOperacoes.error('STRIPE_CREATE_SESSION_ERROR', { groupId: group.id, error: error.message }, traceId);
            // Não vazar a chave secreta no erro
            if (error.statusCode) throw error;
            throw new Error('Falha ao criar sessão de checkout do Stripe.');
        }
    },

    /**
     * Verifica o status de uma sessão de checkout.
     */
    checkStatus: async (statusData, traceId) => {
        const { sessionId, userId } = statusData;
        LogDeOperacoes.log('STRIPE_CHECK_STATUS_START', { sessionId, userId }, traceId);
        
        try {
            // Para verificar o status, precisamos da chave secreta do VENDEDOR (group owner)
            // A sessão do Stripe contém o ID do cliente, mas não o do vendedor diretamente.
            // Assumimos que o client_reference_id é o comprador. Precisamos de uma forma de ligar a sessão ao vendedor.
            // Uma abordagem seria buscar a sessão, ler os metadados para pegar o groupOwnerId e então pegar a chave.
            // Esta é uma simplificação. Uma implementação real pode precisar de uma tabela de lookup.

            // Solução simplificada: Por enquanto, vamos assumir que o `userId` é do dono do grupo para buscar a chave.
            // Isso é uma INCONSISTÊNCIA que precisaria ser resolvida em um cenário real.
            const { secretKey } = await getUserWithStripeKey(userId, traceId); // ATENÇÃO: INCONSISTÊNCIA ASSUMIDA
            const stripe = getStripeClient(secretKey);

            const session = await stripe.checkout.sessions.retrieve(sessionId);
            
            let status = 'pending';
            if (session.payment_status === 'paid') {
                status = 'paid';
            }

            LogDeOperacoes.log('STRIPE_CHECK_STATUS_SUCCESS', { sessionId, status }, traceId);
            return { status, details: session };

        } catch (error) {
             LogDeOperacoes.error('STRIPE_CHECK_STATUS_ERROR', { sessionId, error: error.message }, traceId);
             if (error.statusCode) throw error;
             throw new Error('Falha ao verificar status da sessão no Stripe.');
        }
    },

    /**
     * Desconecta a conta do Stripe de um usuário.
     */
    disconnect: async (userId, traceId) => {
        LogDeOperacoes.log('STRIPE_DISCONNECT_START', { userId }, traceId);
        try {
            const { user } = await getUserWithStripeKey(userId, traceId); // Reutiliza para encontrar o usuário

            const paymentConfigs = user.paymentConfigs || {};
            if (paymentConfigs.stripe) {
                paymentConfigs.stripe.isConnected = false;
                paymentConfigs.stripe.secretKey = null;
            }

            await userRepositorio.update(userId, { paymentConfigs });

            LogDeOperacoes.log('STRIPE_DISCONNECT_SUCCESS', { userId }, traceId);
            return { success: true, message: 'Stripe desconectado com sucesso.' };

        } catch (error) {
            if (!error.statusCode) { // Evita log duplo se o erro já foi tratado (ex: user not found)
                 LogDeOperacoes.error('STRIPE_DISCONNECT_ERROR', { userId, error: error.message, stack: error.stack }, traceId);
            }
            throw error; // Lança para o controlador
        }
    }
};
