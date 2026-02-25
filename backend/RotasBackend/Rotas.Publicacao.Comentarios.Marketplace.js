
import express from 'express';
import comentariosMarketplaceControle from '../controles/Controles.Comentarios.Marketplace.js';

// Este router será montado sob /api/marketplace/:itemId/comments
const router = express.Router({ mergeParams: true });

// @route   POST /
// @desc    Criar um novo comentário em um item do marketplace
// @access  Private
router.post('/', comentariosMarketplaceControle.createComment);

// @route   GET /
// @desc    Obter todos os comentários de um item do marketplace
// @access  Public
router.get('/', comentariosMarketplaceControle.getCommentsForItem);

// @route   PUT /:commentId
// @desc    Atualizar um comentário
// @access  Private
router.put('/:commentId', comentariosMarketplaceControle.updateComment);

// @route   DELETE /:commentId
// @desc    Deletar um comentário
// @access  Private
router.delete('/:commentId', comentariosMarketplaceControle.deleteComment);

export default router;
