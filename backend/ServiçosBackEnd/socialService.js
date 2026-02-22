
import { reportRepositorio } from '../GerenciadoresDeDados/report.repositorio.js';
import { relationshipRepositorio } from '../GerenciadoresDeDados/relationship.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const socialService = {
    createReport: async (reporterId, { targetId, targetType, reason }, traceId) => {
        if (!targetId || !targetType || !reason) {
            const error = new Error("Dados obrigatórios (targetId, targetType, reason) ausentes.");
            error.statusCode = 400;
            throw error;
        }
        LogDeOperacoes.log('TENTATIVA_CRIAR_DENUNCIA', { reporterId, targetId, targetType, reason }, traceId);

        try {
            await reportRepositorio.create({ reporterId, targetId, targetType, reason });
            return { success: true, message: 'Denúncia recebida.' };
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIAR_DENUNCIA', { reporterId, error: e }, traceId);
            throw e;
        }
    },

    followUser: async (followerId, followingId, traceId) => {
        if (!followingId) {
            const error = new Error("ID do usuário a ser seguido (followingId) é obrigatório.");
            error.statusCode = 400;
            throw error;
        }
        LogDeOperacoes.log('TENTATIVA_SEGUIR_USUARIO', { followerId, followingId }, traceId);

        try {
            await relationshipRepositorio.follow(followerId, followingId);
            return { success: true, message: `Agora você está seguindo ${followingId}.` };
        } catch (e) {
            LogDeOperacoes.error('FALHA_SEGUIR_USUARIO', { followerId, followingId, error: e }, traceId);
            throw e;
        }
    },

    unfollowUser: async (followerId, followingId, traceId) => {
        if (!followingId) {
            const error = new Error("ID do usuário a ser deixado de seguir (followingId) é obrigatório.");
            error.statusCode = 400;
            throw error;
        }
        LogDeOperacoes.log('TENTATIVA_DEIXAR_DE_SEGUIR_USUARIO', { followerId, followingId }, traceId);

        try {
            await relationshipRepositorio.unfollow(followerId, followingId);
            return { success: true, message: `Você deixou de seguir ${followingId}.` };
        } catch (e) {
            LogDeOperacoes.error('FALHA_DEIXAR_DE_SEGUIR_USUARIO', { followerId, followingId, error: e }, traceId);
            throw e;
        }
    },

    getFollowing: async (followerId, traceId) => {
        try {
            const followingList = await relationshipRepositorio.findFollowing(followerId);
            return { following: followingList };
        } catch (e) {
            // Adicionar log pode ser útil aqui no futuro
            throw e;
        }
    },

    getFollowers: async (userId, traceId) => {
        try {
            const followersList = await relationshipRepositorio.findFollowers(userId);
            return { followers: followersList };
        } catch (e) {
            // Adicionar log pode ser útil aqui no futuro
            throw e;
        }
    },

    getTopCreators: async (limit = 10, traceId) => {
        try {
            const topCreators = await relationshipRepositorio.getTopCreators(limit);
            return { data: topCreators };
        } catch (e) {
            // Adicionar log pode ser útil aqui no futuro
            throw e;
        }
    }
};
