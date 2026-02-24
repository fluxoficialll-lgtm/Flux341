
import { Post } from '../../../types';
import { criarPostsDeVideo } from './dados/posts';

// Armazena os reels simulados em memória para manter o estado (likes, views, etc.)
const reelsSimulados: Post[] = criarPostsDeVideo();

/**
 * Handler para buscar todos os reels.
 * @returns Uma Promise que resolve para uma Response com os reels simulados.
 */
export const handleFetchReelsSimulado = (): Promise<Response> => {
    console.log('[SIMULAÇÃO] ✅ Retornando mock para: GET /api/reels');
    return Promise.resolve(new Response(JSON.stringify({ data: reelsSimulados }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    }));
};

/**
 * Handler para incrementar a visualização de um reel.
 * @param url - O objeto URL da requisição, contendo o ID do reel.
 * @returns Uma Promise que resolve para uma Response de sucesso.
 */
export const handleIncrementViewSimulado = (url: URL): Promise<Response> => {
    const reelId = url.pathname.split('/')[3];
    console.log(`[SIMULAÇÃO] ✅ Incrementando visualização para reel: ${reelId}`);
    const reel = reelsSimulados.find(r => r.id === reelId);
    if (reel) {
        reel.views = (reel.views || 0) + 1;
    }
    return Promise.resolve(new Response(null, { status: 204 }));
};

/**
 * Handler para alternar o like em um reel.
 * @param url - O objeto URL da requisição, contendo o ID do reel.
 * @returns Uma Promise que resolve para uma Response de sucesso.
 */
export const handleToggleLikeSimulado = (url: URL): Promise<Response> => {
    const reelId = url.pathname.split('/')[3];
    console.log(`[SIMULAÇÃO] ✅ Alternando like para reel: ${reelId}`);
    const reel = reelsSimulados.find(r => r.id === reelId);
    if (reel) {
        reel.liked = !reel.liked;
        reel.likes = reel.liked ? (reel.likes || 0) + 1 : (reel.likes || 1) - 1;
    }
    return Promise.resolve(new Response(null, { status: 204 }));
};

// Mapeamento de handlers para URLs de reels
export const reelsHandlers = {
    '/api/reels': handleFetchReelsSimulado,
};

// Mapeamento de handlers para URLs dinâmicas de reels (com regex)
export const reelsDynamicHandlers = [
    { regex: /\/api\/reels\/(.*?)\/view/, handler: handleIncrementViewSimulado },
    { regex: /\/api\/reels\/(.*?)\/like/, handler: handleToggleLikeSimulado },
];
