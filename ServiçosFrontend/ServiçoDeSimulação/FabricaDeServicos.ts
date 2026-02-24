
import { ControleDeSimulacao } from './ControleDeSimulacao';

// Importa os serviços de PRODUÇÃO
import { authService as productionAuthService } from '../ServiçoDeAutenticação/authService';
import { groupService as productionGroupService } from '../ServiçoDeGrupos/groupService';
import { postService as realPostService } from '../ServiçoDePosts/postService';

// Importa os serviços MOCK
import { ServicoAutenticacaoMock } from './simulacoes/SimulacaoDeAuth';
import { servicoDeSimulacao as mockServiceManager } from './index';
import { mockPostService } from './simulacoes/SimulacaoDeFeed';

import { Group } from '../../types'; // Corrigido para subir dois níveis

// --- Ponto Central de Decisão ---
const isMockMode = ControleDeSimulacao.isMockMode();

console.log(
  isMockMode
    ? '[FabricaDeServicos] Usando serviços de SIMULAÇÃO (MOCK).'
    : '[FabricaDeServicos] Usando serviços de PRODUÇÃO.'
);

// --- Exportação dos Serviços ---

// 1. Serviço de Autenticação
export const authService = isMockMode ? ServicoAutenticacaoMock : productionAuthService;

// 2. Serviço de Posts
export const postService = isMockMode ? mockPostService : realPostService;

// 3. Serviço de Grupos (com o padrão Adaptador para manter a consistência)
const getAdaptedGroupService = () => {
  if (!isMockMode) {
    return productionGroupService; // Em produção, a interface já é a correta.
  }

  // Em modo mock, usamos o adaptador para unificar a interface.
  return {
    async getGroups(): Promise<Group[]> {
      return Promise.resolve(mockServiceManager.groups.getAll());
    },

    async getGroupById(id: string): Promise<Group | undefined> {
      return Promise.resolve(mockServiceManager.groups.findById(id));
    },

    async updateGroup(groupData: Partial<Group>): Promise<any> {
      const currentGroup = mockServiceManager.groups.findById(groupData.id!);
      if (!currentGroup) return Promise.reject("Grupo não encontrado no mock.");
      const updated = { ...currentGroup, ...groupData };
      return Promise.resolve(mockServiceManager.groups.update(updated));
    },

    async deleteGroup(id: string): Promise<any> {
      return Promise.resolve(mockServiceManager.groups.delete(id));
    },
    
    // Adicione aqui outros métodos do `productionGroupService` que precisam de adaptação
    // Ex: createGroup, etc.
  };
};

export const groupService = getAdaptedGroupService();
