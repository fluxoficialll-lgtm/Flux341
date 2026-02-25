
import express from 'express';
import feedControle from '../controles/Controles.Feed.js';

const router = express.Router();

// @route   POST /
// @desc    Criar um novo post no feed
// @access  Private
router.post('/', feedControle.createPost);

// @route   GET /
// @desc    Obter todos os posts do feed
// @access  Public
router.get('/', feedControle.getAllPosts);

// @route   GET /:postId
// @desc    Obter um post específico do feed
// @access  Public
router.get('/:postId', feedContole.getPostById);

// @route   PUT /:postId
// @desc    Atualizar um post do feed
// @access  Private
router.put('/:postId', feedControle.updatePost);

// @route   DELETE /:postId
// @desc    Deletar um post do feed
// @access  Private
router.delete('/:postId', feedControle.deletePost);

export default router;
