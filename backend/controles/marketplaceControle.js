
import { marketplaceRepositorio } from '../GerenciadoresDeDados/marketplace.repositorio.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const marketplaceControle = {
    // Listar itens do marketplace com filtros
    listItems: async (req, res) => {
        try {
            const items = await marketplaceRepositorio.list(req.query);
            res.json({ data: items });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Buscar item específico
    getItemById: async (req, res) => {
        try {
            const item = await marketplaceRepositorio.findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item não encontrado' });
            res.json({ item });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Criar ou atualizar item
    createItem: async (req, res) => {
        const sellerId = req.userId;
        LogDeOperacoes.log('TENTATIVA_CRIAR_ITEM_MARKETPLACE', { sellerId, body: req.body }, req.traceId);
        try {
            const item = await marketplaceRepositorio.create({ sellerId, ...req.body });
            res.status(201).json(item);
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIAR_ITEM_MARKETPLACE', { sellerId, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Endpoint de atualização parcial
    updateItem: async (req, res) => {
        LogDeOperacoes.log('TENTATIVA_ATUALIZAR_ITEM_MARKETPLACE', { itemId: req.params.id, updates: req.body }, req.traceId);
        try {
            const updatedItem = await marketplaceRepositorio.update(req.params.id, req.body);
            res.json(updatedItem);
        } catch (e) {
            LogDeOperacoes.error('FALHA_ATUALIZAR_ITEM_MARKETPLACE', { itemId: req.params.id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Deletar item
    deleteItem: async (req, res) => {
        LogDeOperacoes.log('TENTATIVA_DELETAR_ITEM_MARKETPLACE', { itemId: req.params.id }, req.traceId);
        try {
            // Adicionar verificação de permissão (apenas o vendedor ou admin pode deletar)
            const item = await marketplaceRepositorio.findById(req.params.id);
            if (item && item.sellerId !== req.userId /* && !req.user.isAdmin */) {
                return res.status(403).json({ error: 'Permissão negada.' });
            }

            await marketplaceRepositorio.delete(req.params.id);
            res.status(204).send();
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_ITEM_MARKETPLACE', { itemId: req.params.id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    }
};

export default marketplaceControle;
