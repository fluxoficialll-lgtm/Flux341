
// --- ORQUESTRADOR DE DADOS SIMULADOS ---
// Este arquivo centraliza a importação de todos os dados simulados,
// facilitando a gestão e o acesso em um único ponto.

// Determina se o modo de simulação deve ser ativado.
export const USE_MOCKS = import.meta.env.DEV;

// Importação dos dados simulados específicos de cada módulo
import { MOCK_USERS } from './usuarios.js';
import { MOCK_POSTS } from './posts.js';
import { MOCK_PRODUCTS } from './produtos.js';
import { MOCK_GROUPS } from './grupos.js';
import { MOCK_CAMPAIGNS } from './campanhas.js';
import { MOCK_NOTIFICATIONS } from './notificacoes.js';
import { MOCK_CHATS } from './chats.js';

// Re-exporta todos os dados para que possam ser importados de um único local
export {
  MOCK_USERS,
  MOCK_POSTS,
  MOCK_PRODUCTS,
  MOCK_GROUPS,
  MOCK_CAMPAIGNS,
  MOCK_NOTIFICATIONS,
  MOCK_CHATS,
};
