
import { auditoriaService } from '../ServiçosBackEnd/auditoriaService.js';

const auditoriaControle = {
    /**
     * @description Inspeciona o status dos bancos de dados PostgreSQL.
     * @param {object} req - O objeto de requisição do Express.
     * @param {object} res - O objeto de resposta do Express.
     */
    inspectDatabases: async (req, res) => {
        try {
            const report = await auditoriaService.inspectDatabases();
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default auditoriaControle;
