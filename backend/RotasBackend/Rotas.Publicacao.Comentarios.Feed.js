
import express from 'express';
import comentariosControle from '../controles/Controles.Comentarios.js';

// Este router será montado sob /api/posts/:postId/comments
const router = express.Router({ mergeParams: true });

// @route   POST /
// @desc    Criar um novo comentário em um post
// @access  Private
router.post('/', comentariosControle.createComment);

// @route   GET /
// @desc    Obter todos os comentários de um post
// @access  Public
router.get('/', comentariosControle.getCommentsForPost);

// @route   PUT /:commentId
// @desc    Atualizar um comentário
// @access  Private
router.put('/:commentId', comentariosControle.updateComment);

// @route   DELETE /:commentId
// @desc    Deletar um comentário
// @access  Private
router.delete('/:commentId', comentariosControle.deleteComment);

export default router;
