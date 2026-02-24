
import { servicoDeSimulacao } from '../ServiçoDeSimulação';

class MarketplaceService {
    /**
     * Busca todos os itens do marketplace a partir da simulação.
     * @returns {Promise<object[]>}
     */
    getItems() {
        console.log("[Marketplace] Buscando todos os itens via simulação.");
        return Promise.resolve(servicoDeSimulacao.simulationData.marketplace);
    }

    /**
     * Busca itens recomendados do marketplace a partir da simulação.
     * @returns {Promise<object[]>}
     */
    getRecommendedItems() {
        console.log("[Marketplace] Buscando itens recomendados via simulação.");
        // Lógica de recomendação simples: retorna os 5 primeiros itens.
        const recommendedItems = servicoDeSimulacao.simulationData.marketplace.slice(0, 5);
        return Promise.resolve(recommendedItems);
    }

    /**
     * Simula a busca de todos os itens do marketplace.
     * @returns {Promise<void>}
     */
    fetchItems() {
        console.log("[Marketplace] Sincronizando itens do marketplace.");
        // A simulação já está carregada, então apenas resolvemos a promessa.
        return Promise.resolve();
    }

    /**
     * Simula o rastreamento da visualização de um item.
     * @param {object} item O item que foi visualizado.
     * @param {string} userEmail O email do usuário que visualizou o item.
     * @returns {void}
     */
    trackView(item, userEmail) {
        console.log(`[Marketplace] Rastreando visualização do item "${item.title}" por ${userEmail}.`);
    }
}

export const marketplaceService = new MarketplaceService();
