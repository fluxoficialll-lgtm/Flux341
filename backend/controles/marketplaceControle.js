
import { marketplaceService } from '../ServiçosBackEnd/marketplaceService.js';

const marketplaceControle = {
    // Listar itens do marketplace com filtros
    listItems: async (req, res) => {
        try {
            const items = await marketplaceService.listItems(req.query);
            res.json({ data: items });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Buscar item específico
    getItemById: async (req, res) => {
        try {
            const item = await marketplaceService.getItemById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item não encontrado' });
            res.json({ item });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Criar ou atualizar item
    createItem: async (req, res) => {
        try {
            const item = await marketplaceService.createItem(req.body, req.userId, req.traceId);
            res.status(201).json(item);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Endpoint de atualização parcial
    updateItem: async (req, res) => {
        try {
            const updatedItem = await marketplaceService.updateItem(req.params.id, req.body, req.traceId);
            res.json(updatedItem);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Deletar item
    deleteItem: async (req, res) => {
        try {
            await marketplaceService.deleteItem(req.params.id, req.userId, req.traceId);
            res.status(204).send();
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    }
};

export default marketplaceControle;
