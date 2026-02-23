
import express from 'express';
import authControle from '../controles/authControle.js';

const router = express.Router();

// Rota de Registro
router.post('/register', authContole.register);

// Rota de Login
router.post('/login', authContole.login);

// Rota de autenticação com Google (CORRIGIDO)
router.post('/google', authContole.loginComGoogle);

export default router;
