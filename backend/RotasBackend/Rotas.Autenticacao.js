
import express from 'express';
import authControle from '../controles/Controles.Autenticacao.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar um novo usuário
// @access  Public
router.post('/register', authControle.registerUser);

// @route   POST /api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post('/login', authControle.loginUser);


export default router;
