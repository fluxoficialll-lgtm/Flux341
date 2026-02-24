
// ServiçosFrontend/ServiçoDeSimulação/simulacoes/SimulacaoDeFeed.js

/**
 * Gera um objeto de post simulado muito mais rico e realista, 
 * cobrindo os diferentes tipos e propriedades que a UI espera.
 */
const criarPostSimulado = (id) => {
    const nomes = ['Alice', 'Beto', 'Carla', 'Daniel', 'Eva', 'Fernanda', 'Gabriel'];
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
    const postType = ['text', 'photo', 'ad', 'poll', 'multi-photo'][id % 5];

    const basePost = {
        id: `mock_${id}`,
        username: nomes[index],
        avatar: avatares[index],
        authorId: `user-mock-${index}`,
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
        // Propriedades nulas por padrão, sobrescritas pelo tipo
        image: null,
        images: [],
        video: null,
        pollOptions: [],
        votedOptionIndex: null,
        ctaLink: null,
        ctaText: null,
        relatedGroupId: null,
    };

    switch (postType) {
        case 'photo':
            return {
                ...basePost,
                type: 'photo',
                image: `https://picsum.photos/seed/${id}/800/600`,
            };
        case 'multi-photo':
            return {
                ...basePost,
                type: 'photo',
                images: [
                    `https://picsum.photos/seed/${id * 2}/800/600`,
                    `https://picsum.photos/seed/${id * 3}/800/600`,
                    `https://picsum.photos/seed/${id * 4}/800/600`,
                ],
            };
        case 'ad':
            return {
                ...basePost,
                type: 'photo', // Anúncios podem ter imagem
                isAd: true,
                image: `https://picsum.photos/seed/ad${id}/800/600`,
                ctaText: ['Conferir', 'Comprar', 'Saiba Mais'][id % 3],
                ctaLink: '/#/marketplace',
                text: 'Este é um anúncio especial. Aproveite a oferta por tempo limitado!',
            };
        case 'poll':
            return {
                ...basePost,
                type: 'poll',
                text: 'Qual tecnologia você prefere para desenvolvimento frontend?',
                pollOptions: [
                    { text: 'React', votes: Math.floor(Math.random() * 50) },
                    { text: 'Vue', votes: Math.floor(Math.random() * 40) },
                    { text: 'Svelte', votes: Math.floor(Math.random() * 30) },
                    { text: 'Angular', votes: Math.floor(Math.random() * 20) },
                ],
                votedOptionIndex: Math.random() > 0.6 ? Math.floor(Math.random() * 4) : null,
            };
        case 'text':
        default:
            return { ...basePost, type: 'text' };
    }
};

const handleFeedSimulado = (urlObj) => {
    console.log('[SIMULAÇÃO] ✅ Retornando mock para: GET /api/posts');
    const cursor = parseInt(urlObj.searchParams.get('cursor') || '0');
    const limit = parseInt(urlObj.searchParams.get('limit') || '10');
    
    // Gera 10 posts com IDs de `cursor` a `cursor + 9`
    const postsData = Array.from({ length: limit }, (_, i) => criarPostSimulado(cursor + i));
    
    const nextCursor = cursor + limit;

    return Promise.resolve(new Response(JSON.stringify({
        data: postsData,
        // Define um limite para a paginação não ser infinita
        nextCursor: nextCursor < 50 ? nextCursor : null 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
};

export const feedHandlers = {
    '/api/posts': handleFeedSimulado
};
