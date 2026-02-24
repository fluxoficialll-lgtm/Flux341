
// --- MOCK DO SERVIÇO DE ANÚNCIOS ---

class AdService {
    /**
     * Simula a atualização do status de uma campanha.
     * @param {string} campaignId - O ID da campanha.
     * @param {string} status - O novo status.
     * @returns {Promise<void>}
     */
    updateCampaignStatus(campaignId, status) {
        console.log(`[Ad Mock] Atualizando campanha ${campaignId} para o status: ${status}`);
        return Promise.resolve();
    }

    /**
     * Simula a exclusão de uma campanha.
     * @param {string} campaignId - O ID da campanha a ser excluída.
     * @returns {Promise<void>}
     */
    deleteCampaign(campaignId) {
        console.log(`[Ad Mock] Excluindo campanha ${campaignId}`);
        return Promise.resolve();
    }

    /**
     * Simula a contagem de notificações de anúncios não lidas.
     * @returns {Promise<number>}
     */
    async getUnreadCount() {
        console.log("[Ad Mock] Contando notificações de anúncios não lidas...");
        return Promise.resolve(0);
    }
}

class ReachEstimator {
    estimate(campaign) {
        const targeting = campaign.targeting || {};
        let score = 1000000;
        if (targeting.ageMin && targeting.ageMax) {
            score *= (1 / (targeting.ageMax - targeting.ageMin)) * 10;
        }
        if (targeting.interests && targeting.interests.length > 0) {
            score /= (targeting.interests.length * 2);
        }
        if (targeting.locations && targeting.locations.length > 0) {
            score /= targeting.locations.length;
        }

        const min = Math.max(500, Math.floor(score * 0.8));
        const max = Math.max(1000, Math.floor(score * 1.2));
        
        let status = 'ideal';
        if (max < 10000) status = 'narrow';
        if (max > 200000) status = 'broad';

        return { min, max, status };
    }
}

class AiInterestEngine {
    async getSmartSuggestions(creative) {
        console.log('[AI Mock] Gerando sugestões para:', creative);
        await new Promise(res => setTimeout(res, 800)); // Simula latência
        const baseInterests = ['Esportes', 'Cinema', 'Música', 'Tecnologia', 'Viagens'];
        // Retorna 2 interesses aleatórios
        return baseInterests.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
}

class GeoSearchService {
    constructor() {
        this.mockLocations = [
            { name: 'São Paulo', state: 'SP', country: 'BR', lat: -23.55, lon: -46.63 },
            { name: 'Rio de Janeiro', state: 'RJ', country: 'BR', lat: -22.90, lon: -43.17 },
            { name: 'Belo Horizonte', state: 'MG', country: 'BR', lat: -19.92, lon: -43.93 },
            { name: 'Salvador', state: 'BA', country: 'BR', lat: -12.97, lon: -38.50 },
            { name: 'Curitiba', state: 'PR', country: 'BR', lat: -25.42, lon: -49.27 },
        ];
    }
    async search(query) {
        console.log(`[Geo Mock] Buscando por: "${query}"`);
        await new Promise(res => setTimeout(res, 300));
        if (!query) return [];
        return this.mockLocations.filter(loc => 
            loc.name.toLowerCase().includes(query.toLowerCase()) ||
            loc.state.toLowerCase().includes(query.toLowerCase())
        );
    }
}


export const adService = new AdService();
export const reachEstimator = new ReachEstimator();
export const aiInterestEngine = new AiInterestEngine();
export const geoSearchService = new GeoSearchService();
