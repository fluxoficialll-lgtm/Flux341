
import { groupsService } from '../ServiçosBackEnd/groupsService.js';

const groupsControle = {
    // Listar todos os grupos
    listGroups: async (req, res) => {
        const { limit } = req.query;
        try {
            const groups = await groupsService.listGroups(Number(limit) || 100, req.traceId);
            res.json({ data: groups });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Ranking de grupos por volume de membros
    getGroupRanking: async (req, res) => {
        const { type, limit } = req.query;
        try {
            const groups = await groupsService.getGroupRanking(type || 'public', Number(limit) || 100, req.traceId);
            res.json({ data: groups });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Obter detalhes de um grupo específico
    getGroupById: async (req, res) => {
        const { id } = req.params;
        try {
            const group = await groupsService.getGroupById(id, req.traceId);
            if (!group) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }
            res.json({ group });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Criar um novo grupo
    createGroup: async (req, res) => {
        try {
            const newGroup = await groupsService.createGroup(req.body, req.traceId);
            res.status(201).json({ success: true, group: newGroup });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Atualizar um grupo existente
    updateGroup: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedGroup = await groupsService.updateGroup(id, req.body, req.traceId);
            res.json({ success: true, group: updatedGroup });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Deletar um grupo
    deleteGroup: async (req, res) => {
        const { id } = req.params;
        try {
            await groupsService.deleteGroup(id, req.traceId);
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default groupsControle;
