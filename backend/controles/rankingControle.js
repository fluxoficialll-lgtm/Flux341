
import { rankingService } from '../ServiçosBackEnd/rankingService.js';

const rankingControle = {
    /**
     * Retorna um ranking dos usuários com mais seguidores.
     */
    getFollowerRanking: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 10;
            const ranking = await rankingService.getFollowerRanking({ limit }, req.traceId);
            res.json(ranking);
        } catch (e) {
            // O erro já foi logado no serviço
            res.status(500).json({ error: e.message });
        }
    }
};

export default rankingControle;
