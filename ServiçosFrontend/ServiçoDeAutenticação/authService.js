
// authService.js: Orquestrador de Autenticação (Pronto para Produção)

import { metodoGoogle } from './metodoGoogle.js';
import { metodoEmail } from './metodoEmail.js';
import { SistemaCriaçãoContas } from './SistemaCriaçãoContas.js';

const IS_BROWSER = typeof window !== 'undefined';

// --- GERENCIAMENTO DE SESSÃO ---

// Dispara um evento para que componentes possam reagir a mudanças de autenticação (ex: atualizar a UI).
function dispatchAuthChange() {
    if (IS_BROWSER) {
        window.dispatchEvent(new CustomEvent('authChange'));
    }
}

// Armazena o token e os dados do usuário de forma segura no localStorage.
function storeSession(token, user) {
    if (!IS_BROWSER) return;
    try {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        dispatchAuthChange(); // Notifica a aplicação que o usuário logou.
    } catch (error) {
        console.error("Falha ao armazenar a sessão no localStorage:", error);
    }
}

// Remove os dados da sessão do localStorage.
function clearSession() {
    if (!IS_BROWSER) return;
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        dispatchAuthChange(); // Notifica a aplicação que o usuário deslogou.
    } catch (error) {
        console.error("Falha ao limpar a sessão do localStorage:", error);
    }
}

// --- SERVIÇO ORQUESTRADOR ---

export const authService = {
    /**
     * Orquestra o login com o Google, chamando o método de API e gerenciando a sessão.
     */
    async loginWithGoogle(googleCredential, referredBy) {
        const { token, user } = await metodoGoogle.login(googleCredential, referredBy);
        storeSession(token, user);
        return { token, user };
    },

    /**
     * Orquestra o login com email e senha, chamando o método de API e gerenciando a sessão.
     */
    async login(email, password) {
        const { token, user } = await metodoEmail.login(email, password);
        storeSession(token, user);
        return { token, user };
    },
    
    /**
     * Completa o perfil de um usuário recém-registrado, atualizando seus dados.
     * O hook `useCompleteProfile` chama esta função.
     * @param {string} email - O email do usuário (para consistência, mas o ID da sessão é usado).
     * @param {object} profileData - Os dados do perfil a serem atualizados (nome, bio, etc.).
     */
    async completeProfile(email, profileData) {
        const currentUser = this.getCurrentUser();
        const token = this.getToken();

        if (!currentUser || !currentUser.id || !token) {
            throw new Error("Usuário não autenticado ou sessão inválida para completar o perfil.");
        }

        // Chama o serviço de conta para ATUALIZAR o usuário no backend
        const updatedUserFromBackend = await SistemaCriaçãoContas.atualizarConta(currentUser.id, profileData);

        // Atualiza a sessão local com os novos dados do usuário retornados pelo backend
        storeSession(token, updatedUserFromBackend);

        return updatedUserFromBackend;
    },

    /**
     * Realiza o logout do usuário, limpando a sessão.
     */
    logout() {
        clearSession();
    },

    /**
     * Verifica se há um token de autenticação no localStorage.
     */
    isAuthenticated() {
        if (!IS_BROWSER) return false;
        return !!this.getToken();
    },

    /**
     * Obtém o token de autenticação do usuário logado.
     */
    getToken() {
        if (!IS_BROWSER) return null;
        try {
            return localStorage.getItem('authToken');
        } catch (error) {
            console.error("Falha ao obter o token do localStorage:", error);
            return null;
        }
    },

    /**
     * Obtém os dados do usuário logado a partir do localStorage.
     */
    getCurrentUser() {
        if (!IS_BROWSER) return null;
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Erro ao parsear dados do usuário do localStorage:', error);
            clearSession(); // Limpa a sessão se estiver corrompida.
            return null;
        }
    },

    /**
     * Um atalho para obter o email do usuário logado.
     */
    getCurrentUserEmail() {
        const user = this.getCurrentUser();
        return user ? user.email : null;
    },
};
