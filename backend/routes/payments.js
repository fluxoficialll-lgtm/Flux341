
import express from 'express';
import paymentsControle from '../controles/paymentsControle.js';

const router = express.Router();

router.post('/process-sale-success', paymentsControle.processSaleSuccess);

export default router;
