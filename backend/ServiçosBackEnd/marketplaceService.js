
import { marketplaceRepositorio } from '../GerenciadoresDeDados/marketplace.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const marketplaceService = {
    /**
     * Lists items in the marketplace with optional filters.
     */
    listItems: async (filters) => {
        try {
            const items = await marketplaceRepositorio.list(filters);
            return items;
        } catch (e) {
            // No specific logging here, as it's a general listing
            throw e;
        }
    },

    /**
     * Gets a specific item by its ID.
     */
    getItemById: async (id) => {
        try {
            const item = await marketplaceRepositorio.findById(id);
            return item;
        } catch (e) {
            // No specific logging here, as it's a direct fetch
            throw e;
        }
    },

    /**
     * Creates a new item in the marketplace.
     */
    createItem: async (itemData, sellerId, traceId) => {
        LogDeOperacoes.log('TENTATIVA_CRIAR_ITEM_MARKETPLACE', { sellerId, body: itemData }, traceId);
        try {
            const item = await marketplaceRepositorio.create({ sellerId, ...itemData });
            return item;
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIAR_ITEM_MARKETPLACE', { sellerId, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Updates an existing item in the marketplace.
     */
    updateItem: async (id, updates, traceId) => {
        LogDeOperacoes.log('TENTATIVA_ATUALIZAR_ITEM_MARKETPLACE', { itemId: id, updates }, traceId);
        try {
            const updatedItem = await marketplaceRepositorio.update(id, updates);
            return updatedItem;
        } catch (e) {
            LogDeOperacoes.error('FALHA_ATUALIZAR_ITEM_MARKETPLACE', { itemId: id, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Deletes an item from the marketplace.
     */
    deleteItem: async (id, userId, traceId) => {
        LogDeOperacoes.log('TENTATIVA_DELETAR_ITEM_MARKETPLACE', { itemId: id }, traceId);
        try {
            const item = await marketplaceRepositorio.findById(id);
            if (item && item.sellerId !== userId) {
                const error = new Error('Permissão negada.');
                error.statusCode = 403;
                throw error;
            }
            await marketplaceRepositorio.delete(id);
            return { success: true };
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_ITEM_MARKETPLACE', { itemId: id, error: e }, traceId);
            throw e;
        }
    }
};
