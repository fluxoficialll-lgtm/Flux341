
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Post, Comment } from '../types';
import { db } from '@/database';

export const usePostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id;

  const loadData = useCallback(() => {
    if (id) {
      const foundPost = postService.getPostById(id);
      if (foundPost) {
        setPost(foundPost);
        setComments(foundPost.commentsList || []);
      } else {
        navigate('/feed');
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('posts', (updatedPost) => {
        if (updatedPost.id === id) {
            loadData();
        }
    });
    return () => unsub();
  }, [id, loadData]);

  const handleLike = () => {
    if (!post) return;
    const isLiked = !post.liked;
    setPost(p => p ? { ...p, liked: isLiked, likes: p.likes + (isLiked ? 1 : -1) } : null);
    postService.toggleLike(post.id);
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !post || !currentUser) return;
    
    const newCommentOrReply = await postService.addOrReplyComment(post.id, commentText.trim(), replyingTo?.id, currentUser);
    if (newCommentOrReply) {
        const updatedComments = replyingTo 
            ? comments.map(c => c.id === replyingTo.id ? { ...c, replies: [...(c.replies || []), newCommentOrReply] } : c)
            : [...comments, newCommentOrReply];

        setComments(updatedComments);
        setPost(p => p ? { ...p, comments: (p.comments || 0) + 1 } : p);
        setCommentText('');
        setReplyingTo(null);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (!post) return;
    const success = await postService.deleteComment(post.id, commentId);
    if (success) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      setPost(p => p ? { ...p, comments: Math.max(0, (p.comments || 1) - 1) } : p);
    }
  };

  const handleCommentLike = (commentId: string) => {
    if (!post) return;
    setComments(prev => prev.map(c => {
        if (c.id === commentId) {
            const isLiked = !c.likedBy.includes(currentUserId || '');
            return {
                ...c,
                likedBy: isLiked ? [...c.likedBy, currentUserId || ''] : c.likedBy.filter(uid => uid !== currentUserId),
                likes: c.likes + (isLiked ? 1 : -1)
            };
        }
        return c;
    }));
    postService.toggleCommentLike(post.id, commentId);
  };
  
  const handleVote = (optionIndex: number) => {
    if (post && post.pollOptions && post.votedOptionIndex == null) {
        const updatedPost = { ...post };
        updatedPost.pollOptions[optionIndex].votes++;
        updatedPost.votedOptionIndex = optionIndex;
        setPost(updatedPost);
        db.posts.update(updatedPost);
    }
  };

  return {
    post, comments, commentText, setCommentText, replyingTo, setReplyingTo, currentUserId, 
    handleLike, handleSendComment, handleDeleteComment, handleCommentLike, handleVote, navigate
  };
};
