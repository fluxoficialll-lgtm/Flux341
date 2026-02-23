
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { ChatData } from '../types';

export const useBlockedUsers = () => {
  const navigate = useNavigate();
  const [blockedChats, setBlockedChats] = useState<ChatData[]>([]);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = () => {
    const allChatsMap = chatService.getAllChats();
    const allChats = Object.values(allChatsMap);
    const blocked = allChats.filter(chat => chat.isBlocked);
    setBlockedChats(blocked);
  };

  const handleUnblock = (chatId: string | number) => {
    if (window.confirm("Deseja realmente desbloquear este usuário?")) {
      chatService.toggleBlock(chatId.toString());
      setBlockedChats(prev => prev.filter(chat => chat.id.toString() !== chatId.toString()));
    }
  };

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate('/settings');
      }
  };

  return { blockedChats, handleUnblock, handleBack };
};
