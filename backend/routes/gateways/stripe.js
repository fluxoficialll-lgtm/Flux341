
import express from 'express';
import stripeControle from '../../controles/gateways/stripeControle.js';

const router = express.Router();

// Rota para verificar as credenciais do Stripe
router.post('/auth-token', stripeControle.getAuthToken);

// Rota para desconectar a conta do Stripe de um usuário
router.post('/disconnect', stripeControle.disconnect);

// Rota para criar uma sessão de checkout do Stripe
router.post('/create-session', stripeControle.createSession);

// Rota para verificar o status de uma sessão de checkout do Stripe
router.post('/check-status', stripeControle.checkStatus);

export default router;
