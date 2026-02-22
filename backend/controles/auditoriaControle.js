
import { auditorDoPostgreSQL } from '../database/AuditoresDeBancos/index.js';

const auditoriaControle = {
    /**
     * @description Inspeciona o status dos bancos de dados PostgreSQL.
     * @param {object} req - O objeto de requisição do Express.
     * @param {object} res - O objeto de resposta do Express.
     */
    inspectDatabases: async (req, res) => {
        try {
            const report = await auditorDoPostgreSQL.inspectDatabases();
            res.status(200).json(report);
        } catch (error) {
            console.error(`Falha ao auditar os bancos de dados: ${error.stack}`);
            res.status(500).json({ error: 'Falha ao auditar os bancos de dados.' });
        }
    }
};

export default auditoriaControle;
