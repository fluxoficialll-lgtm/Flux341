
import { reportRepositorio } from '../GerenciadoresDeDados/report.repositorio.js';
import { relationshipRepositorio } from '../GerenciadoresDeDados/relationship.repositorio.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const socialControle = {
    // Endpoint para criar uma denúncia
    createReport: async (req, res) => {
        const reporterId = req.userId;
        const { targetId, targetType, reason } = req.body;

        if (!targetId || !targetType || !reason) {
            return res.status(400).json({ error: "Dados obrigatórios (targetId, targetType, reason) ausentes." });
        }
        LogDeOperacoes.log('TENTATIVA_CRIAR_DENUNCIA', { reporterId, ...req.body }, req.traceId);

        try {
            await reportRepositorio.create({ reporterId, targetId, targetType, reason });
            res.status(202).json({ success: true, message: 'Denúncia recebida.' });
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIAR_DENUNCIA', { reporterId, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Seguir um usuário
    followUser: async (req, res) => {
        const followerId = req.userId;
        const { followingId } = req.body;

        if (!followingId) return res.status(400).json({ error: "ID do usuário a ser seguido (followingId) é obrigatório." });
        LogDeOperacoes.log('TENTATIVA_SEGUIR_USUARIO', { followerId, followingId }, req.traceId);

        try {
            await relationshipRepositorio.follow(followerId, followingId);
            res.json({ success: true, message: `Agora você está seguindo ${followingId}.` });
        } catch (e) {
            LogDeOperacoes.error('FALHA_SEGUIR_USUARIO', { followerId, followingId, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Deixar de seguir um usuário
    unfollowUser: async (req, res) => {
        const followerId = req.userId;
        const { followingId } = req.body;

        if (!followingId) return res.status(400).json({ error: "ID do usuário a ser deixado de seguir (followingId) é obrigatório." });
        LogDeOperacoes.log('TENTATIVA_DEIXAR_DE_SEGUIR_USUARIO', { followerId, followingId }, req.traceId);

        try {
            await relationshipRepositorio.unfollow(followerId, followingId);
            res.json({ success: true, message: `Você deixou de seguir ${followingId}.` });
        } catch (e) {
            LogDeOperacoes.error('FALHA_DEIXAR_DE_SEGUIR_USUARIO', { followerId, followingId, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Listar quem o usuário logado segue
    getFollowing: async (req, res) => {
        const followerId = req.userId;
        try {
            const followingList = await relationshipRepositorio.findFollowing(followerId);
            res.json({ following: followingList });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Listar seguidores de um usuário
    getFollowers: async (req, res) => {
        try {
            const followersList = await relationshipRepositorio.findFollowers(req.params.userId);
            res.json({ followers: followersList });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Obter ranking de top criadores
    getTopCreators: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 10;
            const topCreators = await relationshipRepositorio.getTopCreators(limit);
            res.json({ data: topCreators });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default socialControle;
