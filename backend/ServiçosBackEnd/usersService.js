
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const usersService = {
    /**
     * Searches for users based on a query.
     */
    searchUsers: async (query, traceId) => {
        LogDeOperacoes.log('TENTATIVA_BUSCA_USUARIO', { query }, traceId);
        try {
            const users = await userRepositorio.search(query);
            LogDeOperacoes.log('SUCESSO_BUSCA_USUARIO', { query, resultsCount: users.length }, traceId);
            return users;
        } catch (e) {
            LogDeOperacoes.error('FALHA_BUSCA_USUARIO', { query, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Retrieves a user for update purposes.
     */
    getUserForUpdate: async (email, traceId) => {
        LogDeOperacoes.log('TENTATIVA_GET_USUARIO_PARA_UPDATE', { email }, traceId);
        try {
            const user = await userRepositorio.findByEmail(email);
            if (user) {
                LogDeOperacoes.log('SUCESSO_GET_USUARIO_PARA_UPDATE', { userId: user.id, email }, traceId);
                return user;
            }
            LogDeOperacoes.warn('GET_USUARIO_PARA_UPDATE_NAO_ENCONTRADO', { email }, traceId);
            return null; // Return null when not found
        } catch (e) {
            LogDeOperacoes.error('FALHA_GET_USUARIO_PARA_UPDATE', { email, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Updates a user's information.
     */
    updateUser: async (email, updates, traceId) => {
        LogDeOperacoes.log('TENTATIVA_ATUALIZACAO_USUARIO', { email, fields: Object.keys(updates) }, traceId);
        try {
            const updatedUser = await userRepositorio.update(email, updates);
            if (updatedUser) {
                LogDeOperacoes.log('SUCESSO_ATUALIZACAO_USUARIO', { userId: updatedUser.id, email, fields: Object.keys(updates) }, traceId);
                return updatedUser;
            }
            LogDeOperacoes.warn('ATUALIZACAO_USUARIO_NAO_ENCONTRADO', { email }, traceId);
            return null; // Return null when not found
        } catch (e) {
            LogDeOperacoes.error('FALHA_ATUALIZACAO_USUARIO', { email, error: e }, traceId);
            throw e;
        }
    }
};
