
import express from 'express';
import reelsControle from '../controles/Controles.Reels.js';
import rotasComentariosReels from './Rotas.Publicacao.Comentarios.Reels.js';

const router = express.Router();

// @route   POST /reels
// @desc    Criar um novo Reel
// @access  Private
router.post('/', reelsControle.createReel);

// @route   GET /reels
// @desc    Obter todos os Reels
// @access  Public
router.get('/', reelsControle.getAllReels);

// @route   GET /reels/:reelId
// @desc    Obter um Reel específico
// @access  Public
router.get('/:reelId', reelsControle.getReelById);

// Aninhando as rotas de comentários
// /api/reels/:reelId/comments
router.use('/:reelId/comments', rotasComentariosReels);


export default router;
