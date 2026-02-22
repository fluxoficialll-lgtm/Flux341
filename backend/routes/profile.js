
import express from 'express';
import profileControle from '../controles/profileControle.js';

const router = express.Router();

// Rota para obter dados do perfil para edição
router.get('/edit', profileControle.getProfileForEdit);

// Rota para obter dados do perfil público de um usuário
router.get('/:username', profileControle.getPublicProfile);

export default router;
