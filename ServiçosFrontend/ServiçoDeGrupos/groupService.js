
// Serviço para interagir com a API de grupos do backend.

const BASE_URL = '/api/groups';

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

export const groupService = {
    /**
     * Lista todos os grupos.
     * @param {string} token - O token de autenticação do usuário.
     * @param {number} [limit] - O número máximo de grupos a serem retornados.
     * @returns {Promise<any>} A lista de grupos.
     */
    async listGroups(token, limit) {
        const query = limit ? `?limit=${limit}` : '';
        const res = await fetch(`${BASE_URL}${query}`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },

    /**
     * Obtém o ranking de grupos.
     * @param {string} token - O token de autenticação do usuário.
     * @param {string} type - O tipo de ranking (ex: 'public', 'vip').
     * @param {number} limit - O limite de grupos no ranking.
     * @returns {Promise<any>} O ranking de grupos.
     */
    async getGroupRanking(token, type, limit) {
        const res = await fetch(`${BASE_URL}/ranking?type=${type}&limit=${limit}`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },

    /**
     * Obtém os detalhes de um grupo específico pelo ID.
     * @param {string} token - O token de autenticação do usuário.
     * @param {string} id - O ID do grupo.
     * @returns {Promise<any>} Os detalhes do grupo.
     */
    async getGroupById(token, id) {
        const res = await fetch(`${BASE_URL}/${id}`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },

    /**
     * Cria um novo grupo.
     * @param {string} token - O token de autenticação do usuário.
     * @param {object} groupData - Os dados para o novo grupo.
     * @returns {Promise<any>} O grupo recém-criado.
     */
    async createGroup(token, groupData) {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(groupData),
        });
        return handleResponse(res);
    },

    /**
     * Atualiza um grupo existente.
     * @param {string} token - O token de autenticação do usuário.
     * @param {string} id - O ID do grupo a ser atualizado.
     * @param {object} updates - Os campos a serem atualizados.
     * @returns {Promise<any>} O grupo atualizado.
     */
    async updateGroup(token, id, updates) {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify(updates),
        });
        return handleResponse(res);
    },

    /**
     * Deleta um grupo.
     * @param {string} token - O token de autenticação do usuário.
     * @param {string} id - O ID do grupo a ser deletado.
     * @returns {Promise<any>} Uma mensagem de sucesso.
     */
    async deleteGroup(token, id) {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },
};
