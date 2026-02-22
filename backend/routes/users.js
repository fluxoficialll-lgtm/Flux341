
import express from 'express';
import usersControle from '../controles/usersControle.js';

const router = express.Router();

// Endpoint de busca de usuários
router.get('/search', usersControle.searchUsers);

// Endpoint para obter um usuário para atualização
router.get('/update', usersControle.getUserForUpdate);

// Endpoint para atualizar um usuário
router.put('/update', usersControle.updateUser);

export default router;
