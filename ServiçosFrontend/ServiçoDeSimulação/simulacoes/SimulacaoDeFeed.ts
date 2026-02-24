
import { Post, PollOption } from '../../../types';

const todosOsPostsSimulados: Post[] = Array.from({ length: 50 }, (_, i) => criarPostSimulado(i + 1));

function criarPostSimulado(id: number): Post {
    const nomes = ['Alice', 'Beto', 'Carla', 'Daniel', 'Eva', 'Fernanda', 'Gabriel'];
    const userIds = ['user-mock-0', 'user-mock-1', 'user-mock-2', 'user-mock-3', 'user-mock-4', 'user-mock-5', 'user-mock-6'];
    const avatares = [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    const conteudos = [
        'Acabei de voltar de uma viagem incrível pelas montanhas. A vista era de tirar o fôlego! Adicionando a tag #viagem para inspirar.',
        'Experimentando uma nova receita de café hoje. Alguém tem alguma dica? #café',
        'Qual é o melhor filme que vocês viram este ano? Preciso de recomendações! Adoro um bom suspense. @Carla, talvez você saiba?',
        'Animado para o jogo de hoje à noite! Quem mais vai assistir? #futebol #aovivo',
        'Refletindo sobre a importância da sustentabilidade. Pequenas mudanças fazem uma grande diferença. #sustentabilidade #planeta',
        'Aprendendo a programar em React. É desafiador, mas muito recompensador! #dev #react #frontend',
        'Um dia produtivo de trabalho remoto. A chave é ter um bom setup. @Beto, obrigado pela dica do monitor!'
    ];

    const index = id % nomes.length;
    const postType: Post['type'] = ['text', 'photo', 'ad', 'poll', 'multi-photo'][id % 5] as Post['type'];

    const basePost: Post = {
        id: `mock_${id}`,
        username: nomes[index],
        avatar: avatares[index],
        authorId: userIds[index], // ID do autor consistente
        authorEmail: `${nomes[index].toLowerCase()}@email.com`,
        timestamp: new Date(Date.now() - id * 3600000).toISOString(),
        text: conteudos[index],
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 5000),
        liked: Math.random() > 0.8,
        location: ['São Paulo, BR', 'Rio de Janeiro, BR', null, 'Recife, BR', null, 'Belo Horizonte, BR', null][index],
        isAdultContent: Math.random() > 0.9,
        isAd: false,
        image: null,
        images: [],
        video: null,
        pollOptions: [],
        votedOptionIndex: null,
        ctaLink: null,
        ctaText: null,
        relatedGroupId: null,
        type: 'text' // Default type
    };

    switch (postType) {
        case 'photo': return { ...basePost, type: 'photo', image: `https://picsum.photos/seed/${id}/800/600` };
        case 'multi-photo': return { ...basePost, type: 'multi-photo', images: [`https://picsum.photos/seed/${id*2}/800/600`, `https://picsum.photos/seed/${id*3}/800/600`, `https://picsum.photos/seed/${id*4}/800/600`] };
        case 'ad': return { ...basePost, type: 'ad', isAd: true, image: `https://picsum.photos/seed/ad${id}/800/600`, ctaText: ['Conferir', 'Comprar', 'Saiba Mais'][id % 3], ctaLink: '/#/marketplace', text: 'Este é um anúncio especial. Aproveite a oferta por tempo limitado!' };
        case 'poll': return { ...basePost, type: 'poll', text: 'Qual tecnologia você prefere para desenvolvimento frontend?', pollOptions: [{ text: 'React', votes: Math.floor(Math.random() * 50) }, { text: 'Vue', votes: Math.floor(Math.random() * 40) }, { text: 'Svelte', votes: Math.floor(Math.random() * 30) }, { text: 'Angular', votes: Math.floor(Math.random() * 20) }] as PollOption[], votedOptionIndex: Math.random() > 0.6 ? Math.floor(Math.random() * 4) : null };
        case 'text': default: return { ...basePost, type: 'text' };
    }
}

const handleFeedSimulado = (urlObj: URL): Promise<Response> => {
    console.log('[SIMULAÇÃO] ✅ Retornando mock para: GET /api/posts');
    const cursor = parseInt(urlObj.searchParams.get('cursor') || '0', 10);
    const limit = parseInt(urlObj.searchParams.get('limit') || '10', 10);
    const postsData: Post[] = todosOsPostsSimulados.slice(cursor, cursor + limit);
    const nextCursor = (cursor + limit < todosOsPostsSimulados.length) ? cursor + limit : null;
    return Promise.resolve(new Response(JSON.stringify({ data: postsData, nextCursor }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
};

export const handleUserPostsSimulado = (url: URL): Promise<Response> => {
    const userIdMatch = url.pathname.match(/api\/users\/(.*?)\/posts/);
    if (!userIdMatch) return Promise.resolve(new Response(JSON.stringify({ message: 'ID de usuário não encontrado na URL' }), { status: 400 }));
    
    const userId = userIdMatch[1];
    console.log(`[SIMULAÇÃO] ✅ Retornando mock para posts do usuário: ${userId}`);

    const userPosts = todosOsPostsSimulados.filter(p => p.authorId === userId);

    return Promise.resolve(new Response(JSON.stringify({ data: userPosts }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    }));
};

export const feedHandlers: Record<string, (url: URL, config?: RequestInit) => Promise<Response>> = {
    '/api/posts': handleFeedSimulado,
};

export const mockPostService = {
    async listPosts(token: string | null, { limit, cursor }: { limit: number; cursor?: number | null }): Promise<{ data: Post[]; nextCursor: number | null; }> {
        console.log('[SIMULAÇÃO] ✅ Retornando mock para: GET /api/posts via mockPostService');
        const numericCursor = cursor || 0;
        const postsData = todosOsPostsSimulados.slice(numericCursor, numericCursor + limit);
        const nextCursor = (numericCursor + limit < todosOsPostsSimulados.length) ? numericCursor + limit : null;
        return Promise.resolve({ data: postsData, nextCursor });
    },

    async getUserPosts(userId: string): Promise<Post[]> { // FUNÇÃO ADICIONADA
        console.log(`[SIMULAÇÃO] ✅ Retornando mock para posts do usuário: ${userId} via mockPostService`);
        const userPosts = todosOsPostsSimulados.filter(p => p.authorId === userId);
        return Promise.resolve(userPosts);
    },

    async incrementView(postId: string): Promise<void> { console.log(`[SIMULAÇÃO] ✅ View incrementada para post: ${postId}`); return Promise.resolve(); },
    async deletePost(id: string): Promise<void> { console.log(`[SIMULAÇÃO] ✅ Post deletado: ${id}`); return Promise.resolve(); },
    async toggleLike(id: string): Promise<void> { console.log(`[SIMULAÇÃO] ✅ Like alterado para post: ${id}`); return Promise.resolve(); },
    async voteOnPoll(postId: string, index: number): Promise<void> { console.log(`[SIMULAÇÃO] ✅ Voto na enquete: Post ${postId}, Opção ${index}`); return Promise.resolve(); },
    async incrementShare(id: string): Promise<void> { console.log(`[SIMULAÇÃO] ✅ Compartilhamento incrementado para post: ${id}`); return Promise.resolve(); },
};
