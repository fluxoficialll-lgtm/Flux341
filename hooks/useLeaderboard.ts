
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { relationshipService } from '../ServiçosFrontend/ServiçoDeRelacionamento/relationshipService.js';
import { User } from '../types';

// A interface pode ser movida para um arquivo de tipos se for usada em outro lugar.
export interface RankedUser extends User {
    followerCount: number;
}

export const useLeaderboard = () => {
  const navigate = useNavigate();
  const [rankedUsers, setRankedUsers] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        try {
            const ranked = await relationshipService.getTopCreators();
            setRankedUsers(ranked);
        } catch (error) {
            console.error("Falha ao carregar o leaderboard:", error);
            setRankedUsers([]); // Garante que em caso de erro, a lista fique vazia
        } finally {
            setLoading(false);
        }
    };

    loadData();
  }, []);

  const handleUserClick = (username: string) => {
      if (!username) return;
      navigate(`/user/${username}`);
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
    } else {
        // Fallback para uma rota que faça sentido, como o perfil ou a home.
        navigate('/profile');
    }
  };

  return {
    rankedUsers,
    loading,
    handleUserClick,
    handleBack,
    // Separando os 3 primeiros para facilitar o uso na UI
    topThree: rankedUsers.slice(0, 3),
    // O resto da lista
    leaderboardList: rankedUsers.slice(3)
  };
};
