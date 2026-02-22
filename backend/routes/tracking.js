
import express from 'express';
import trackingControle from '../controles/trackingControle.js';

const router = express.Router();

router.post('/capi', trackingControle.handleCapiEvent);
router.get('/pixel-info', trackingControle.getPixelInfo);

export default router;
