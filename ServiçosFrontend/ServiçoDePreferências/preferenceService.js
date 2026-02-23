
// --- MOCK DO SERVIÇO DE PREFERÊNCIAS ---

class PreferenceService {
    /**
     * Simula a obtenção de uma preferência do usuário.
     * @param {string} key - A chave da preferência.
     * @returns {Promise<any>}
     */
    get(key) {
        console.log(`[Preference Mock] Obtendo preferência: ${key}`);
        if (key === 'language') {
            return Promise.resolve('pt-BR'); // Retorna um idioma padrão
        }
        return Promise.resolve(null);
    }

    /**
     * Simula a definição de uma preferência do usuário.
     * @param {string} key - A chave da preferência.
     * @param {any} value - O valor da preferência.
     * @returns {Promise<void>}
     */
    set(key, value) {
        console.log(`[Preference Mock] Definindo preferência: ${key}`, value);
        return Promise.resolve();
    }
}

export const preferenceService = new PreferenceService();
