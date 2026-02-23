
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';
import { Group } from '../types';

export const useTopGroupsVip = () => {
  const navigate = useNavigate();
  const [rankedGroups, setRankedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
        const filtered = await groupService.getAllGroupsForRanking('vip');
        setRankedGroups(filtered);
    } catch (e) {
        console.error("Erro ao carregar ranking VIP:", e);
    } finally {
        if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = servicoDeSimulacao.subscribe('groups', () => loadData(true));
    return () => unsubscribe();
  }, [loadData]);

  const handleGroupAction = useCallback((group: Group) => {
      const currentUserId = authService.getCurrentUserId();
      if (!currentUserId) {
          // Poderia navegar para o login ou mostrar um modal
          return;
      }
      const isMember = group.memberIds?.includes(currentUserId);
      if (isMember) {
          navigate(`/group-chat/${group.id}`);
      } else {
          navigate(`/vip-group-sales/${group.id}`);
      }
  }, [navigate]);

  const handleTabNavigation = (path: string) => navigate(path);

  const handleBack = () => navigate('/groups');

  return {
    rankedGroups,
    loading,
    handleGroupAction,
    handleTabNavigation,
    handleBack,
  };
};
