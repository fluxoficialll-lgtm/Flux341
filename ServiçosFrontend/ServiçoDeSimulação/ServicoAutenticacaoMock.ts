
// Mock do serviço de autenticação que simula o comportamento de um serviço real usando sessionStorage.

const USER_KEY = 'mock_user';
const TOKEN_KEY = 'mock_token';

export const ServicoAutenticacaoMock = {
  
  async login(email: string, password?: string) {
    console.log(`[MOCK] Realizando login para: ${email}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockUser = {
      uid: 'user-mock-123',
      email: email,
      isProfileCompleted: true, 
      name: email.split('@')[0], // Nome de usuário derivado do email
      avatar: 'https://i.pravatar.cc/150?u=' + email // Avatar aleatório baseado no email
    };
    const mockToken = 'token-mock-abc-123-xyz';

    sessionStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    sessionStorage.setItem(TOKEN_KEY, mockToken);

    return {
      user: mockUser,
      token: mockToken,
      nextStep: '/feed',
    };
  },

  async loginWithGoogle(credential: string, referredBy?: string) {
    console.log('[MOCK] Realizando login com Google.');
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockUser = {
      uid: 'user-mock-google-456',
      email: 'google.mock@example.com',
      isProfileCompleted: true,
      name: 'Usuário Google',
      avatar: 'https://i.pravatar.cc/150?u=googlemock'
    };
    const mockToken = 'token-mock-google-xyz-456';

    sessionStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    sessionStorage.setItem(TOKEN_KEY, mockToken);

    return {
      user: mockUser,
      token: mockToken,
      nextStep: '/feed',
    };
  },

  /**
   * Verifica se um token mock existe no sessionStorage.
   */
  isAuthenticated: () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  /**
   * Retorna o usuário mock do sessionStorage, se existir.
   */
  getCurrentUser: () => {
    const user = sessionStorage.getItem(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Retorna o token mock do sessionStorage.
   */
  getToken: () => {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Limpa os dados de sessão para simular o logout.
   */
  logout: async () => {
    console.log('[MOCK] Realizando logout e limpando sessão.');
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  },
};
