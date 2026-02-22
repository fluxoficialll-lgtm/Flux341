
import { groupRepositorio } from '../GerenciadoresDeDados/group.repositorio.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const groupsControle = {
    // Listar todos os grupos
    listGroups: async (req, res) => {
        const { limit } = req.query;
        LogDeOperacoes.log('TENTATIVA_LISTAR_GRUPOS', { limit: Number(limit) || 100 }, req.traceId);
        try {
            const groups = await groupRepositorio.list(Number(limit) || 100);
            res.json({ data: groups });
        } catch (e) {
            LogDeOperacoes.error('FALHA_LISTAR_GRUPOS', { error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Ranking de grupos por volume de membros
    getGroupRanking: async (req, res) => {
        const { type, limit } = req.query;
        LogDeOperacoes.log('TENTATIVA_RANKING_GRUPOS', { type: type || 'public', limit: Number(limit) || 100 }, req.traceId);
        try {
            const groups = await groupRepositorio.getGroupsByMemberVolume(type || 'public', Number(limit) || 100);
            res.json({ data: groups });
        } catch (e) {
            LogDeOperacoes.error('FALHA_RANKING_GRUPOS', { error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Obter detalhes de um grupo específico
    getGroupById: async (req, res) => {
        const { id } = req.params;
        LogDeOperacoes.log('TENTATIVA_GET_GRUPO', { groupId: id }, req.traceId);
        try {
            const group = await groupRepositorio.findById(id);
            if (!group) {
                LogDeOperacoes.warn('GET_GRUPO_NAO_ENCONTRADO', { groupId: id }, req.traceId);
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }
            res.json({ group });
        } catch (e) {
            LogDeOperacoes.error('FALHA_GET_GRUPO', { groupId: id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Criar um novo grupo
    createGroup: async (req, res) => {
        const { creatorId } = req.body;
        LogDeOperacoes.log('TENTATIVA_CRIAR_GRUPO', { creatorId }, req.traceId);
        try {
            const newGroup = await groupRepositorio.create(req.body);
            // O criador é adicionado como o primeiro membro e administrador
            await groupRepositorio.addMember(newGroup.id, creatorId, 'admin');
            LogDeOperacoes.log('SUCESSO_CRIAR_GRUPO', { groupId: newGroup.id, creatorId }, req.traceId);
            res.status(201).json({ success: true, group: newGroup });
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIAR_GRUPO', { creatorId, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Atualizar um grupo existente
    updateGroup: async (req, res) => {
        const { id } = req.params;
        LogDeOperacoes.log('TENTATIVA_ATUALIZAR_GRUPO', { groupId: id }, req.traceId);
        try {
            const updatedGroup = await groupRepositorio.update(id, req.body);
            res.json({ success: true, group: updatedGroup });
        } catch (e) {
            LogDeOperacoes.error('FALHA_ATUALIZAR_GRUPO', { groupId: id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Deletar um grupo
    deleteGroup: async (req, res) => {
        const { id } = req.params;
        LogDeOperacoes.log('TENTATIVA_DELETAR_GRUPO', { groupId: id }, req.traceId);
        try {
            await groupRepositorio.delete(id);
            res.json({ success: true });
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_GRUPO', { groupId: id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    }
};

export default groupsControle;
