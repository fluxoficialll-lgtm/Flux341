
// --- MOCK DO SERVIÇO DE MARKETPLACE ---

class MarketplaceService {
    /**
     * Simula a busca de todos os itens do marketplace.
     * @returns {Promise<object[]>}
     */
    getItems() {
        console.log("[Marketplace Mock] Buscando todos os itens.");
        // Retorna uma lista vazia, pois não há dados mockados de itens.
        return Promise.resolve([]); 
    }
}

export const marketplaceService = new MarketplaceService();
