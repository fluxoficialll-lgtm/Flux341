
import express from 'express';
import syncpayControle from '../../controles/gateways/syncpayControle.js';

const router = express.Router();

// Rota para obter um token de autenticação do SyncPay
router.post('/auth-token', syncpayControle.getAuthToken);

// Rota para desconectar o SyncPay de um usuário
router.post('/disconnect', syncpayControle.disconnect);

// Rota para processar um pagamento (cash-in)
router.post('/cash-in', syncpayControle.cashIn);

// Rota para verificar o status de uma transação
router.post('/check-status', syncpayControle.checkStatus);

// Rota para verificar o saldo de um vendedor
router.post('/balance', syncpayControle.getBalance);

export default router;
