
// Este é o serviço de autenticação do lado do cliente (a "ponte")
import { FirebaseAuth } from '../../../firebase.config';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const API_BASE_URL = '/api/auth'; // Base para o nosso backend customizado

const storeSession = (token, user) => {
    try {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (e) {
        console.error("Failed to store session:", e);
    }
};

const clearSession = () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    } catch (e) {
        console.error("Failed to clear session:", e);
    }
};

export const authService = {
    /**
     * Realiza o login com e-mail e senha usando Firebase Auth.
     */
    async loginWithEmail(email, password) {
        const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        // Opcional: sincronizar com o seu backend
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
           const error = await response.json();
           throw new Error(error.message || 'Falha na sincronização com o backend.');
        }
        
        const backendData = await response.json();
        storeSession(idToken, backendData.user || user); // Armazena dados do backend se disponíveis
        return backendData.user || user;
    },

    /**
     * Realiza o login com Google usando Firebase Auth.
     */
    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(FirebaseAuth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // Opcional: Sincronizar com seu backend
        const response = await fetch(`${API_BASE_URL}/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                email: user.email,
                name: user.displayName,
                googleId: user.uid
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Falha na sincronização com o backend via Google.');
        }

        const backendData = await response.json();
        storeSession(idToken, backendData.user || user);
        return backendData.user || user;
    },

    /**
     * Faz logout do Firebase.
     */
    logout() {
        clearSession();
        return FirebaseAuth.signOut();
    },

    /**
     * Observador do estado de autenticação do Firebase.
     * @param {function} callback - Função a ser chamada quando o estado de auth mudar.
     * @returns {import("firebase/auth").Unsubscribe} - Função para cancelar a inscrição.
     */
    onAuthStateChange(callback) {
        return onAuthStateChanged(FirebaseAuth, (user) => {
            if (user) {
                // Se o usuário estiver logado, pegamos o token mais recente
                user.getIdToken().then(token => {
                    const userData = this.getCurrentUser(); // Pega dados do localStorage
                    storeSession(token, userData || user); // Atualiza a sessão
                    callback(userData || user);
                });
            } else {
                clearSession();
                callback(null);
            }
        });
    },

    /**
     * Verifica se há um token de autenticação no localStorage.
     */
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    },

    /**
     * Pega o usuário atual do localStorage.
     */
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        try {
            return user ? JSON.parse(user) : null;
        } catch (e) {
            return null;
        }
    },
};
