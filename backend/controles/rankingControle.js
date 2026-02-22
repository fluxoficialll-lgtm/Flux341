
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';

const rankingControle = {
    /**
     * Retorna um ranking dos usuários com mais seguidores.
     */
    getFollowerRanking: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 10;

            const ranking = await userRepositorio.getFollowerRanking({ limit });

            res.json(ranking);
        } catch (e) {
            console.error(`[Ranking Route Error]: ${e.message}`);
            res.status(500).json({ error: 'Failed to fetch ranking' });
        }
    }
};

export default rankingControle;
