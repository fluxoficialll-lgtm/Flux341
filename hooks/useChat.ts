
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { ChatMessage } from '../types';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { db } from '@/database';
import { VirtuosoHandle } from 'react-virtuoso';
import { socketService } from '../ServiçosFrontend/ServiçoDeSoquete/ServiçoDeSoquete.js';

export const useChat = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const chatId = id || '1';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactHandle, setContactHandle] = useState('');
  const [contactAvatar, setContactAvatar] = useState<string | undefined>(undefined);
  const [contactStatus, setContactStatus] = useState('Offline');
  const [isBlocked, setIsBlocked] = useState(false);
  
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [zoomedMedia, setZoomedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const currentUserEmail = useMemo(() => authService.getCurrentUserEmail()?.toLowerCase(), []);

  const loadChatData = useCallback((isSilent = false) => {
    const chatData = chatService.getChat(chatId);
    if (!chatData) { navigate('/messages'); return; }

    setIsBlocked(chatData.isBlocked);
    let targetUser = undefined;
    let displayName = chatData.contactName;
    let displayAvatar = undefined;
    let handle = '';

    if (chatId.includes('_') && chatId.includes('@') && currentUserEmail) {
        const otherEmail = chatId.split('_').find(p => p.toLowerCase() !== currentUserEmail);
        if (otherEmail) {
            const userRecord = Object.values(db.users.getAll()).find(u => u.email.toLowerCase() === otherEmail.toLowerCase());
            if (userRecord) {
                targetUser = userRecord;
                displayName = userRecord.profile?.nickname || userRecord.profile?.name || `@${userRecord.profile?.name}`;
                displayAvatar = userRecord.profile?.photoUrl;
                handle = userRecord.profile?.name || '';
            } else {
                displayName = otherEmail.split('@')[0];
            }
        }
    }

    setContactName(displayName);
    setContactAvatar(displayAvatar);
    setContactHandle(handle);

    if (targetUser?.lastSeen) {
        const diff = Date.now() - targetUser.lastSeen;
        if (diff < 2 * 60 * 1000) setContactStatus('Online');
        else setContactStatus('Offline');
    } else setContactStatus('Offline');

    const rawMessages = chatData.messages || [];
    const uniqueMap = new Map();
    rawMessages.forEach(m => {
        const deletedBy = m.deletedBy || [];
        if (!deletedBy.includes(currentUserEmail || '')) uniqueMap.set(m.id, m);
    });
    const deduplicated = Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
    setMessages(deduplicated);
  }, [chatId, currentUserEmail, navigate]);

  useEffect(() => {
    loadChatData();
    const unsubDeleteChat = socketService.on('chat_deleted_globally', (data: any) => {
        if (data.chatId === chatId) navigate('/messages', { replace: true });
    });
    const unsubDeleteMsgs = socketService.on('messages_deleted_globally', (data: any) => {
        if (data.chatId === chatId) loadChatData(true);
    });
    const unsubDb = db.subscribe('chats', () => loadChatData(true));
    
    return () => {
        unsubDeleteChat();
        unsubDeleteMsgs();
        unsubDb();
    };
  }, [chatId, loadChatData, navigate]);

  const handleSendMessage = (text: string) => {
    const userInfo = authService.getCurrentUser();
    const newMessage: ChatMessage = {
        id: Date.now(), text, type: 'sent', contentType: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent', senderEmail: userInfo?.email, senderAvatar: userInfo?.profile?.photoUrl,
        senderName: userInfo?.profile?.nickname || userInfo?.profile?.name || 'Você', deletedBy: []
    };
    chatService.sendMessage(chatId, newMessage);
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

  const filteredMessages = useMemo(() => {
    return messages.filter(m => (m.text || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, searchTerm]);

  // TODO: Implementar
  const handleEdit = () => console.log('Editar', selectedIds);
  const handlePin = () => console.log('Fixar', selectedIds);
  const handleCopy = () => console.log('Copiar', selectedIds);
  const handleForward = () => console.log('Encaminhar', selectedIds);
  const handleReply = () => console.log('Responder', selectedIds);

  return {
    virtuosoRef, messages: filteredMessages, contactName, contactHandle, contactAvatar, contactStatus, isBlocked,
    isSelectionMode, setIsSelectionMode, selectedIds, setSelectedIds, isSearchOpen, setIsSearchOpen, 
    searchTerm, setSearchTerm, zoomedMedia, setZoomedMedia, isMenuModalOpen, setIsMenuModalOpen, 
    isUploading, currentUserEmail, navigate, handleSendMessage, handleToggleSelection, handleStartSelection,
    deleteSelectedMessages, handleEdit, handlePin, handleCopy, handleForward, handleReply
  };
};
