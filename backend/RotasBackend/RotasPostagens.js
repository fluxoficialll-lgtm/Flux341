
import express from 'express';
import postagensControle from '../controles/Controles.Postagens.js';

const router = express.Router();

// @route   POST /posts
// @desc    Criar uma nova postagem
// @access  Private
router.post('/', postagensControle.createPost);

// @route   GET /posts/:groupId
// @desc    Obter postagens de um grupo
// @access  Public
router.get('/:groupId', postagensControle.getPosts);

export default router;
