
import pg from 'pg';
import { pool } from '../pool.js'; // Importa o pool centralizado
import { LogDeOperacoes } from '../../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';
import { backendConfig } from '../../config/ambiente.js';

const { Client } = pg;

/**
 * Cria uma nova string de conexão para um banco de dados específico, 
 * reutilizando a configuração principal do ambiente.
 * @param {string} dbName - O nome do banco de dados para o qual se conectar.
 * @returns {string} - A nova string de conexão.
 */
const createConnectionString = (dbName) => {
    const connString = process.env.DATABASE_URL;
    if (!connString) {
        throw new Error('DATABASE_URL não está definida no ambiente.');
    }
    const url = new URL(connString);
    url.pathname = `/${dbName}`;
    return url.toString();
};

/**
 * Verifica se um banco de dados contém tabelas definidas pelo usuário.
 * @param {string} dbName - O nome do banco de dados para verificar.
 * @returns {Promise<string>} - O status do banco de dados.
 */
const checkDatabaseStatus = async (dbName) => {
    const connectionString = createConnectionString(dbName);
    const client = new Client({
        connectionString,
        ssl: backendConfig.isProducao ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 5000,
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
            LIMIT 1;
        `);
        return res.rowCount > 0 ? '📚 PostgreSQL — dados existentes.' : '🆕 PostgreSQL — dados inexistentes.';
    } catch (error) {
        // Se a conexão falhar, o banco é considerado inacessível.
        return '🚫 Inacessível';
    } finally {
        await client.end();
    }
};

/**
 * Realiza uma auditoria em todos os bancos de dados PostgreSQL, verificando a conectividade e a presença de tabelas.
 */
const inspectDatabases = async () => {
    LogDeOperacoes.log('DB_AUDIT_START', { message: 'Iniciando auditoria de bancos de dados PostgreSQL.' });

    let databases = [];
    try {
        // 1. Obter a lista de bancos de dados usando o pool central
        const res = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false AND datname <> 'postgres';");
        databases = res.rows;
        LogDeOperacoes.log('DB_AUDIT_DISCOVERY', { count: databases.length, message: `Encontrados ${databases.length} bancos de dados para análise.` });

        // 2. Auditar cada banco de dados em paralelo
        const auditPromises = databases.map(async (db) => {
            const dbName = db.datname;
            const status = await checkDatabaseStatus(dbName);
            if (status === '🚫 Inacessível') {
                LogDeOperacoes.warn('DB_AUDIT_CONNECTION_FAILURE', { database: dbName, status });
            } else {
                LogDeOperacoes.log('DB_AUDIT_STATUS', { database: dbName, status });
            }
        });

        await Promise.all(auditPromises);

    } catch (error) {
        LogDeOperacoes.error('DB_AUDIT_LIST_FAILURE', { 
            message: 'Erro ao obter a lista de bancos de dados para auditoria.',
            error: error.message 
        });
    } finally {
        LogDeOperacoes.log('DB_AUDIT_COMPLETE', { message: 'Auditoria de bancos de dados concluída.' });
    }
};

export const auditorDoPostgreSQL = {
    inspectDatabases
};
