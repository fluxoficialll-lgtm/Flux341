
import express from 'express';
import usuariosControle from '../controles/Controles.Usuarios.js';

const router = express.Router();

// @route   GET /users/search
// @desc    Pesquisar usuários
// @access  Private
router.get('/search', usuariosControle.searchUsers);

// @route   GET /users/update
// @desc    Obter dados do usuário para atualização
// @access  Private
router.get('/update', usuariosControle.getUserForUpdate);

// @route   PUT /users/update
// @desc    Atualizar dados do usuário
// @access  Private
router.put('/update', usuariosControle.updateUser);

export default router;
