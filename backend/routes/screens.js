
import express from 'express';
import screensControle from '../controles/screensControle.js';

const router = express.Router();

router.get('/my-business', screensControle.getMyBusinessScreen);

export default router;
