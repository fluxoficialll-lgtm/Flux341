
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { relationshipService } from '../ServiçosFrontend/ServiçoDeRelacionamento/relationshipService.js';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { User } from '../types';
import { db } from '@/database';

export const useGlobalSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const currentUserEmail = authService.getCurrentUserEmail();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setLoading(true);
        try {
          const results = await authService.searchUsers(searchTerm);
          setUsers(results);
        } catch (error) {
          console.error("Search error", error);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const unsubRel = db.subscribe('relationships', () => {
      setTick(prev => prev + 1);
    });
    return () => unsubRel();
  }, []);

  const enrichedUsers = useMemo(() => {
    return users.map(user => {
        const username = user.profile?.name || 'unknown';
        const status = relationshipService.isFollowing(username);
        const isPrivate = user.profile?.isPrivate || false;
        const isMe = user.email === currentUserEmail;
        const canMessage = (!isPrivate || status === 'following') && !isMe;

        let btnText = 'Seguir';
        let btnClass = 'action-btn btn-follow';

        if (status === 'requested') {
            btnText = 'Solicitado';
            btnClass = 'action-btn btn-requested';
        } else if (status === 'following') {
            btnText = 'Seguindo';
            btnClass = 'action-btn btn-following';
        }

        return {
            ...user,
            isMe,
            canMessage,
            followStatus: status,
            btnText,
            btnClass
        };
    });
  }, [users, tick, currentUserEmail]);

  const handleAction = async (user: User) => {
    const username = user.profile?.name;
    if (!username || processingId) return;

    setProcessingId(user.id);
    try {
      const status = relationshipService.isFollowing(username);
      if (status === 'none') {
        await relationshipService.followUser(username);
      } else {
        await relationshipService.unfollowUser(username);
      }
    } catch (error: any) {
      console.error("[Search] Follow error:", error);
      throw error;
    } finally {
      setProcessingId(null);
    }
  };

  const handleProfileClick = (username: string) => {
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    navigate(`/user/${cleanUsername}`);
  };

  const handleMessageClick = (user: User) => {
    if (currentUserEmail && user.email) {
      const chatId = chatService.getPrivateChatId(currentUserEmail, user.email);
      navigate(`/chat/${chatId}`);
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/messages');
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredUsers: enrichedUsers,
    loading,
    processingId,
    handleAction,
    handleProfileClick,
    handleMessageClick,
    handleBack
  };
};
