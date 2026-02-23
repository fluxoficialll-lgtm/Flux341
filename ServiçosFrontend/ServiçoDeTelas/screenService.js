
// --- MOCK DO SERVIÇO DE TELAS ---

class ScreenService {
    /**
     * Simula a busca de dados de negócios para um usuário.
     * @param {string} userId - O ID do usuário.
     * @returns {Promise<object>} Um objeto com dados agregados de negócios.
     */
    getMyBusinessData(userId) {
        console.log(`[Screen Mock] Buscando dados de negócios para o usuário ${userId}`);
        // Retorna dados mocados, pois o BFF real não está disponível.
        return Promise.resolve({
            products: [],
            campaigns: []
        });
    }
}

export const screenService = new ScreenService();
