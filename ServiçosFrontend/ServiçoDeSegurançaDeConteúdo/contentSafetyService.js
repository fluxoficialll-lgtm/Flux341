
// --- MOCK DO SERVIÇO DE SEGURANÇA DE CONTEÚDO ---

class ContentSafetyService {
    /**
     * Simula a verificação de segurança de um texto.
     * @param {string} text - O texto a ser verificado.
     * @returns {Promise<boolean>} Retorna `true` se o texto for considerado seguro, `false` caso contrário.
     */
    isTextSafe(text) {
        console.log(`[Content Safety Mock] Verificando texto: "${text}"`);
        // Mock simples: considera o texto inseguro se contiver palavras "proibidas"
        const unsafeWords = ['inseguro', 'explícito', 'violência'];
        const isUnsafe = unsafeWords.some(word => text.toLowerCase().includes(word));
        return Promise.resolve(!isUnsafe); 
    }
}

export const contentSafetyService = new ContentSafetyService();
