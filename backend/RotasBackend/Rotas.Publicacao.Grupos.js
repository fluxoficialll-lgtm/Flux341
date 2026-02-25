
import express from 'express';
import gruposControle from '../controles/Controles.Grupos.js';

const router = express.Router();

// @route   POST /groups
// @desc    Criar um novo grupo
// @access  Private
router.post('/', gruposControle.createGroup);

// @route   GET /groups
// @desc    Listar todos os grupos
// @access  Public
router.get('/', gruposControle.getAllGroups);

// @route   GET /groups/:groupId
// @desc    Obter detalhes de um grupo específico
// @access  Public
router.get('/:groupId', gruposControle.getGroupById);

// @route   POST /groups/:groupId/join
// @desc    Entrar em um grupo
// @access  Private
router.post('/:groupId/join', gruposControle.joinGroup);

// @route   GET /groups/:groupId/members
// @desc    Listar membros de um grupo
// @access  Public
router.get('/:groupId/members', gruposControle.getGroupMembers);

export default router;
