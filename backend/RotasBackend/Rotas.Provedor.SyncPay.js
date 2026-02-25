
import express from 'express';
import syncPayController from '../controles/Controles.Provedor.SyncPay.js';

const router = express.Router();

// --- Gestão da Conta SyncPay ---

// @route   POST /api/syncpay/credentials
// @desc    Salva as credenciais do vendedor
router.post('/credentials', syncPayController.saveCredentials);

// @route   DELETE /api/syncpay/disconnect
// @desc    Desconecta a conta do vendedor
router.delete('/disconnect', syncPayController.disconnectAccount);


// --- Processamento de Pagamento SyncPay ---

// @route   POST /api/syncpay/charge
// @desc    Cria uma nova cobrança (pagamento)
router.post('/charge', syncPayController.createPayment);

// @route   POST /api/syncpay/status
// @desc    Verifica o status de uma transação
router.post('/status', syncPayController.checkTransactionStatus);


export default router;
