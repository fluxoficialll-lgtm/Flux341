
import express from 'express';
import authControle from '../controles/authControle.js';

const router = express.Router();

// Rota de Registro
router.post('/register', authControle.register);

// Rota de Login
router.post('/login', authControle.login);

// Rota de autenticação com Google
router.post('/auth/google', authControle.loginComGoogle);

export default router;
