
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import { pool } from '../backend/database/pool.js';
import { ambienteAtual } from '../backend/config/ambiente.js';

const MIGRATIONS_DIR = path.join(process.cwd(), 'backend', 'database', 'migrations');

const applyMigration = async (client, fileName) => {
    console.log(`- Aplicando migração: ${fileName}...`);
    const filePath = path.join(MIGRATIONS_DIR, fileName);
    try {
        const sql = await fs.readFile(filePath, 'utf-8');
        // Executa todo o conteúdo do arquivo SQL
        await client.query(sql);
        console.log(`  ✅ Sucesso.`);
    } catch (error) {
        console.error(`  ❌ Erro ao aplicar ${fileName}:`, error.message);
        // Propaga o erro para acionar o rollback da transação.
        throw error;
    }
};

const run = async () => {
    console.log(`🚀 Iniciando aplicador de migrações no ambiente: ${ambienteAtual}`);
    
    const client = await pool.connect();

    try {
        // Lê todos os arquivos do diretório de migrações e os ordena.
        const allFiles = await fs.readdir(MIGRATIONS_DIR);
        const migrationFiles = allFiles.filter(file => file.endsWith('.sql')).sort();

        if (migrationFiles.length === 0) {
            console.log('🤷 Nenhuma migração encontrada para aplicar. Encerrando.');
            return;
        }

        console.log(`Encontradas ${migrationFiles.length} migrações para aplicar.`);

        // Inicia uma transação. Se qualquer migração falhar, todas serão revertidas.
        await client.query('BEGIN');
        console.log('📦 Transação iniciada.');

        for (const fileName of migrationFiles) {
            await applyMigration(client, fileName);
        }

        // Se tudo correu bem, confirma a transação.
        await client.query('COMMIT');
        console.log('🎉 Transação confirmada. Todas as migrações foram aplicadas com sucesso!');

    } catch (error) {
        // Se algo deu errado, reverte a transação.
        console.error('🔥 Ocorreu um erro durante a migração. Revertendo a transação...');
        await client.query('ROLLBACK');
        console.error('⏪ Transação revertida. Nenhuma alteração foi feita no banco de dados.');
    } finally {
        // Libera o cliente de volta para o pool e encerra a conexão.
        client.release();
        await pool.end();
        console.log('🔌 Conexão com o banco de dados encerrada.');
    }
};

run();
