
import { authService as productionAuthService } from '../ServiçoDeAutenticação/authService';
import { ServicoAutenticacaoMock } from './simulacoes/SimulacaoDeAuth.js';
import { groupService as productionGroupService } from '../ServiçoDeGrupos/groupService';
import { servicoDeSimulacao } from './index';
import { Group } from '../../types';

const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
const useMockGroups = import.meta.env.VITE_USE_MOCK_GROUPS === 'true';

console.log(useMockAuth ? '[AuthFactory] Usando Serviço de Autenticação MOCK.' : '[AuthFactory] Usando Serviço de Autenticação de PRODUÇÃO.');
console.log(useMockGroups ? '[GroupFactory] Usando Serviço de Grupos MOCK (com adaptador).' : '[GroupFactory] Usando Serviço de Grupos de PRODUÇÃO (com adaptador).');

export const authService = useMockAuth ? ServicoAutenticacaoMock : productionAuthService;

const adaptedGroupService = {
  async getGroups(): Promise<Group[]> {
    if (useMockGroups) {
      return Promise.resolve(servicoDeSimulacao.groups.getAll());
    } else {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token de autenticação não encontrado para a chamada de getGroups.');
        return Promise.resolve([]);
      }
      return productionGroupService.listGroups(token);
    }
  },

  async getGroupById(id: string): Promise<Group | undefined> {
      if (useMockGroups) {
          return Promise.resolve(servicoDeSimulacao.groups.findById(id));
      } else {
          const token = localStorage.getItem('authToken');
          if (!token) return Promise.resolve(undefined);
          return productionGroupService.getGroupById(token, id);
      }
  },

  async updateGroup(groupData: Partial<Group>): Promise<any> {
      if (useMockGroups) {
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
    if (useMockGroups) {
      return Promise.resolve(servicoDeSimulacao.groups.delete(id));
    } else {
        const token = localStorage.getItem('authToken');
        if (!token) return Promise.reject("Token ausente.");
        return productionGroupService.deleteGroup(token, id);
    }
  }
};

export const groupService = adaptedGroupService;
