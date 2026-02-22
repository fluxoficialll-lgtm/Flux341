
import { paypalGatewayService } from '../../ServiçosBackEnd/Gateways/paypalGatewayService.js';

const paypalControle = {
    /**
     * Rota para verificar credenciais do PayPal e obter um token.
     */
    getAuthToken: async (req, res) => {
        try {
            const { clientId, clientSecret } = req.body;
            const result = await paypalGatewayService.verifyCredentials(clientId, clientSecret, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 401).json({ error: e.message });
        }
    },

    /**
     * Rota para desconectar a conta do PayPal de um usuário.
     */
    disconnect: async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await paypalGatewayService.disconnect(userId, req.traceId);
            res.json(result);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message || 'Falha ao desconectar o provedor.' });
        }
    },

    /**
     * Rota para criar uma ordem de pagamento no PayPal.
     */
    createOrder: async (req, res) => {
        try {
            const order = await paypalGatewayService.createOrder(req.body, req.traceId);
            res.json(order);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    /**
     * Rota para verificar o status de uma ordem de pagamento.
     */
    checkStatus: async (req, res) => {
        try {
            const result = await paypalGatewayService.checkStatus(req.body, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    }
};

export default paypalControle;
