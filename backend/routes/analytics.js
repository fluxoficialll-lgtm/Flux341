
import express from 'express';
import analyticsControle from '../controles/analyticsControle.js';
import { validateAdmin } from '../middleware.js';

const router = express.Router();

// Aplica o middleware de administrador a todas as rotas neste arquivo
router.use(validateAdmin);

/**
 * GET /api/analytics/payment-ranking
 * Retorna um ranking de pagamentos, opcionalmente filtrado por país.
 */
router.get('/payment-ranking', analyticsControle.getPaymentRanking);

/**
 * GET /api/analytics/user/:userId/payment-ranking
 * Retorna o ranking de pagamentos para um vendedor específico.
 */
router.get('/user/:userId/payment-ranking', analyticsControle.getSellerPaymentRanking);

/**
 * POST /api/analytics/log-payment-method
 * Endpoint manual para registrar o uso de um método de pagamento.
 */
router.post('/log-payment-method', analyticsControle.logPaymentMethod);

export default router;
