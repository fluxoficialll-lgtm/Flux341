
import express from 'express';
import moderationControle from '../controles/moderationControle.js';

const router = express.Router();

router.post('/analyze', moderationControle.analyzeContent);

export default router;
