
import { servicoDeSimulacao } from '../ServiçoDeSimulação';
import { authService } from '../ServiçoDeAutenticação/authService';

// Este serviço mantém o estado dos reels em memória.
// Esta não é uma boa prática para uma aplicação real, mas corresponde ao design problemático
// do hook useReels, que mistura chamadas síncronas e assíncronas.

const BASE_URL = '/api/reels';
let reelsCache = [];

const handleResponse = async (res) => {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido na API de Reels' }));
        throw new Error(errorData.message || `Erro ${res.status}`);
    }
    return res.json();
};

const getAuthHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const reelsService = {
    /**
     * Busca os reels da API e os armazena no cache local.
     * @param {string} token - O token de autenticação.
     */
    async fetchReels(token) {
        const res = await fetch(BASE_URL, { headers: getAuthHeaders(token) });
        const data = await handleResponse(res);
        reelsCache = data.data || []; // Assumindo que a API retorna { data: [...] }
        
        // Também adiciona os reels ao cache de simulação de posts para consistência
        reelsCache.forEach(reel => servicoDeSimulacao.posts.add(reel, true));
    },

    /**
     * Retorna todos os reels do cache, opcionalmente filtrados por conteúdo adulto.
     * @param {string} [userEmail] - (Não utilizado na implementação atual, mas mantido para consistência)
     * @param {boolean} allowAdult - Se deve incluir conteúdo 18+.
     * @returns {Post[]}
     */
    getReels(userEmail, allowAdult) {
        if (allowAdult) {
            return [...reelsCache];
        }
        return reelsCache.filter(reel => !reel.isAdult);
    },

    /**
     * Retorna os reels de um autor específico do cache.
     * @param {string} authorId - O ID do autor.
     * @param {boolean} allowAdult - Se deve incluir conteúdo 18+.
     * @returns {Post[]}
     */
    getReelsByAuthor(authorId, allowAdult) {
        return this.getReels(null, allowAdult).filter(reel => reel.userId === authorId);
    },

    /**
     * Incrementa a contagem de visualizações de um reel.
     * @param {string} reelId - O ID do reel.
     */
    async incrementView(reelId) {
        const token = authService.getToken();
        if (!token) return;

        const reel = reelsCache.find(r => r.id === reelId);
        if (reel) reel.views = (reel.views || 0) + 1;
        servicoDeSimulacao.posts.update(reelId, { views: reel.views });
        
        try {
            await fetch(`${BASE_URL}/${reelId}/view`, {
                method: 'POST',
                headers: getAuthHeaders(token),
            });
        } catch (error) {
            console.error('Falha ao incrementar visualização no backend:', error);
            if (reel) reel.views -= 1;
            servicoDeSimulacao.posts.update(reelId, { views: reel.views });
        }
    },

    /**
     * Alterna o estado de 'like' em um reel.
     * @param {string} reelId - O ID do reel.
     */
    async toggleLike(reelId) {
        const token = authService.getToken();
        if (!token) return;

        const reel = reelsCache.find(r => r.id === reelId);
        if (reel) {
            reel.liked = !reel.liked;
            reel.likes = reel.liked ? (reel.likes || 0) + 1 : (reel.likes || 1) - 1;
        }
        servicoDeSimulacao.posts.update(reelId, { liked: reel.liked, likes: reel.likes });

        try {
            await fetch(`${BASE_URL}/${reelId}/like`, {
                method: 'POST',
                headers: getAuthHeaders(token),
            });
        } catch (error) {
            console.error('Falha ao alternar like no backend:', error);
            if (reel) {
                reel.liked = !reel.liked;
                reel.likes = reel.liked ? (reel.likes || 0) + 1 : (reel.likes || 1) - 1;
            }
            servicoDeSimulacao.posts.update(reelId, { liked: reel.liked, likes: reel.likes });
        }
    }
};
