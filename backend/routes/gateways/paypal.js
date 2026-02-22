
import express from 'express';
import paypalControle from '../../controles/gateways/paypalControle.js';

const router = express.Router();

// Rota para verificar credenciais do PayPal e obter um token
router.post('/auth-token', paypalControle.getAuthToken);

// Rota para desconectar a conta do PayPal de um usuário
router.post('/disconnect', paypalControle.disconnect);

// Rota para criar uma ordem de pagamento no PayPal
router.post('/create-order', paypalControle.createOrder);

// Rota para verificar o status de uma ordem de pagamento
router.post('/check-status', paypalControle.checkStatus);

export default router;
