
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Group } from '../types';
import { useGroupRanking } from './useGroupRanking';

export const useTopGroups = () => {
  const navigate = useNavigate();
  const currentUserId = authService.getCurrentUserId();
  
  // O hook useGroupRanking já lida com a busca de dados e o estado de loading
  const { groups, loading, activeTab } = useGroupRanking();

  const handleTabChange = (newTab: 'public' | 'private' | 'vip') => {
      // A lógica de navegação para mudar a aba é parte da UI desta página
      if (newTab !== activeTab) {
          navigate(`/top-groups/${newTab}`);
      }
  };

  const handleGroupAction = (group: Group) => {
      if (!currentUserId) {
          // Idealmente, isso seria tratado por um modal de alerta global
          alert('Você precisa estar logado para interagir com os grupos.');
          return;
      }
      
      const isMember = group.memberIds?.includes(currentUserId);
      
      if (isMember) {
          navigate(`/group-chat/${group.id}`);
      } else {
          if (group.isVip) {
              navigate(`/vip-group-sales/${group.id}`);
          } else {
              navigate(`/group-landing/${group.id}`);
          }
      }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
    } else {
        navigate('/groups'); // Fallback para a página principal de grupos
    }
  };

  return {
    groups,
    loading,
    activeTab,
    currentUserId,
    handleTabChange,
    handleGroupAction,
    handleBack
  };
};
