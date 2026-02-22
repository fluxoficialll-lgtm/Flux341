
import { groupRepositorio } from '../GerenciadoresDeDados/group.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const groupsService = {
    /**
     * Lists all groups with an optional limit.
     */
    listGroups: async (limit, traceId) => {
        LogDeOperacoes.log('TENTATIVA_LISTAR_GRUPOS', { limit }, traceId);
        try {
            const groups = await groupRepositorio.list(limit);
            return groups;
        } catch (e) {
            LogDeOperacoes.error('FALHA_LISTAR_GRUPOS', { error: e }, traceId);
            throw e;
        }
    },

    /**
     * Ranks groups by member volume.
     */
    getGroupRanking: async (type, limit, traceId) => {
        LogDeOperacoes.log('TENTATIVA_RANKING_GRUPOS', { type, limit }, traceId);
        try {
            const groups = await groupRepositorio.getGroupsByMemberVolume(type, limit);
            return groups;
        } catch (e) {
            LogDeOperacoes.error('FALHA_RANKING_GRUPOS', { error: e }, traceId);
            throw e;
        }
    },

    /**
     * Gets a specific group by its ID.
     */
    getGroupById: async (id, traceId) => {
        LogDeOperacoes.log('TENTATIVA_GET_GRUPO', { groupId: id }, traceId);
        try {
            const group = await groupRepositorio.findById(id);
            if (!group) {
                LogDeOperacoes.warn('GET_GRUPO_NAO_ENCONTRADO', { groupId: id }, traceId);
            }
            return group;
        } catch (e) {
            LogDeOperacoes.error('FALHA_GET_GRUPO', { groupId: id, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Creates a new group.
     */
    createGroup: async (groupData, traceId) => {
        const { creatorId } = groupData;
        LogDeOperacoes.log('TENTATIVA_CRIAR_GRUPO', { creatorId }, traceId);
        try {
            const newGroup = await groupRepositorio.create(groupData);
            await groupRepositorio.addMember(newGroup.id, creatorId, 'admin');
            LogDeOperacoes.log('SUCESSO_CRIAR_GRUPO', { groupId: newGroup.id, creatorId }, traceId);
            return newGroup;
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIAR_GRUPO', { creatorId, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Updates an existing group.
     */
    updateGroup: async (id, updates, traceId) => {
        LogDeOperacoes.log('TENTATIVA_ATUALIZAR_GRUPO', { groupId: id }, traceId);
        try {
            const updatedGroup = await groupRepositorio.update(id, updates);
            return updatedGroup;
        } catch (e) {
            LogDeOperacoes.error('FALHA_ATUALIZAR_GRUPO', { groupId: id, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Deletes a group.
     */
    deleteGroup: async (id, traceId) => {
        LogDeOperacoes.log('TENTATIVA_DELETAR_GRUPO', { groupId: id }, traceId);
        try {
            await groupRepositorio.delete(id);
            return { success: true };
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_GRUPO', { groupId: id, error: e }, traceId);
            throw e;
        }
    }
};
