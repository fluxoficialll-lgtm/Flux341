
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

    /**
     * Simula a pontuação de um post para recomendação.
     * @param {object} post - O post a ser pontuado.
     * @param {string} userEmail - O email do usuário.
     * @returns {number} - A pontuação do post.
     */
    scorePost(post, userEmail) {
        console.log(`[Recommendation Mock] Pontuando post ${post.id} para ${userEmail}`);
        // Mock simples: retorna um score aleatório
        return Math.random();
    }

    /**
     * Simula o rastreamento de uma impressão de post.
     * @param {string} postId - O ID do post.
     */
    trackImpression(postId) {
        console.log(`[Recommendation Mock] Impressão rastreada para o post ${postId}`);
        return Promise.resolve();
    }
}

export const recommendationService = new RecommendationService();
