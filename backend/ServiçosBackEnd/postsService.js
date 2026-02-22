
import { postRepositorio } from '../GerenciadoresDeDados/post.repositorio.js';
import { interactionRepositorio } from '../GerenciadoresDeDados/interaction.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const postsService = {
    listPosts: async ({ limit = 50, cursor }, traceId) => {
        LogDeOperacoes.log('TENTATIVA_LISTAR_POSTS', { limit, fromCursor: cursor }, traceId);
        try {
            const posts = await postRepositorio.list(Number(limit), cursor);
            let nextCursor = null;
            if (posts.length > 0) {
                nextCursor = posts[posts.length - 1].createdAt.toISOString();
            }
            return { data: posts, nextCursor };
        } catch (e) {
            LogDeOperacoes.error('FALHA_LISTAR_POSTS', { error: e }, traceId);
            throw e;
        }
    },

    createPost: async (postData, traceId) => {
        const { id, authorId } = postData;
        LogDeOperacoes.log('TENTATIVA_CRIACAO_POST', { postId: id, authorId }, traceId);
        try {
            if (!id || !authorId) {
                const error = new Error("ID e authorId são obrigatórios");
                error.statusCode = 400;
                throw error;
            }
            await postRepositorio.create(postData);
            LogDeOperacoes.log('SUCESSO_CRIACAO_POST', { postId: id, authorId }, traceId);
            return { success: true };
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIACAO_POST', { postId: id, authorId, error: e }, traceId);
            throw e;
        }
    },

    interactWithPost: async (postId, { type, userId, action }, traceId) => {
        LogDeOperacoes.log('TENTATIVA_INTERACAO_POST', { postId, userId, type, action }, traceId);
        try {
            if (!userId || !type) {
                const error = new Error("userId e type são obrigatórios");
                error.statusCode = 400;
                throw error;
            }

            let success = false;
            let message = "Interação ignorada (duplicada ou inexistente)";

            if (action === 'remove' && type === 'like') {
                success = await interactionRepositorio.removeInteraction(postId, userId, type);
                if (success) message = "Interação removida com sucesso";
            } else if (type === 'like') {
                success = await interactionRepositorio.recordUniqueInteraction(postId, userId, type);
                 if (success) message = "Interação registrada com sucesso";
            }

            LogDeOperacoes.log('SUCESSO_INTERACAO_POST', { postId, userId, type, action, processed: success }, traceId);
            return { success, message };
        } catch (e) {
            LogDeOperacoes.error('FALHA_INTERACAO_POST', { postId, userId, type, error: e }, traceId);
            throw e;
        }
    },

    addComment: async (postId, comment, traceId) => {
        LogDeOperacoes.log('TENTATIVA_ADICIONAR_COMENTARIO', { postId, authorId: comment?.authorId }, traceId);
        try {
            if (!comment || !comment.authorId) {
                const error = new Error("Objeto de comentário com authorId é obrigatório");
                error.statusCode = 400;
                throw error;
            }

            const newComment = await postRepositorio.addComment(postId, comment);
            LogDeOperacoes.log('SUCESSO_ADICIONAR_COMENTARIO', { postId, commentId: newComment.id, authorId: newComment.authorId }, traceId);
            return { success: true, comment: newComment };
        } catch (e) {
            LogDeOperacoes.error('FALHA_ADICIONAR_COMENTARIO', { postId, error: e }, traceId);
            throw e;
        }
    },

    deletePost: async (postId, userId, traceId) => {
        const initiatedBy = userId || 'unknown';
        LogDeOperacoes.log('TENTATIVA_DELETAR_POST', { postId, initiatedBy }, traceId);
        try {
            await postRepositorio.delete(postId);
            LogDeOperacoes.log('SUCESSO_DELETAR_POST', { postId, initiatedBy }, traceId);
            return { success: true };
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_POST', { postId, initiatedBy, error: e }, traceId);
            throw e;
        }
    }
};
