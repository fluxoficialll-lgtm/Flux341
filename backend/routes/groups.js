
import express from 'express';
import groupsControle from '../controles/groupsControle.js';

const router = express.Router();

// Listar todos os grupos
router.get('/', groupsControle.listGroups);

// Ranking de grupos por volume de membros
router.get('/ranking', groupsControle.getGroupRanking);

// Obter detalhes de um grupo específico
router.get('/:id', groupsControle.getGroupById);

// Criar um novo grupo
router.post('/create', groupsControle.createGroup);

// Atualizar um grupo existente
router.put('/:id', groupsControle.updateGroup);

// Deletar um grupo
router.delete('/:id', groupsControle.deleteGroup);

export default router;
