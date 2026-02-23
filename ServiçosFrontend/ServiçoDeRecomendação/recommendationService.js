
// --- MOCK DO SERVIÇO DE RECOMENDAÇÃO ---

class RecommendationService {
    /**
     * Simula o registro de uma interação do usuário para fins de recomendação.
     * @param {string} userEmail - O email do usuário.
     * @param {object} item - O item com o qual o usuário interagiu.
     * @param {string} interactionType - O tipo de interação (ex: 'view', 'like', 'comment').
     * @param {any} value - Valor adicional associado à interação (ex: tempo de visualização).
     */
    recordInteraction(userEmail, item, interactionType, value) {
        console.log(`[Recommendation Mock] Interação registrada para ${userEmail}:`, {
            item: item.id,
            type: interactionType,
            value: value
        });
        return Promise.resolve();
    }
}

export const recommendationService = new RecommendationService();
