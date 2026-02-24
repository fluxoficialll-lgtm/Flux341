
import { groupService as productionGroupService } from './groupService';
import { servicoDeSimulacao } from '../ServiçoDeSimulação';
import { Group } from '../../types'; // Garanta que o tipo `Group` seja importado.

const useMock = import.meta.env.VITE_USE_MOCK_GROUPS === 'true';

// Correção: A string de log foi consertada para não quebrar a linha.
console.log(
  useMock 
    ? '[GroupFactory] Usando Serviço de Grupos MOCK (com adaptador).'
    : '[GroupFactory] Usando Serviço de Grupos de PRODUÇÃO (com adaptador).'
);

// Padrão Adaptador: Unifica as interfaces dos serviços de produção e simulação.
const adaptedGroupService = {
  /**
   * Busca todos os grupos do usuário, abstraindo a fonte de dados (produção ou mock).
   * Retorna sempre uma Promise com um array de grupos.
   */
  async getGroups(): Promise<Group[]> {
    if (useMock) {
      // O serviço mock é síncrono, então o envolvemos em uma Promise para manter a consistência.
      return Promise.resolve(servicoDeSimulacao.groups.getAll());
    } else {
      // O serviço de produção é assíncrono e requer um token.
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token de autenticação não encontrado para a chamada de getGroups.');
        return Promise.resolve([]); // Retorna array vazio se não houver token.
      }
      // A chamada real para a API de produção.
      return productionGroupService.listGroups(token);
    }
  },

  // Adicione outros métodos do `productionGroupService` que você quer expor,
  // garantindo que eles tenham um fallback ou uma implementação mock se necessário.
  
  async getGroupById(id: string): Promise<Group | undefined> {
      if (useMock) {
          return Promise.resolve(servicoDeSimulacao.groups.findById(id));
      } else {
          const token = localStorage.getItem('authToken');
          if (!token) return Promise.resolve(undefined);
          return productionGroupService.getGroupById(token, id);
      }
  },

  async updateGroup(groupData: Partial<Group>): Promise<any> {
      if (useMock) {
          const currentGroup = servicoDeSimulacao.groups.findById(groupData.id!)
          if(!currentGroup) return Promise.reject("Grupo não encontrado no mock.")
          const updated = { ...currentGroup, ...groupData }
          return Promise.resolve(servicoDeSimulacao.groups.update(updated));
      } else {
          const token = localStorage.getItem('authToken');
          if (!token || !groupData.id) return Promise.reject("Token ou ID do grupo ausente.");
          return productionGroupService.updateGroup(token, groupData.id, groupData);
      }
  },

  async deleteGroup(id: string): Promise<any> {
    if (useMock) {
      return Promise.resolve(servicoDeSimulacao.groups.delete(id));
    } else {
        const token = localStorage.getItem('authToken');
        if (!token) return Promise.reject("Token ausente.");
        return productionGroupService.deleteGroup(token, id);
    }
  }

  // ... adicione outros métodos delegados conforme necessário
};

export const groupService = adaptedGroupService;
