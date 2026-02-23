
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Group } from '../types';
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';

const LIMIT = 15;

export const useGroups = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  
  const currentUserEmail = authService.getCurrentUserEmail();
  const currentUserId = authService.getCurrentUserId();

  const observerRef = useRef<HTMLDivElement>(null);

  const loadGroups = useCallback((currentOffset: number, reset: boolean = false) => {
    setLoading(true);
    const { groups: newGroups, hasMore: moreAvailable } = groupService.getGroupsPaginated(currentOffset, LIMIT);
    
    if (reset) {
      setGroups(newGroups);
    } else {
      setGroups(prev => {
        const ids = new Set(prev.map(g => g.id));
        const unique = newGroups.filter(g => !ids.has(g.id));
        return [...prev, ...unique];
      });
    }

    setOffset(reset ? LIMIT : currentOffset + LIMIT);
    setHasMore(moreAvailable);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!currentUserEmail) { navigate('/'); return; }
    
    groupService.fetchGroups(); // Sincroniza em segundo plano
    loadGroups(0, true);

    const params = new URLSearchParams(location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      joinGroupByCode(joinCode, true);
      navigate('/groups', { replace: true });
    }

    const unsubscribeGroups = servicoDeSimulacao.subscribe('groups', () => loadGroups(0, true));
    const unsubscribeChats = servicoDeSimulacao.subscribe('chats', () => loadGroups(0, true)); // Para atualizar unread counts

    return () => {
      unsubscribeGroups();
      unsubscribeChats();
    };
  }, [navigate, location.search, loadGroups, currentUserEmail]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadGroups(offset);
      }
    }, { threshold: 0.5 });

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, loading, offset, loadGroups]);

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
    let code = inputCode;
    if (code.includes('?join=')) {
      code = code.split('?join=')[1];
    }
    const result = groupService.joinGroupByLinkCode(code);
    if (result.success) {
      loadGroups(0, true);
      if (!fromUrl && result.groupId) {
        const group = groupService.getGroupById(result.groupId);
        if (group) navigateToGroup(group);
      }
    }
    return result;
  };

  const deleteGroup = (groupId: string) => {
    groupService.deleteGroup(groupId);
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const getUnreadCount = (groupId: string) => {
    return chatService.getGroupUnreadCount(groupId);
  }

  return {
    groups, loading, observerRef, currentUserEmail, navigate,
    navigateToGroup, joinGroupByCode, deleteGroup, getUnreadCount
  };
};
