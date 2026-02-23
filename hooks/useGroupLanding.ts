
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Group } from '../types';
import { db } from '@/database';
import { CapacityValidator } from '../Componentes/ComponentesDeGroups/logic/CapacityValidator';

export const useGroupLanding = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [creatorAvatar, setCreatorAvatar] = useState<string | undefined>(undefined);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!id) {
        setLoading(false);
        return;
    }

    const foundGroup = groupService.getGroupById(id);
    const currentUserId = authService.getCurrentUserId();

    if (foundGroup) {
        // Se o usuário já for membro, redirecione imediatamente
        if (currentUserId && foundGroup.memberIds?.includes(currentUserId)) {
            const hasChannels = foundGroup.channels && foundGroup.channels.length > 0;
            navigate(hasChannels ? `/group/${id}/channels` : `/group-chat/${id}`, { replace: true });
            return; // Interrompe a execução para evitar a atualização do estado desnecessariamente
        }

        setGroup(foundGroup);

        // Define os estados com base no usuário atual
        if (currentUserId) {
            setIsMember(foundGroup.memberIds?.includes(currentUserId) || false);
            setRequestSent(foundGroup.pendingMemberIds?.includes(currentUserId) || false);
            setIsBanned(foundGroup.bannedUserIds?.includes(currentUserId) || false);
        }

        // Busca informações do criador
        if (foundGroup.creatorEmail) {
            const creator = Object.values(db.users.getAll()).find(u => u.email === foundGroup.creatorEmail);
            if (creator) {
                setCreatorName(creator.profile?.nickname || creator.profile?.name || 'Criador');
                setCreatorAvatar(creator.profile?.photoUrl);
            } else {
                setCreatorName('Administrador');
            }
        } else {
            setCreatorName('Administrador');
        }

        // Calcula a contagem de membros online
        if (foundGroup.memberIds && foundGroup.memberIds.length > 0) {
            const allUsers = Object.values(db.users.getAll());
            const memberSet = new Set(foundGroup.memberIds);
            const count = allUsers.filter(u => memberSet.has(u.id) && u.lastSeen && (Date.now() - u.lastSeen < 900000)).length;
            setOnlineCount(count > 0 ? count : 1); // Garante pelo menos 1 online se houver membros
        }
        
    } 

    setLoading(false);

  }, [id, navigate]);

  const handleJoinAction = () => {
    if (!group || !id || isBanned) return;

    if (CapacityValidator.isFull(group)) {
        alert("Lamentamos, mas este grupo atingiu o limite máximo de participantes.");
        return;
    }

    const result = groupService.joinGroup(id);
    if (result === 'joined') {
        const hasChannels = group.channels && group.channels.length > 0;
        navigate(hasChannels ? `/group/${id}/channels` : `/group-chat/${id}`);
    } else if (result === 'pending') {
        setRequestSent(true);
    }
  };

  const handleBack = () => {
      navigate('/groups');
  };

  const isFull = group ? CapacityValidator.isFull(group) : false;

  return {
    group,
    loading,
    isMember,
    requestSent,
    isBanned,
    isFull,
    creatorName,
    creatorAvatar,
    onlineCount,
    handleJoinAction,
    handleBack
  };
};
