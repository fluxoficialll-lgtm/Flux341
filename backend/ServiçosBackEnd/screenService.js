
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';
import { contentRepositorio } from '../GerenciadoresDeDados/content.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const screenService = {
    /**
     * BFF: Agrega dados para a tela "Meu Negócio" do criador.
     */
    getMyBusinessScreen: async (userId, traceId) => {
        LogDeOperacoes.log('BFF_MY_BUSINESS_START', { userId }, traceId);

        if (!userId) {
            const error = new Error("userId is required");
            error.statusCode = 400;
            LogDeOperacoes.warn('BFF_MY_BUSINESS_WARN', { error: error.message }, traceId);
            throw error;
        }

        try {
            const [user, contentStats] = await Promise.all([
                userRepositorio.findById(userId),
                contentRepositorio.getUserContentStats(userId)
            ]);

            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                LogDeOperacoes.warn('BFF_MY_BUSINESS_WARN', { error: error.message, userId }, traceId);
                throw error;
            }

            const dashboard = {
                user: {
                    name: user.name,
                    username: user.username,
                    profilePictureUrl: user.profilePictureUrl
                },
                stats: {
                    followerCount: user.followerCount || 0,
                    totalPosts: contentStats.totalPosts,
                    totalRemixesReceived: contentStats.totalRemixesReceived
                }
            };

            LogDeOperacoes.log('BFF_MY_BUSINESS_SUCCESS', { userId }, traceId);

            return {
                success: true,
                timestamp: Date.now(),
                dashboard
            };

        } catch (e) {
            // Se o erro já tem um statusCode, respeita (ex: 400, 404)
            if (!e.statusCode) {
                 LogDeOperacoes.error('BFF_MY_BUSINESS_ERROR', { error: e.message, stack: e.stack }, traceId);
            }
            // Lança o erro para ser tratado pelo controlador
            throw e; 
        }
    }
};
