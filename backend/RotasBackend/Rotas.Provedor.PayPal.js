
import express from 'express';
import payPalController from '../controles/Controles.Provedor.PayPal.js';

const router = express.Router();

// --- Gestão da Conta PayPal ---

// @route   POST /api/paypal/account-link
// @desc    Cria um link de conexão de conta
router.post('/account-link', payPalController.createAccountLink);

// @route   GET /api/paypal/account-details
// @desc    Busca detalhes da conta conectada
router.get('/account-details', payPalController.getAccountDetails);

// @route   DELETE /api/paypal/disconnect
// @desc    Desconecta a conta
router.delete('/disconnect', payPalController.disconnectAccount);


// --- Processamento de Pagamento PayPal ---

// @route   POST /api/paypal/create-order
// @desc    Cria uma ordem de pagamento
router.post('/create-order', payPalController.createOrder);

// @route   POST /api/paypal/check-status/:orderId
// @desc    Verifica o status de uma ordem
router.post('/check-status/:orderId', payPalController.checkOrderStatus);


export default router;
