
// Determina se o modo de simulação deve ser ativado.
// Em um ambiente de desenvolvimento Vite, `import.meta.env.DEV` é a forma padrão de verificar.
export const USE_MOCKS = import.meta.env.DEV;

// --- DADOS SIMULADOS PARA INJEÇÃO LOCAL ---
// Estes dados são usados para popular a base de dados local (SQLite/IndexedDB)
// quando a aplicação inicia em modo de desenvolvimento.

// Usuários Simulados
export const MOCK_USERS = {
  '1': { id: '1', name: 'Alice', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80' },
  '2': { id: '2', name: 'Beto', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80' },
};

// Posts Simulados
export const MOCK_POSTS = [
  {
    id: 'mock_101',
    username: 'Alice',
    avatar: MOCK_USERS['1'].avatar,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    text: 'Um lindo dia no parque!',
    image: 'https://images.unsplash.com/photo-1583147610149-78ac5cb5a303?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    likes: 150,
    comments: 23,
    views: 2500,
    liked: false,
    type: 'image',
    isAd: false,
  }
];

// Produtos Simulados para o Marketplace
export const MOCK_PRODUCTS = [];

// Grupos Simulados
export const MOCK_GROUPS = [];

// Campanhas de Anúncios Simuladas
export const MOCK_CAMPAIGNS = [];

// Notificações Simuladas
export const MOCK_NOTIFICATIONS = [];

// Chats Simulados
export const MOCK_CHATS = [];
