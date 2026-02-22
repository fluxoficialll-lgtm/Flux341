
import { auditorDoPostgreSQL } from '../database/AuditoresDeBancos/index.js';

export const auditoriaService = {
    /**
     * @description Inspeciona o status dos bancos de dados PostgreSQL.
     */
    inspectDatabases: async () => {
        try {
            const report = await auditorDoPostgreSQL.inspectDatabases();
            return report;
        } catch (error) {
            console.error(`Falha ao auditar os bancos de dados: ${error.stack}`);
            throw new Error('Falha ao auditar os bancos de dados.');
        }
    }
};
