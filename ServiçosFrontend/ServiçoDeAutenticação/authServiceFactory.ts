
import { authService as productionAuthService } from './authService';
// Corrigido: Importa o mock do novo arquivo JS na pasta de simulações
import { ServicoAutenticacaoMock } from '../ServiçoDeSimulação/simulacoes/SimulacaoDeAuth.js';

// Decide qual serviço de autenticação usar com base na variável de ambiente.
// Vite expõe variáveis de ambiente através de `import.meta.env`.
const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Log para sabermos qual serviço está em uso durante o desenvolvimento
console.log(useMock ? '[AuthFactory] Usando Serviço de Autenticação MOCK.' : '[AuthFactory] Usando Serviço de Autenticação de PRODUÇÃO.');

// Exporta o serviço apropriado sob um nome único e consistente: `authService`.
// O resto da aplicação não precisa saber qual versão está sendo usada.
export const authService = useMock ? ServicoAutenticacaoMock : productionAuthService;
