
// --- MOCK DO SERVIÇO DE REELS ---

class ReelsService {
    /**
     * Simula a busca de reels com base em uma query.
     * @param {string} query - O termo de busca.
     * @returns {Promise<object[]>}
     */
    searchReels(query) {
        console.log(`[Reels Mock] Buscando reels para: "${query}"`);
        // Retorna uma lista vazia ou alguns reels mockados
        return Promise.resolve([]); 
    }

    /**
     * Simula a criação de um novo reel.
     * @param {object} reelData - Os dados do reel a ser criado.
     * @returns {Promise<object>}
     */
    createReel(reelData) {
        console.log("[Reels Mock] Criando reel:", reelData);
        return Promise.resolve({ id: `reel_${Date.now()}`, ...reelData });
    }
}

export const reelsService = new ReelsService();
