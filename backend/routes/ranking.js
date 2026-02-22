
import express from 'express';
import rankingControle from '../controles/rankingControle.js';

const router = express.Router();

router.get('/followers', rankingControle.getFollowerRanking);

export default router;
