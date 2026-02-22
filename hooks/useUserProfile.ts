
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { authService } from '../ServiçosDoFrontend/ServiçosDeAutenticacao/authService';
import { postService } from '../ServiçosDoFrontend/postService';
import { relationshipService } from '../ServiçosDoFrontend/relationshipService';
import { chatService } from '../ServiçosDoFrontend/chatService';
import { marketplaceService } from '../ServiçosDoFrontend/marketplaceService';
import { db } from '@/database';
import { Post, MarketplaceItem, UserProfileData, RelationshipStatus } from '../types';

export const useUserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();

  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userProducts, setUserProducts] = useState<MarketplaceItem[]>([]);
  const [isMe, setIsMe] = useState(false);
  const [targetUserEmail, setTargetUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [relationStatus, setRelationStatus] = useState<RelationshipStatus>('none');
  const [isBlocked, setIsBlocked] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'fotos' | 'reels' | 'products'>('posts');

  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [location.state]);

  const loadProfile = useCallback(async () => {
    const currentUsername = username ? (username.startsWith('@') ? username : `@${username}`) : "@usuario";
    const cleanHandle = currentUsername.replace('@', '').toLowerCase().trim();
    const fallbackEmail = (location.state as any)?.emailFallback;
    const currentUser = authService.getCurrentUser();
    const targetUser = await authService.fetchUserByHandle(cleanHandle, fallbackEmail);

    if (!targetUser) {
      setIsLoading(false);
      return;
    }

    const isSelf = currentUser?.profile?.name === cleanHandle;
    setIsMe(isSelf);
    setTargetUserEmail(targetUser.email);
    setIsPrivate(targetUser.profile?.isPrivate || false);

    if (currentUser?.email) {
      const blockedStatus = chatService.hasBlockingRelationship(currentUser.email, targetUser.email);
      setIsBlocked(blockedStatus);
    }

    const followers = relationshipService.getFollowers(targetUser.profile?.name || '');
    const following = relationshipService.getFollowing(targetUser.id);
    const posts = postService.getUserPosts(targetUser.id).sort((a, b) => b.timestamp - a.timestamp);
    const products = marketplaceService.getItems().filter(i => i.sellerId === targetUser.email || i.sellerId === targetUser.id).sort((a, b) => b.timestamp - a.timestamp);
    
    setUserPosts(posts);
    setUserProducts(products);
    setRelationStatus(relationshipService.isFollowing(`@${targetUser.profile?.name}`));
    
    setUserData({
      username: `@${targetUser.profile?.name}`,
      nickname: targetUser.profile?.nickname || targetUser.profile?.name || 'Usuário',
      avatar: targetUser.profile?.photoUrl,
      bio: targetUser.profile?.bio || 'Sem biografia.',
      stats: { posts: posts.length, followers: followers.length, following: following.length }
    });
    
    setIsLoading(false);
  }, [username, location.state]);

  useEffect(() => {
    loadProfile();
    const subscriptions = ['users', 'relationships', 'posts', 'chats'].map(table => db.subscribe(table, loadProfile));
    return () => subscriptions.forEach(unsub => unsub());
  }, [loadProfile]);

  const handleFollowClick = async () => {
    if (isFollowLoading || !userData) return;
    setIsFollowLoading(true);
    try {
      if (relationStatus === 'following' || relationStatus === 'requested') {
        await relationshipService.unfollowUser(userData.username);
      } else {
        await relationshipService.followUser(userData.username);
      }
    } catch (error) {
      console.error("Failed to update follow status:", error);
    } finally {
      setIsFollowLoading(false);
      loadProfile(); // Recarrega para obter o estado mais recente
    }
  };

  const handleToggleBlock = () => {
    if (userData?.username) {
      chatService.toggleBlockByContactName(userData.username);
      loadProfile(); // Recarrega
    }
  };

  const handleLike = (id: string) => {
    postService.toggleLike(id);
    setUserPosts(prev => prev.map(post => 
      post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post
    ));
  };

  const handleVote = (postId: string, index: number) => {
    setUserPosts(prev => prev.map(p => {
      if (p.id === postId && p.pollOptions && p.votedOptionIndex == null) {
        const newOptions = [...p.pollOptions];
        newOptions[index].votes += 1;
        return { ...p, pollOptions: newOptions, votedOptionIndex: index };
      }
      return p;
    }));
  };

  const handleMessageClick = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.email && targetUserEmail) {
      const chatId = chatService.getPrivateChatId(currentUser.email, targetUserEmail);
      navigate(`/chat/${chatId}`);
    }
  };

  const canMessage = !isMe && (!isPrivate || relationStatus === 'following');
  const isContentVisible = isMe || !isPrivate || relationStatus === 'following';

  return {
    isLoading, isMe, isBlocked, isPrivate, isFollowLoading, userData, userPosts, userProducts,
    activeTab, setActiveTab, relationStatus, canMessage, isContentVisible, targetUserEmail,
    handleFollowClick, handleToggleBlock, handleLike, handleVote, navigate, handleMessageClick
  };
};
