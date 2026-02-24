
// Serviço para interagir com a API de posts do backend.

const BASE_URL = '/api/posts';

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

/**
 * [FUNÇÃO ADICIONADA] Formata um timestamp ISO para tempo relativo (ex: "5m", "2h", "3d").
 * @param {string} isoString - A data em formato ISO.
 * @returns {string} O tempo relativo formatado.
 */
const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const now = new Date();
    const then = new Date(isoString);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 2) return 'agora';
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    return then.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};


export const postService = {
    // [FUNÇÃO ADICIONADA] Expondo o formatador de tempo para a UI.
    formatRelativeTime,

    /**
     * Lista os posts do feed.
     * @param {string} token - O token de autenticação.
     * @param {object} params - Parâmetros de paginação como limit e cursor.
     * @returns {Promise<any>} A lista de posts e o próximo cursor.
     */
    async listPosts(token, { limit, cursor }) {
        const query = new URLSearchParams({ limit, cursor }).toString();
        const res = await fetch(`${BASE_URL}?${query}`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },

    /**
     * [NOVO] Obtém os posts de um usuário específico.
     * @param {string} token - O token de autenticação.
     * @param {string} userId - O ID do usuário.
     * @returns {Promise<Post[]>} A lista de posts do usuário.
     */
    async getUserPosts(token, userId) {
        const res = await fetch(`/api/users/${userId}/posts`, { // Novo endpoint
            headers: getAuthHeaders(token),
        });
        const data = await handleResponse(res);
        return data.data; // A simulação e o hook esperam um array de posts
    },

    /**
     * Cria um novo post.
     * @param {string} token - O token de autenticação.
     * @param {object} postData - Os dados do post a ser criado.
     * @returns {Promise<any>} O resultado da criação.
     */
    async createPost(token, postData) {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(postData),
        });
        return handleResponse(res);
    },

    /**
     * Registra uma interação com um post (like, etc.).
     * @param {string} token - O token de autenticação.
     * @param {string} postId - O ID do post.
     * @param {object} interactionData - Dados da interação (type, action).
     * @returns {Promise<any>} O resultado da interação.
     */
    async interactWithPost(token, postId, interactionData) {
        const res = await fetch(`${BASE_URL}/${postId}/interact`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(interactionData),
        });
        return handleResponse(res);
    },

    /**
     * Adiciona um comentário a um post.
     * @param {string} token - O token de autenticação.
     * @param {string} postId - O ID do post.
     * @param {object} comment - O objeto do comentário.
     * @returns {Promise<any>} O comentário adicionado.
     */
    async addComment(token, postId, comment) {
        const res = await fetch(`${BASE_URL}/${postId}/comments`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(comment),
        });
        return handleResponse(res);
    },

    /**
     * Deleta um post.
     * @param {string} token - O token de autenticação.
     * @param {string} postId - O ID do post a ser deletado.
     * @returns {Promise<any>} O resultado da deleção.
     */
    async deletePost(token, postId) {
        const res = await fetch(`${BASE_URL}/${postId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },
};
