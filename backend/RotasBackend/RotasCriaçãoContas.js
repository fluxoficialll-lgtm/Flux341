
import express from 'express';
import usuariosControle from '../controles/Controles.Usuarios.js';

const router = express.Router();

// @route   POST /auth/register
// @desc    Registrar um novo usuário
// @access  Public
router.post('/register', usuariosControle.criarUsuario);

// Adicionar outras rotas de autenticação aqui no futuro (ex: login, logout)

export default router;
