
// ServiçosFrontend/ServiçoDeSimulação/simulacoes/SimulacaoDeFeed.js

// Função para criar um post simulado realista
const criarPostSimulado = (id, tipo = 'texto') => {
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
        'Acabei de voltar de uma viagem incrível pelas montanhas. A vista era de tirar o fôlego!',
        'Experimentando uma nova receita de café hoje. Alguém tem alguma dica?',
        'Qual é o melhor filme que vocês viram este ano? Preciso de recomendações!',
        'Animado para o jogo de hoje à noite! Quem mais vai assistir?',
        'Refletindo sobre a importância da sustentabilidade. Pequenas mudanças fazem uma grande diferença.',
        'Aprendendo a programar em React. É desafiador, mas muito recompensador!',
        'Um dia produtivo de trabalho remoto. A chave é ter um bom setup.'
    ];
    const imagens = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
        'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
        null,
        null,
        'https://images.unsplash.com/photo-1488998287214-1e668a8e0dc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
        null,
        'https://images.unsplash.com/photo-1593064650634-b25735c94a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'
    ];

    const index = id % nomes.length;
    
    return {
        id: `mock_${id}`,
        username: nomes[index],
        avatar: avatares[index],
        timestamp: new Date(Date.now() - id * 3600000).toISOString(),
        text: conteudos[index],
        image: imagens[index],
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 5000),
        liked: Math.random() > 0.8,
        type: tipo,
        isAd: false,
    };
};


const handleFeedSimulado = (urlObj) => {
    console.log('[SIMULAÇÃO] ✅ Retornando mock para: GET /api/posts');
    const cursor = parseInt(urlObj.searchParams.get('cursor') || '0');
    const limit = parseInt(urlObj.searchParams.get('limit') || '5');
    
    const postsData = Array.from({ length: limit }, (_, i) => criarPostSimulado(cursor + i));
    const nextCursor = cursor + limit;

    return Promise.resolve(new Response(JSON.stringify({
        data: postsData,
        nextCursor: nextCursor < 30 ? nextCursor : null // Simula o fim da paginação
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
};

// Mapeia o caminho do endpoint para a sua função de tratamento
export const feedHandlers = {
    '/api/posts': handleFeedSimulado
};
