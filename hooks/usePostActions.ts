
import { useState, useCallback } from 'react';
import { Post } from '../types';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService.js';

export const usePostActions = (post: Post) => {
    const [isLiked, setIsLiked] = useState(post.liked);
    const [likesCount, setLikesCount] = useState(post.likes);

    const handleLike = useCallback(async () => {
        const originalIsLiked = isLiked;
        const originalLikesCount = likesCount;
        
        setIsLiked(!originalIsLiked);
        setLikesCount(originalLikesCount + (!originalIsLiked ? 1 : -1));
        
        try {
            // A lógica de interação com a API deve ser robusta
            // e ter acesso a um token de autenticação.
            // await postService.interactWithPost(token, post.id, { type: 'like', action: !originalIsLiked ? 'create' : 'delete' });
        } catch (error) {
            console.error("Falha ao atualizar o like:", error);
            // Reverte a UI em caso de erro na API
            setIsLiked(originalIsLiked);
            setLikesCount(originalLikesCount);
        }
    }, [isLiked, likesCount, post.id]);

    const handleDelete = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Tem certeza de que deseja excluir este post?')) {
            try {
                // A deleção também requer autenticação.
                // await postService.deletePost(token, post.id);
                // Após a deleção, seria ideal remover o post da lista no estado pai.
            } catch (error) {
                console.error("Falha ao excluir o post:", error);
            }
        }
    }, [post.id]);

    // CORREÇÃO: Expondo a função diretamente, e não o objeto de serviço inteiro.
    const formatRelativeTime = postService.formatRelativeTime;

    return {
        isLiked,
        likesCount,
        handleLike,
        handleDelete,
        formatRelativeTime,
    };
};
