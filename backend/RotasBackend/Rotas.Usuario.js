
import express from 'express';
import userControle from '../controles/Controles.Usuario.js';
// Middleware para proteger rotas
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   PUT /api/users/:userId
// @desc    Atualizar perfil do usuário
// @access  Private (precisará de token)
router.put('/:userId', userControle.updateUserProfile);

export default router;
