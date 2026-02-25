
import express from 'express';
import stripeController from '../controles/Controles.Provedor.Stripe.js';

const router = express.Router();

// --- Gestão da Conta Stripe ---

// @route   POST /api/stripe/account-link
// @desc    Cria um link de onboarding do Stripe
router.post('/account-link', stripeController.createAccountLink);

// @route   GET /api/stripe/account-details
// @desc    Busca detalhes da conta Stripe conectada
router.get('/account-details', stripeController.getAccountDetails);

// @route   DELETE /api/stripe/disconnect
// @desc    Desconecta a conta Stripe
router.delete('/disconnect', stripeController.disconnectAccount);


// --- Processamento de Pagamento Stripe ---

// @route   POST /api/stripe/create
// @desc    Cria uma intenção de pagamento
router.post('/create', stripeController.createPaymentIntent);

// @route   POST /api/stripe/status/:sessionId
// @desc    Verifica o status de uma sessão de pagamento
router.post('/status/:sessionId', stripeController.checkSessionStatus);


export default router;
