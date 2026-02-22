
import { stripeGatewayService } from '../../ServiçosBackEnd/Gateways/stripeGatewayService.js';

const stripeControle = {
    /**
     * Rota para verificar as credenciais do Stripe.
     */
    getAuthToken: async (req, res) => {
        try {
            const { secretKey } = req.body;
            const result = await stripeGatewayService.verifyCredentials(secretKey, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 401).json({ error: e.message });
        }
    },

    /**
     * Rota para desconectar a conta do Stripe de um usuário.
     */
    disconnect: async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await stripeGatewayService.disconnect(userId, req.traceId);
            res.json(result);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message || 'Falha ao desconectar o provedor.' });
        }
    },

    /**
     * Rota para criar uma sessão de checkout do Stripe.
     */
    createSession: async (req, res) => {
        try {
            const sessionData = { ...req.body, userId: req.user.id };
            const session = await stripeGatewayService.createCheckoutSession(sessionData, req.traceId);
            res.json(session);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    /**
     * Rota para verificar o status de uma sessão de checkout do Stripe.
     */
    checkStatus: async (req, res) => {
        try {
            const statusData = { ...req.body, userId: req.user.id };
            const result = await stripeGatewayService.checkStatus(statusData, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    }
};

export default stripeControle;
