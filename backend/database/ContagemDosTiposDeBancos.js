
import pg from 'pg';
import dotenv from 'dotenv';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

dotenv.config();

const { Pool } = pg;

// A função agora é exportada para poder ser usada em outros módulos
export const contarBancosDeDados = async () => {
    LogDeOperacoes.log('DB_COUNT_START', { message: 'Iniciando script para contagem de bancos de dados...' });

    const config = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres', // Conecta-se ao banco de dados 'postgres' para obter a lista de outros bancos
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 5000,
    };

    const pool = new Pool(config);

    try {
        const client = await pool.connect();
        try {
            const res = await client.query(`
                SELECT datname FROM pg_database
                WHERE datistemplate = false AND datname <> \'postgres\';
            `);
            
            const numeroDeBancos = res.rowCount;
            
            LogDeOperacoes.info('DB_COUNT_SUCCESS', { 
                count: numeroDeBancos,
                message: `📊 Quantidade de tipos de bancos identificados = ${numeroDeBancos}`
            });

        } finally {
            client.release();
        }
    } catch (error) {
        const errorMessage = `❌ Erro ao tentar contar os bancos de dados: ${error.message}\n💡 DICA: Verifique se as variáveis de ambiente (DB_USER, DB_PASSWORD, etc.) estão corretas no seu arquivo .env ou se o serviço do banco de dados está rodando.`;
        LogDeOperacoes.error('DB_COUNT_FAILURE', {
            message: errorMessage,
            errorDetails: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            }
        });
    } finally {
        await pool.end();
        LogDeOperacoes.log('DB_COUNT_END', { message: 'Script finalizado.' });
    }
};
