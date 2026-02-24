
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupServiceFactory';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authServiceFactory';
import { Group } from '../types';
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';

// Hook refatorado para ser resiliente e adaptar-se
// à interface de serviço de produção (async, com token) e de simulação (sync).
export const useGroups = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUserEmail = authService.getCurrentUserEmail();
  const currentUserId = authService.getCurrentUser()?.id;

  // Função de carregamento unificada e inteligente.
  const loadGroups = useCallback(async () => {
    setLoading(true);
    let newGroups: Group[] = [];
    try {
      // Verifica a interface do serviço fornecido pela factory.
      if (typeof (groupService as any).listGroups === 'function') {
        // Modo Produção: requer token e é async.
        const token = localStorage.getItem('authToken');
        if (token) {
          newGroups = await (groupService as any).listGroups(token);
        } else {
          console.warn('Nenhum token de autenticação encontrado para carregar grupos.');
        }
      } else if (typeof (groupService as any).getAll === 'function') {
        // Modo Simulação: é sync.
        newGroups = (groupService as any).getAll();
      } else {
        console.error("Serviço de grupo não possui um método conhecido (listGroups ou getAll).");
      }
    } catch (error) {
      console.error("Falha ao carregar grupos:", error);
    } finally {
      setGroups(newGroups);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUserEmail) {
      navigate('/');
      return;
    }
    
    loadGroups();

    const params = new URLSearchParams(location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      joinGroupByCode(joinCode, true);
      navigate('/groups', { replace: true });
    }

    // Assinaturas para recarregar a lista quando os dados mudam na simulação.
    const unsubscribeGroups = servicoDeSimulacao.subscribe('groups', loadGroups);
    const unsubscribeChats = servicoDeSimulacao.subscribe('chats', loadGroups);

    return () => {
      unsubscribeGroups();
      unsubscribeChats();
    };
    // Adicionado `loadGroups` ao array de dependências.
  }, [navigate, location.search, currentUserEmail, loadGroups]);

  const navigateToGroup = (group: Group) => {
    const isCreator = group.creatorEmail === currentUserEmail;
    const isMember = group.memberIds?.includes(currentUserId || '');
    
    if (group.isSalesPlatformEnabled && (isCreator || isMember)) {
      navigate(`/group-platform/${group.id}`);
      return;
    }
    if (isCreator || isMember) {
      if (group.isVip && !isCreator && currentUserId) {
        const hasAccess = servicoDeSimulacao.vipAccess.check(currentUserId, group.id);
        if (!hasAccess) { navigate(`/vip-group-sales/${group.id}`); return; }
      }
      const hasMultipleChannels = group.channels && group.channels.length > 0;
      navigate(hasMultipleChannels ? `/group/${group.id}/channels` : `/group-chat/${group.id}`);
    } else if (group.isVip) {
      navigate(`/vip-group-sales/${group.id}`);
    } else {
      navigate(`/group-landing/${group.id}`);
    }
  };

  const joinGroupByCode = (inputCode: string, fromUrl: boolean = false) => {
    if (!inputCode?.trim()) return null;
    
    // Esta função só existe no serviço de simulação.
    if (typeof (groupService as any).joinGroupByLinkCode !== 'function') {
      console.warn('joinGroupByCode não é suportado no ambiente de produção atual.');
      return { success: false, message: 'Operação não suportada.' };
    }

    let code = inputCode;
    if (code.includes('?join=')) {
      code = code.split('?join=')[1];
    }
    
    const result = (groupService as any).joinGroupByLinkCode(code);
    if (result.success) {
      loadGroups(); // Recarrega os grupos.
      if (!fromUrl && result.groupId) {
        const group = (groupService as any).findById(result.groupId);
        if (group) navigateToGroup(group);
      }
    }
    return result;
  };

  const deleteGroup = async (groupId: string) => {
    try {
      if (typeof (groupService as any).deleteGroup === 'function') {
        const token = localStorage.getItem('authToken');
        if(token) await (groupService as any).deleteGroup(token, groupId);
      } else if (typeof (groupService as any).delete === 'function') {
        (groupService as any).delete(groupId);
      }
      // Atualiza a UI removendo o grupo.
      setGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (error) {
      console.error(`Falha ao deletar o grupo ${groupId}:`, error);
    }
  };

  const getUnreadCount = (groupId: string) => {
    return chatService.getGroupUnreadCount(groupId);
  }

  return {
    groups, loading, currentUserEmail, navigate,
    navigateToGroup, joinGroupByCode, deleteGroup, getUnreadCount,
    observerRef: null // removido, pois não há mais paginação
  };
};
