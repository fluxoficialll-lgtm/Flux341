
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marketplaceService } from '../ServiçosFrontend/ServiçoDeMarketplace/marketplaceService.js';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { db } from '@/database';
import { MarketplaceItem, Comment as CommentType, ChatMessage } from '../types';

export const useProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [questions, setQuestions] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);
  const [zoomedMedia, setZoomedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);

  const currentUser = authService.getCurrentUser();

  const loadData = useCallback(() => {
    if (id) {
      const foundItem = marketplaceService.getItemById(id);
      if (foundItem) {
        setItem(foundItem);
        setQuestions(foundItem.comments || []);
        setIsSeller(currentUser?.email === foundItem.sellerId || currentUser?.id === foundItem.sellerId);
      }
    }
    setLoading(false);
  }, [id, currentUser]);

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('marketplace', loadData);
    return () => unsub();
  }, [loadData]);

  const handleChat = useCallback(() => {
    if (!currentUser || !item || isSeller) return;
    try {
      const chatId = chatService.getPrivateChatId(currentUser.email, item.sellerId);
      const contextMsg: ChatMessage = {
        id: Date.now(),
        text: `Olá! Tenho interesse neste produto.`,
        type: 'sent',
        contentType: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        senderEmail: currentUser.email,
        senderAvatar: currentUser.profile?.photoUrl,
        senderName: currentUser.profile?.name || 'Comprador',
        product: { id: item.id, title: item.title, price: item.price, image: item.image },
      };
      chatService.sendMessage(chatId, contextMsg);
      navigate(`/chat/${chatId}`);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, item, isSeller, navigate]);

  const handleSendQuestion = useCallback(() => {
    if (!commentText.trim() || !item || !currentUser) return;
    if (replyingTo) {
      const success = marketplaceService.addReply(item.id, replyingTo.id, commentText, currentUser);
      if (success) setReplyingTo(null);
    } else {
      marketplaceService.addComment(item.id, commentText, currentUser);
    }
    setCommentText('');
  }, [commentText, item, currentUser, replyingTo]);

  const handleDeleteQuestion = useCallback(async (commentId: string) => {
    if (item) {
      await marketplaceService.deleteComment(item.id, commentId);
    }
  }, [item]);

  const handleLikeQuestion = useCallback((commentId: string) => {
    if (item) marketplaceService.toggleCommentLike(item.id, commentId);
  }, [item]);

  const handleDeleteItem = useCallback(async () => {
    if (id) {
      marketplaceService.deleteItem(id);
      navigate('/marketplace', { replace: true });
    }
  }, [id, navigate]);

  const navigateToStore = useCallback(() => {
    if (item) navigate(`/user/${item.sellerName}`, { state: { activeTab: 'products' } });
  }, [item, navigate]);

  const mediaItems = useMemo(() => {
    if (!item) return [];
    const media: { type: 'image' | 'video'; url: string }[] = [];
    if (item.video) media.push({ type: 'video', url: item.video });
    if (item.image) media.push({ type: 'image', url: item.image });
    if (item.images) media.push(...item.images.map(url => ({ type: 'image' as const, url })));
    return media.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
  }, [item]);

  return {
    item, loading, isSeller, questions, commentText, setCommentText, isCommentModalOpen, setIsCommentModalOpen,
    replyingTo, setReplyingTo, zoomedMedia, setZoomedMedia, currentUser,
    handleChat, handleSendQuestion, handleDeleteQuestion, handleLikeQuestion, handleDeleteItem,
    navigateToStore, mediaItems
  };
};
