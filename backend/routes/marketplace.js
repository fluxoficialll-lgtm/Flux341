
import express from 'express';
import marketplaceControle from '../controles/marketplaceControle.js';

const router = express.Router();

// Listar itens do marketplace com filtros
router.get('/', marketplaceControle.listItems);

// Buscar item específico
router.get('/:id', marketplaceControle.getItemById);

// Criar ou atualizar item
router.post('/create', marketplaceControle.createItem);

// Endpoint de atualização parcial
router.patch('/:id', marketplaceControle.updateItem);

// Deletar item
router.delete('/:id', marketplaceControle.deleteItem);

export default router;
