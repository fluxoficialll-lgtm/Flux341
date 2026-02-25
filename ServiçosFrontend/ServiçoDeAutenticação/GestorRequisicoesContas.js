
// Arquivo: ServiçosFrontend/ServiçoDeAutenticação/GestorRequisicoesContas.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Gestor de Requisições centralizado para a comunicação com o backend.
 * Abstrai o uso do `fetch` e adiciona headers comuns, como o de autenticação.
 */
const gestorDeRequisicoes = {

    /**
     * Realiza uma requisição genérica para a API.
     * @param {string} endpoint - O caminho do endpoint (ex: '/users').
     * @param {object} options - As opções da requisição (method, headers, body, etc.).
     * @returns {Promise<any>} A resposta da API em formato JSON.
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Adiciona o token de autenticação, se estiver disponível
        const token = localStorage.getItem('user_token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                // Tenta extrair uma mensagem de erro do corpo da resposta
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || `Erro na requisição: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            // Se a resposta não tiver conteúdo (ex: 204 No Content), retorna um objeto vazio
            if (response.status === 204) {
                return {};
            }

            return response.json();

        } catch (error) {
            console.error("Falha na requisição para a API:", error);
            throw error; // Re-lança o erro para que a camada superior possa tratá-lo
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
};

export default gestorDeRequisicoes;
