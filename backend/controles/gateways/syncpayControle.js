
import { syncPayService } from '../../ServiçosBackEnd/syncpayService.js';
import { userRepositorio } from '../../GerenciadoresDeDados/user.repositorio.js';

// Função auxiliar refatorada para usar o repositório de usuário e logging
async function getPartnerTokenForSeller(logger, sellerIdOrEmail) {
    if (!sellerIdOrEmail) return null;
    
    const user = await userRepositorio.findByEmail(sellerIdOrEmail) || await userRepositorio.findById(sellerIdOrEmail);
    if (!user) {
        logger.warn('SYNC_PAY_PROXY_SELLER_NOT_FOUND', { sellerIdOrEmail });
        return null;
    }

    const config = user.paymentConfigs?.syncpay;
    if (!config || !config.clientId || !config.clientSecret) {
        logger.warn('SYNC_PAY_PROXY_NO_CREDENTIALS', { sellerIdOrEmail });
        return null;
    }

    return await syncPayService.getAccessToken(config.clientId, config.clientSecret);
}

const syncpayControle = {
    // Rota para obter um token de autenticação do SyncPay
    getAuthToken: async (req, res) => {
        req.logger.log('SYNC_PAY_AUTH_TOKEN_START', { body: req.body });
        try {
            const { clientId, clientSecret } = req.body;
            if (!clientId || !clientSecret) {
                return res.status(400).json({ error: 'Credenciais ausentes no corpo da requisição.' });
            }
            const token = await syncPayService.getAccessToken(clientId, clientSecret);
            req.logger.log('SYNC_PAY_AUTH_TOKEN_SUCCESS', { clientId });
            res.json({ success: true, token });
        } catch (e) {
            req.logger.error('SYNC_PAY_AUTH_TOKEN_ERROR', { error: e.message, stack: e.stack });
            res.status(401).json({ error: e.message });
        }
    },

    // Rota para desconectar o SyncPay de um usuário
    disconnect: async (req, res) => {
        req.logger.log('SYNC_PAY_DISCONNECT_START', { userId: req.user.id });
        try {
            const userId = req.user.id;
            const user = await userRepositorio.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const paymentConfigs = user.paymentConfigs || {};
            if (paymentConfigs.syncpay) {
                paymentConfigs.syncpay.isConnected = false;
                paymentConfigs.syncpay.clientId = null;
                paymentConfigs.syncpay.clientSecret = null;
            }

            await userRepositorio.update(userId, { paymentConfigs });

            req.logger.log('SYNC_PAY_DISCONNECT_SUCCESS', { userId });
            res.json({ success: true, message: 'SyncPay desconectado com sucesso.' });
        } catch (error) {
            req.logger.error('SYNC_PAY_DISCONNECT_ERROR', { userId: req.user.id, error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Falha ao desconectar o provedor.' });
        }
    },

    // Rota para processar um pagamento (cash-in)
    cashIn: async (req, res) => {
        req.logger.log('SYNC_PAY_CASH_IN_START', { body: req.body });
        try {
            const { payload } = req.body;
            const sellerId = payload.ownerEmail || payload.metadata?.ownerEmail || payload.sellerId;
            
            const token = await getPartnerTokenForSeller(req.logger, sellerId);
            if (!token) {
                return res.status(401).json({ error: 'Este vendedor ainda não configurou as credenciais de pagamento (SyncPay).' });
            }
            
            const { ownerEmail, ...cleanPayload } = payload;
            
            const result = await syncPayService.createPayment(token, cleanPayload);
            req.logger.log('SYNC_PAY_CASH_IN_SUCCESS', { transactionId: result.transactionId });
            res.json(result);
        } catch (e) {
            req.logger.error('SYNC_PAY_CASH_IN_ERROR', { error: e.message, stack: e.stack });
            res.status(500).json({ error: e.message });
        }
    },

    // Rota para verificar o status de uma transação
    checkStatus: async (req, res) => {
        req.logger.log('SYNC_PAY_CHECK_STATUS_START', { body: req.body });
        try {
            const { transactionId, ownerEmail } = req.body;
            const token = await getPartnerTokenForSeller(req.logger, ownerEmail);
            if (!token) return res.status(401).json({ error: 'Não autorizado ou vendedor não configurado.' });
            
            const txData = await syncPayService.getTransactionStatus(token, transactionId);
            req.logger.log('SYNC_PAY_CHECK_STATUS_SUCCESS', { transactionId, status: txData.status });
            res.json(txData);
        } catch (e) {
            req.logger.error('SYNC_PAY_CHECK_STATUS_ERROR', { transactionId: req.body.transactionId, error: e.message, stack: e.stack });
            res.json({ status: 'pending', error: e.message });
        }
    },

    // Rota para verificar o saldo de um vendedor
    getBalance: async (req, res) => {
        req.logger.log('SYNC_PAY_BALANCE_START', { body: req.body });
        try {
            const { email } = req.body;
            const token = await getPartnerTokenForSeller(req.logger, email);
            if (!token) return res.status(401).json({ error: 'Não autorizado.' });
            
            const data = await syncPayService.getBalance(token);
            req.logger.log('SYNC_PAY_BALANCE_SUCCESS', { email });
            res.json({ balance: parseFloat(data.balance || 0) });
        } catch (e) {
            req.logger.error('SYNC_PAY_BALANCE_ERROR', { email: req.body.email, error: e.message, stack: e.stack });
            res.status(500).json({ error: e.message });
        }
    }
};

export default syncpayControle;
