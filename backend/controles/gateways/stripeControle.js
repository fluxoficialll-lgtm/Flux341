
import { stripeService } from '../../ServiçosBackEnd/stripeService.js';
import { userRepositorio } from '../../GerenciadoresDeDados/user.repositorio.js';

const stripeControle = {
    // Rota para verificar as credenciais do Stripe
    getAuthToken: async (req, res) => {
        req.logger.log('STRIPE_AUTH_TOKEN_START', { body: req.body });
        try {
            const { secretKey } = req.body;
            const data = await stripeService.verifyCredentials(secretKey);
            req.logger.log('STRIPE_AUTH_TOKEN_SUCCESS');
            res.json({ success: true, data });
        } catch (e) {
            req.logger.error('STRIPE_AUTH_TOKEN_ERROR', { error: e.message, stack: e.stack });
            res.status(401).json({ error: e.message });
        }
    },

    // Rota para desconectar a conta do Stripe de um usuário
    disconnect: async (req, res) => {
        req.logger.log('STRIPE_DISCONNECT_START', { userId: req.user.id });
        try {
            const userId = req.user.id;
            if (!userId) {
                return res.status(401).json({ error: 'Usuário não autenticado.' });
            }

            const user = await userRepositorio.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const paymentConfigs = user.paymentConfigs || {};
            if (paymentConfigs.stripe) {
                paymentConfigs.stripe.isConnected = false;
                paymentConfigs.stripe.secretKey = null;
            }

            await userRepositorio.update(userId, { paymentConfigs });

            req.logger.log('STRIPE_DISCONNECT_SUCCESS', { userId });
            res.json({ success: true, message: 'Stripe desconectado com sucesso.' });
        } catch (error) {
            req.logger.error('STRIPE_DISCONNECT_ERROR', { userId: req.user.id, error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Falha ao desconectar o provedor.' });
        }
    },

    // Rota para criar uma sessão de checkout do Stripe
    createSession: async (req, res) => {
        req.logger.log('STRIPE_CREATE_SESSION_START', { body: req.body });
        try {
            const { group, successUrl, cancelUrl } = req.body;
            const ownerEmail = req.user.email;

            const session = await stripeService.createCheckoutSession(group, ownerEmail, successUrl, cancelUrl);
            req.logger.log('STRIPE_CREATE_SESSION_SUCCESS', { sessionId: session.id, groupId: group.id });
            res.json(session);
        } catch (e) {
            req.logger.error('STRIPE_CREATE_SESSION_ERROR', { error: e.message, stack: e.stack });
            res.status(500).json({ error: e.message });
        }
    },

    // Rota para verificar o status de uma sessão de checkout do Stripe
    checkStatus: async (req, res) => {
        req.logger.log('STRIPE_CHECK_STATUS_START', { body: req.body });
        try {
            const { sessionId } = req.body;
            const ownerEmail = req.user.email;

            const result = await stripeService.checkStatus(sessionId, ownerEmail);
            req.logger.log('STRIPE_CHECK_STATUS_SUCCESS', { sessionId, status: result.status });
            res.json(result);
        } catch (e) {
            req.logger.error('STRIPE_CHECK_STATUS_ERROR', { sessionId: req.body.sessionId, error: e.message, stack: e.stack });
            res.status(500).json({ error: e.message });
        }
    }
};

export default stripeControle;
