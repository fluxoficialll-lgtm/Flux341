
import { paypalService } from '../../ServiçosBackEnd/paypalService.js';
import { userRepositorio } from '../../GerenciadoresDeDados/user.repositorio.js';

const paypalControle = {
    // Rota para verificar credenciais do PayPal e obter um token
    getAuthToken: async (req, res) => {
        req.logger.log('PAYPAL_AUTH_TOKEN_START', { body: req.body });
        try {
            const { clientId, clientSecret } = req.body;
            const token = await paypalService.verifyCredentials(clientId, clientSecret);
            req.logger.log('PAYPAL_AUTH_TOKEN_SUCCESS', { clientId });
            res.json({ success: true, token });
        } catch (e) {
            req.logger.error('PAYPAL_AUTH_TOKEN_ERROR', { error: e.message, stack: e.stack });
            res.status(401).json({ error: e.message });
        }
    },

    // Rota para desconectar a conta do PayPal de um usuário
    disconnect: async (req, res) => {
        req.logger.log('PAYPAL_DISCONNECT_START', { userId: req.user.id });
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
            if (paymentConfigs.paypal) {
                paymentConfigs.paypal.isConnected = false;
                paymentConfigs.paypal.clientId = null;
                paymentConfigs.paypal.clientSecret = null;
            }

            await userRepositorio.update(userId, { paymentConfigs });

            req.logger.log('PAYPAL_DISCONNECT_SUCCESS', { userId });
            res.json({ success: true, message: 'PayPal desconectado com sucesso.' });
        } catch (error) {
            req.logger.error('PAYPAL_DISCONNECT_ERROR', { userId: req.user.id, error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Falha ao desconectar o provedor.' });
        }
    },

    // Rota para criar uma ordem de pagamento no PayPal
    createOrder: async (req, res) => {
        req.logger.log('PAYPAL_CREATE_ORDER_START', { body: req.body });
        try {
            const { amount, currency, description, clientId, clientSecret } = req.body;
            if (!clientId || !clientSecret) {
                return res.status(400).json({ error: "Credenciais do vendedor ausentes." });
            }
            const order = await paypalService.createOrder(clientId, clientSecret, amount, currency, description);
            req.logger.log('PAYPAL_CREATE_ORDER_SUCCESS', { orderId: order.id });
            res.json(order);
        } catch (e) {
            req.logger.error('PAYPAL_CREATE_ORDER_ERROR', { error: e.message, stack: e.stack });
            res.status(500).json({ error: e.message });
        }
    },

    // Rota para verificar o status de uma ordem de pagamento
    checkStatus: async (req, res) => {
        req.logger.log('PAYPAL_CHECK_STATUS_START', { body: req.body });
        try {
            const { orderId, clientId, clientSecret } = req.body;
            if (!clientId || !clientSecret) {
                return res.status(400).json({ error: "Credenciais do vendedor ausentes." });
            }
            const result = await paypalService.checkStatus(clientId, clientSecret, orderId);
            req.logger.log('PAYPAL_CHECK_STATUS_SUCCESS', { orderId: orderId, status: result.status });
            res.json(result);
        } catch (e) {
            req.logger.error('PAYPAL_CHECK_STATUS_ERROR', { orderId: req.body.orderId, error: e.message, stack: e.stack });
            res.status(500).json({ error: e.message });
        }
    }
};

export default paypalControle;
