
import express from 'express';
import auditoriaControle from '../controles/auditoriaControle.js';

const router = express.Router();

/**
 * @swagger
 * /api/auditoria/databases:
 *   get:
 *     summary: Inspeciona o status dos bancos de dados PostgreSQL.
 *     tags: [Auditoria]
 *     responses:
 *       200:
 *         description: Lista e status dos bancos de dados retornados com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/databases', auditoriaControle.inspectDatabases);

export default router;
