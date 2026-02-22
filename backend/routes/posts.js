
import express from 'express';
import postsControle from '../controles/postsControle.js';

const router = express.Router();

// Listar Posts (Feed) com Paginação
router.get('/', postsControle.listPosts);

// Criar Post
router.post('/create', postsControle.createPost);

// Interagir (Like / Unlike) com um Post
router.post('/:id/interact', postsControle.interactWithPost);

// Adicionar Comentário
router.post('/:id/comment', postsControle.addComment);

// Deletar Post
router.delete('/:id', postsControle.deletePost);

export default router;
