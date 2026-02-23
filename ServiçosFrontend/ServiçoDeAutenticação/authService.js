
// Ponte Frontend: Serviço de Autenticação
// Este serviço faz a comunicação entre a UI (hooks) e a API do backend.

const API_URL = '/api/auth';

/**
 * Armazena o token e os dados do usuário no localStorage.
 * @param {string} token - O token JWT.
 * @param {object} user - Os dados do usuário.
 */
function storeSession(token, user) {
    if (token) localStorage.setItem('authToken', token);
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Remove a sessão do localStorage.
 */
function clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
}

export const authService = {
    /**
     * Envia as credenciais do Google para o backend para login ou registro.
     * @param {string} googleCredential - O token de credencial do Google.
     * @param {string} [referredBy] - ID do afiliado que indicou.
     * @returns {Promise<object>} - O resultado da autenticação do backend.
     */
    async loginWithGoogle(googleCredential, referredBy) {
        const response = await fetch(`${API_URL}/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: googleCredential, referredBy }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha no login com Google');
        }

        const data = await response.json();
        storeSession(data.token, data.user);
        return data;
    },

    /**
     * Envia e-mail e senha para o backend para login.
     * @param {string} email - O e-mail do usuário.
     * @param {string} password - A senha do usuário.
     * @returns {Promise<object>} - O resultado da autenticação do backend.
     */
    async login(email, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Credenciais inválidas');
        }

        const data = await response.json();
        storeSession(data.token, data.user);
        return data;
    },

    /**
     * Faz o logout do usuário, limpando a sessão.
     */
    logout() {
        clearSession();
        // Opcional: notificar o backend sobre o logout
    },

    /**
     * Verifica se o usuário está autenticado localmente.
     * @returns {boolean} - Verdadeiro se houver um token.
     */
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    },

    /**
     * Obtém os dados do usuário do armazenamento local.
     * @returns {object|null} - O objeto do usuário ou nulo.
     */
    getCurrentUser() {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
            clearSession();
            return null;
        }
    }
};
