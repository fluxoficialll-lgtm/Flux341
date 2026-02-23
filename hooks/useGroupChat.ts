
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { ChatMessage, Group } from '../types';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';
import { VirtuosoHandle } from 'react-virtuoso';
import { socketService } from '../ServiçosFrontend/ServiçoDeSoquete/ServiçoDeSoquete.js';

export const useGroupChat = () => {
  const navigate = useNavigate();
  const { groupId, channelId } = useParams<{ groupId: string; channelId?: string }>();
  
  // O ID da conversa no chatService pode ser o ID do grupo (para o canal principal)
  // ou um ID composto para sub-canais.
  const chatId = useMemo(() => channelId ? `${groupId}_${channelId}` : groupId, [groupId, channelId]);

  const [group, setGroup] = useState<Group | null>(null);
  const [channelName, setChannelName] = useState('Geral');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBlocked, setIsBlocked] = useState(false); // Pode representar se o usuário foi banido, etc.

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [loading, setLoading] = useState(true);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const currentUserEmail = useMemo(() => authService.getCurrentUserEmail()?.toLowerCase(), []);

  const loadChatData = useCallback(async (isSilent = false) => {
    if (!groupId) { navigate('/groups'); return; }
    if (!isSilent) setLoading(true);

    const groupData = await groupService.getGroupById(groupId);
    if (!groupData) { navigate('/groups'); return; }
    setGroup(groupData);

    if (channelId) {
        const channel = groupData.channels?.find(c => c.id === channelId);
        setChannelName(channel?.name || 'Canal Desconhecido');
    } else {
        setChannelName('Geral');
    }

    const chatData = chatService.getChat(chatId);
    setIsBlocked(chatData?.isBlocked || false);

    const rawMessages = chatData?.messages || [];
    const uniqueMap = new Map();
    rawMessages.forEach(m => {
        if (!m.deletedBy?.includes(currentUserEmail || '')) {
            uniqueMap.set(m.id, m);
        }
    });
    const deduplicated = Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
    setMessages(deduplicated);

    if (!isSilent) setLoading(false);
  }, [groupId, channelId, chatId, currentUserEmail, navigate]);

  useEffect(() => {
      loadChatData();
      const unsubDeleteMsgs = socketService.on('messages_deleted_globally', (data: any) => {
          if (data.chatId === chatId) loadChatData(true);
      });
      const unsubDb = servicoDeSimulacao.subscribe('chats', () => loadChatData(true));
      
      return () => {
          unsubDeleteMsgs();
          unsubDb();
      };
  }, [chatId, loadChatData]);

  const handleSendMessage = (text: string) => {
    const userInfo = authService.getCurrentUser();
    const newMessage: ChatMessage = {
        id: Date.now(), text, type: 'sent', contentType: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent', senderEmail: userInfo?.email, senderAvatar: userInfo?.profile?.photoUrl,
        senderName: userInfo?.profile?.nickname || userInfo?.profile?.name || 'Usuário', deletedBy: []
    };
    // Ao enviar para um grupo, incluímos o groupId para o backend rotear corretamente
    chatService.sendMessage(chatId, newMessage, true, groupId);
  };

  const handleToggleSelection = (msgId: number) => {
      setSelectedIds(prev => {
          const next = prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId];
          if (next.length === 0) setIsSelectionMode(false);
          return next;
      });
  };

  const handleStartSelection = (msgId: number) => {
      setIsSelectionMode(true);
      setSelectedIds([msgId]);
      if (navigator.vibrate) navigator.vibrate(10);
  };

  const deleteSelectedMessages = async (target: 'me' | 'all') => {
      if (selectedIds.length === 0) return;
      await chatService.deleteMessages(chatId, selectedIds, target);
      setIsSelectionMode(false);
      setSelectedIds([]);
      loadChatData(true);
  };

  return {
    loading, group, channelName, messages, isBlocked, virtuosoRef, isSelectionMode, selectedIds, currentUserEmail,
    handleSendMessage, handleToggleSelection, handleStartSelection, deleteSelectedMessages, setIsSelectionMode, setSelectedIds, navigate
  };
};
