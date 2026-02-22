
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const rankingService = {
    /**
     * Retorna um ranking dos usuários com mais seguidores.
     */
    getFollowerRanking: async ({ limit = 10 }, traceId) => {
        LogDeOperacoes.log('TENTATIVA_GET_RANKING_SEGUIDORES', { limit }, traceId);
        try {
            const ranking = await userRepositorio.getFollowerRanking({ limit });
            LogDeOperacoes.log('SUCESSO_GET_RANKING_SEGUIDORES', { limit, count: ranking.length }, traceId);
            return ranking;
        } catch (e) {
            LogDeOperacoes.error('FALHA_GET_RANKING_SEGUIDORES', { limit, error: e }, traceId);
            // Lançamos o erro para ser tratado pelo controlador
            throw new Error('Failed to fetch ranking');
        }
    }
};
