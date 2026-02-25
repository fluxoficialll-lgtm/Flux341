
import { pool } from './pool.js'; // Importa o pool centralizado
// import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

/**
 * Conta o número de bancos de dados não-template no cluster.
 * Reutiliza o pool de conexão principal para executar a consulta.
 */
export const contarBancosDeDados = async () => {
    console.log('Iniciando contagem de bancos de dados...');

    try {
        // Usa o pool existente para fazer a consulta.
        // A conexão já está configurada corretamente pelo pool.js.
        const res = await pool.query(`
            SELECT datname FROM pg_database
            WHERE datistemplate = false AND datname <> \'postgres\';
        `);
        
        const numeroDeBancos = res.rowCount;
        
        console.info(`📊 Quantidade de bancos de dados identificados = ${numeroDeBancos}`);

    } catch (error) {
        const errorMessage = `❌ Erro ao tentar contar os bancos de dados: ${error.message}`;
        console.error(errorMessage, error);
    } finally {
        console.log('Contagem de bancos finalizada.');
        // Não precisamos mais de pool.end() aqui, pois o pool é gerenciado centralmente.
    }
};
