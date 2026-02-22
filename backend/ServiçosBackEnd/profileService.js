
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const profileService = {
    getProfileForEdit: async (userId, traceId) => {
        LogDeOperacoes.log('TENTATIVA_GET_PERFIL_PARA_EDICAO', { userId }, traceId);
        try {
            if (!userId) {
                const error = new Error('Usuário não autenticado.');
                error.statusCode = 401;
                throw error;
            }

            const user = await userRepositorio.findById(userId);
            if (!user) {
                const error = new Error('Usuário não encontrado.');
                error.statusCode = 404;
                throw error;
            }

            LogDeOperacoes.log('SUCESSO_GET_PERFIL_PARA_EDICAO', { userId }, traceId);
            return {
                name: user.name,
                username: user.username,
                bio: user.bio,
                location: user.location,
                website: user.website,
                profilePictureUrl: user.profilePictureUrl,
                coverPhotoUrl: user.coverPhotoUrl
            };
        } catch (error) {
            LogDeOperacoes.error('FALHA_GET_PERFIL_PARA_EDICAO', { userId, error }, traceId);
            throw error;
        }
    },

    getPublicProfile: async (username, requesterId, traceId) => {
        LogDeOperacoes.log('TENTATIVA_GET_PERFIL_PUBLICO', { username, requesterId }, traceId);
        try {
            const user = await userRepositorio.findByHandle(username);
            if (!user) {
                const error = new Error('Usuário não encontrado.');
                error.statusCode = 404;
                throw error;
            }

            LogDeOperacoes.log('SUCESSO_GET_PERFIL_PUBLICO', { username, userId: user.id }, traceId);
            return {
                id: user.id,
                name: user.name,
                username: user.username,
                bio: user.bio,
                location: user.location,
                website: user.website,
                followerCount: user.followerCount || 0,
                followingCount: user.followingCount || 0,
                profilePictureUrl: user.profilePictureUrl,
                coverPhotoUrl: user.coverPhotoUrl,
                createdAt: user.createdAt
            };
        } catch (error) {
            LogDeOperacoes.error('FALHA_GET_PERFIL_PUBLICO', { username, error }, traceId);
            throw error;
        }
    }
};
