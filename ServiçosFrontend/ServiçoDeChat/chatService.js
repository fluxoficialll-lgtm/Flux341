
// Serviço para interagir com a API de chat/mensagens do backend.

const API_BASE_URL = '/api';

/**
 * Lida com as respostas da API, convertendo para JSON ou lançando um erro.
 * @param {Response} res - O objeto de resposta do fetch.
 * @returns {Promise<any>} O corpo da resposta em JSON.
 * @throws {Error} Se a resposta não for bem-sucedida.
 */
const handleResponse = async (res) => {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido na API' }));
        throw new Error(errorData.message || `Erro ${res.status}`);
    }
    return res.json();
};

/**
 * Obtém os headers de autorização.
 * @param {string} token - O token JWT.
 * @returns {object} Os headers com o token.
 */
const getAuthHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const chatService = {
    /**
     * Lista todas as conversas do usuário logado.
     * @param {string} token - O token de autenticação.
     * @returns {Promise<any>} A lista de conversas.
     */
    async listConversations(token) {
        const res = await fetch(`${API_BASE_URL}/conversations`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },

    /**
     * Busca mensagens de uma conversa específica.
     * @param {string} token - O token de autenticação.
     * @param {string} conversationId - O ID da conversa.
     * @param {object} [params] - Parâmetros de paginação como limit e offset.
     * @returns {Promise<any>} As mensagens da conversa.
     */
    async getMessages(token, conversationId, { limit, offset } = {}) {
        const query = new URLSearchParams({ limit, offset }).toString();
        const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages?${query}`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },

    /**
     * Envia uma nova mensagem.
     * @param {string} token - O token de autenticação.
     * @param {object} messageData - Dados da mensagem (recipientId, content, etc.).
     * @returns {Promise<any>} A mensagem enviada.
     */
    async sendMessage(token, messageData) {
        const res = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(messageData),
        });
        return handleResponse(res);
    },

    /**
     * Deleta mensagens específicas.
     * @param {string} token - O token de autenticação.
     * @param {string[]} messageIds - IDs das mensagens a serem deletadas.
     * @param {'self' | 'all'} target - Se a deleção é só para o usuário ou para todos.
     * @returns {Promise<any>} O resultado da operação.
     */
    async deleteMessages(token, messageIds, target = 'self') {
        const res = await fetch(`${API_BASE_URL}/messages`, {
            method: 'DELETE',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ messageIds, target }),
        });
        return handleResponse(res);
    },
};
