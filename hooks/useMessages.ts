
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { notificationService } from '../ServiçosFrontend/ServiçoDeNotificação/notificationService.js';
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';
import { Contact } from '../types'; // Assuming Contact type is moved to types.ts

const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return "Offline";
    const diff = Date.now() - timestamp;
    if (diff < 2 * 60 * 1000) return "online";
    const date = new Date(timestamp);
    return `Visto por último às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const useMessages = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const [unreadMsgs, setUnreadMsgs] = useState(0);

    const loadChats = useCallback(() => {
        const rawUserEmail = authService.getCurrentUserEmail();
        if (!rawUserEmail) return;
        const currentUserEmail = rawUserEmail.toLowerCase();
        const rawChats = chatService.getAllChats();

        const formatted: Contact[] = Object.values(rawChats).map((chat): Contact | null => {
            const chatIdStr = chat.id.toString().toLowerCase();
            if (!chatIdStr.includes('@') || !chatIdStr.includes(currentUserEmail)) return null;

            const unreadCount = chat.messages.filter(m => {
                const sender = (m.senderEmail || m.senderId || '').toLowerCase();
                return sender !== currentUserEmail && m.status !== 'read';
            }).length;

            const lastMsg = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
            if (!lastMsg) return null;

            const sender = lastMsg.senderEmail?.toLowerCase() || lastMsg.senderId?.toLowerCase();
            const isMe = sender === currentUserEmail;
            const previewText = (isMe ? 'Você: ' : '') + (lastMsg.contentType === 'text' ? lastMsg.text : 'Mídia');

            const parts = chatIdStr.split('_');
            const otherEmail = parts.find(p => p.toLowerCase() !== currentUserEmail);

            let displayName = chat.contactName;
            let handle = '';
            let avatarUrl = undefined;
            let targetUser = undefined;

            if (otherEmail) {
                targetUser = Object.values(servicoDeSimulacao.users.getAll()).find(u => u.email.toLowerCase() === otherEmail.toLowerCase());
                if (targetUser) {
                    displayName = targetUser.profile?.nickname || targetUser.profile?.name || 'Usuário';
                    handle = targetUser.profile?.name || '';
                    avatarUrl = targetUser.profile?.photoUrl;
                }
            }

            return {
                id: chat.id.toString(),
                name: displayName,
                handle: handle,
                avatar: avatarUrl,
                lastMessage: previewText,
                lastMessageTime: lastMsg.id,
                time: lastMsg.timestamp,
                status: formatLastSeen(targetUser?.lastSeen),
                isOnline: formatLastSeen(targetUser?.lastSeen) === 'online',
                unreadCount: unreadCount
            };
        }).filter((c): c is Contact => c !== null).sort((a, b) => b.lastMessageTime - a.lastMessageTime);

        setContacts(formatted);
    }, []);

    useEffect(() => {
        loadChats();
        const unsubscribeChats = servicoDeSimulacao.subscribe('chats', loadChats);
        const unsubscribeUsers = servicoDeSimulacao.subscribe('users', loadChats);
        return () => { unsubscribeChats(); unsubscribeUsers(); };
    }, [loadChats]);

    useEffect(() => {
        const updateCounts = () => {
            setUnreadNotifs(notificationService.getUnreadCount());
            setUnreadMsgs(chatService.getUnreadCount());
        };
        updateCounts();
        const unsubNotif = servicoDeSimulacao.subscribe('notifications', updateCounts);
        const unsubChat = servicoDeSimulacao.subscribe('chats', updateCounts);
        return () => { unsubNotif(); unsubChat(); };
    }, []);

    const handleMarkAllRead = () => {
        chatService.markAllAsRead();
        loadChats(); // Recarregar para atualizar a UI
    };
    
    const handleClearSelected = () => {
        if (window.confirm(`Tem certeza que deseja apagar ${selectedIds.length} conversa(s)?`)) {
            // chatService.deleteChats(selectedIds); // This function needs to be created in chatService
            console.log("Implement chat deletion for", selectedIds);
            setSelectedIds([]);
            setIsSelectionMode(false);
        }
    };

    const handleContactClick = (contact: Contact) => {
        if (isSelectionMode) {
            setSelectedIds(prev =>
                prev.includes(contact.id)
                    ? prev.filter(i => i !== contact.id)
                    : [...prev, contact.id]
            );
        } else {
            navigate(`/chat/${contact.id}`);
        }
    };

    const handleProfileNavigate = (e: React.MouseEvent, handle: string) => {
        e.stopPropagation();
        if (handle) navigate(`/user/${handle.replace('@', '')}`);
    };
    
    const closeMenuAndEnterSelection = () => {
        setIsMenuModalOpen(false);
        setIsSelectionMode(true);
    }

    return {
        contacts,
        isMenuModalOpen,
        setIsMenuModalOpen,
        isSelectionMode,
        setIsSelectionMode,
        selectedIds,
        setSelectedIds,
        unreadNotifs,
        unreadMsgs,
        handleMarkAllRead,
        handleContactClick,
        handleProfileNavigate,
        handleClearSelected,
        closeMenuAndEnterSelection
    };
};
