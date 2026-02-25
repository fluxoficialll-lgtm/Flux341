
import express from 'express';
import gruposControle from '../controles/Controles.Grupos.js';

const router = express.Router();

// @route   GET /groups
// @desc    Obter todos os grupos
// @access  Public
router.get('/', gruposControle.getGroups);

// @route   GET /groups/user-groups
// @desc    Obter grupos do usuário
// @access  Private
router.get('/user-groups', gruposControle.getUserGroups);

// @route   POST /groups
// @desc    Criar um novo grupo
// @access  Private
router.post('/', gruposControle.createGroup);

export default router;
