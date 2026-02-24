
// ServiçosFrontend/ServiçoDeAutenticação/ServiçoDeAutenticação.ts
// Lógica de autenticação de PRODUÇÃO

import { User } from '../../types'; // Supondo que você tenha um tipo User definido

const API_URL = '/api/auth';
const IS_BROWSER = typeof window !== 'undefined';

/**
 * Armazena o token e os dados do usuário no localStorage.
 * @param {string} token - O token JWT.
 * @param {User} user - Os dados do usuário.
 */
function storeSession(token: string, user: User) {
    if (!IS_BROWSER) return;
    try {
        if (token) localStorage.setItem('authToken', token);
        if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
        console.error("Falha ao armazenar a sessão no localStorage:", error);
    }
}

/**
 * Remove a sessão do localStorage.
 */
function clearSession() {
    if (!IS_BROWSER) return;
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    } catch (error) {
        console.error("Falha ao limpar a sessão do localStorage:", error);
    }
}

interface AuthResult {
    token: string;
    user: User;
    nextStep?: string;
}

export const authServiceProducao = {
    /**
     * Envia as credenciais do Google para o backend para login ou registro.
     * @param {string} googleCredential - O token de credencial do Google.
     * @param {string} [referredBy] - ID do afiliado que indicou.
     * @returns {Promise<AuthResult>} - O resultado da autenticação do backend.
     */
    async loginWithGoogle(googleCredential: string, referredBy?: string): Promise<AuthResult> {
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

        const data: AuthResult = await response.json();
        storeSession(data.token, data.user);
        return data;
    },

    /**
     * Envia e-mail e senha para o backend para login.
     * @param {string} email - O e-mail do usuário.
     * @param {string} password - A senha do usuário.
     * @returns {Promise<AuthResult>} - O resultado da autenticação do backend.
     */
    async login(email: string, password: string): Promise<AuthResult> {
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

        const data: AuthResult = await response.json();
        storeSession(data.token, data.user);
        return data;
    },

    /**
     * Faz o logout do usuário, limpando a sessão.
     */
    logout() {
        clearSession();
    },

    /**
     * Verifica se o usuário está autenticado localmente.
     * @returns {boolean} - Verdadeiro se houver um token.
     */
    isAuthenticated(): boolean {
        if (!IS_BROWSER) return false;
        try {
            return !!localStorage.getItem('authToken');
        } catch (error) {
            console.error("Falha ao verificar autenticação no localStorage:", error);
            return false;
        }
    },

    /**
     * Obtém os dados do usuário do armazenamento local.
     * @returns {User|null} - O objeto do usuário ou nulo.
     */
    getCurrentUser(): User | null {
        if (!IS_BROWSER) return null;
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) as User : null;
        } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
            clearSession();
            return null;
        }
    },
    
    /**
     * Obtém o e-mail do usuário do armazenamento local.
     * @returns {string|null} - O e-mail do usuário ou nulo.
     */
    getCurrentUserEmail(): string | null {
        const user = this.getCurrentUser();
        return user ? user.email : null;
    },

    /**
     * Retorna a contagem de notificações não lidas. Em produção, este valor pode vir de outro serviço.
     * @returns {Promise<number>}
     */
    async getUnreadCount(): Promise<number> {
        // Em um cenário real, isso poderia fazer uma chamada de API para /api/notifications/unread-count
        return Promise.resolve(0);
    }
};
