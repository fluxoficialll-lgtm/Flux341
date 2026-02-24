
import { User, AuthResponse } from '../../../types';

const USER_KEY = 'mock_user';
const TOKEN_KEY = 'mock_token';

export const ServicoAutenticacaoMock = {
  async login(email: string, password?: string): Promise<AuthResponse> {
    console.log(`[MOCK] Realizando login para: ${email}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockUser: User = {
      uid: 'user-mock-123',
      email: email,
      isProfileCompleted: true, 
      name: email.split('@')[0],
      avatar: 'https://i.pravatar.cc/150?u=' + email,
      bio: 'Entusiasta de tecnologia e café. Explorando o mundo do desenvolvimento web.',
      level: 5,
      xp: 450,
      requiredXp: 500,
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

  async loginWithGoogle(credential: any, referredBy?: string): Promise<AuthResponse> {
    console.log('[MOCK] Realizando login com Google.');
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockUser: User = {
      uid: 'user-mock-google-456',
      email: 'google.mock@example.com',
      isProfileCompleted: true,
      name: 'Usuário Google',
      avatar: 'https://i.pravatar.cc/150?u=googlemock',
      bio: 'Apenas um usuário de testes do Google.',
      level: 1,
      xp: 10,
      requiredXp: 100,
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

  isAuthenticated: (): boolean => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  getCurrentUser: (): User | null => {
    const userStr = sessionStorage.getItem(USER_KEY);
    try {
      return userStr ? JSON.parse(userStr) as User : null;
    } catch (e) {
      return null;
    }
  },

  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  logout: async (): Promise<void> => {
    console.log('[MOCK] Realizando logout e limpando sessão.');
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  },
};

const loginHandler = async (urlObj: URL, config?: RequestInit): Promise<Response> => {
    if (config?.method?.toUpperCase() !== 'POST') {
        return new Response(JSON.stringify({ message: 'Only POST method is allowed for login.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }
    if (!config?.body) {
        return new Response(JSON.stringify({ message: 'Request body is missing.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { email, password } = JSON.parse(config.body as string);
        
        if (!email) {
            return new Response(JSON.stringify({ message: 'Email is required for login.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        console.log(`[SIMULAÇÃO] ✅ Recebida requisição de login para: ${email}`);
        const result = await ServicoAutenticacaoMock.login(email, password);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('[SIMULAÇÃO] ❌ Erro no handler de login:', error);
        return new Response(JSON.stringify({ message: 'Erro interno no simulador de login.', error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

export const authHandlers: Record<string, (url: URL, config?: RequestInit) => Promise<Response>> = {
    '/api/auth/login': loginHandler,
};
