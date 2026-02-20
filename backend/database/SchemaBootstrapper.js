
import { query } from './pool.js';

// Importação de todos os schemas
import { usersSchema } from './schemas/users.js';
// ... (outras importações de schema)

export const SchemaBootstrapper = {
    async run() {
        console.log("🔄 DB: Inicializando Motor de Schema e Migração...");
        try {
            await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

            const schemas = [ usersSchema, /* ... outros schemas */ ];
            for (const sql of schemas) {
                try {
                    await query(sql);
                } catch (schemaError) {
                    console.warn(`⚠️ [Bootstrapper] Aviso em schema: ${schemaError.message.substring(0, 60)}...`);
                }
            }

            await this.runMigrations();
            await this.setupTriggers();

            console.log("✅ DB: Estrutura verificada e atualizada.");
        } catch (e) {
            console.error("❌ DB: Falha Crítica no Bootstrapper:", e.message);
            throw e;
        }
    },

    /**
     * Adiciona uma coluna a uma tabela se ela não existir.
     * @private
     * @param {string} tableName - O nome da tabela.
     * @param {string} columnName - O nome da coluna a ser adicionada.
     * @param {string} columnDefinition - A definição completa da coluna (ex: "BOOLEAN DEFAULT FALSE").
     */
    async addColumnIfNotExists(tableName, columnName, columnDefinition) {
        const check = await query(`
            SELECT 1 FROM information_schema.columns 
            WHERE table_name=$1 AND column_name=$2
        `, [tableName, columnName]);

        if (check.rowCount === 0) {
            console.log(`    -> Migrando: Adicionando coluna '${columnName}' a '${tableName}'`);
            await query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
            console.log(`       ...coluna '${columnName}' adicionada com sucesso.`);
        } else {
            // console.log(`    -> Verificado: Coluna '${columnName}' em '${tableName}' já existe.`);
        }
    },

    async runMigrations() {
        console.log("  -> Executando migrações de schema para sincronia...");
        try {
            // ===== Tabela: users =====
            await this.addColumnIfNotExists('users', 'wallet_balance', 'NUMERIC(15,2) DEFAULT 0.00');
            await this.addColumnIfNotExists('users', 'is_banned', 'BOOLEAN DEFAULT FALSE');
            await this.addColumnIfNotExists('users', 'is_profile_completed', 'BOOLEAN DEFAULT FALSE');
            await this.addColumnIfNotExists('users', 'trust_score', 'INTEGER DEFAULT 500');
            await this.addColumnIfNotExists('users', 'strikes', 'INTEGER DEFAULT 0');
            await this.addColumnIfNotExists('users', 'referred_by_id', 'UUID REFERENCES users(id)');

            // Futuras migrações para outras tabelas podem ser adicionadas aqui...
            // Ex: await this.addColumnIfNotExists('groups', 'new_feature_flag', 'BOOLEAN DEFAULT TRUE');

        } catch (e) {
            console.error("    -> ❌ Falha crítica durante a execução de migrações:", e.message);
            throw e; // Lançar o erro aqui é importante para evitar que a aplicação rode com um schema quebrado.
        }
    },

    async setupTriggers() {
        // ... (código dos triggers permanece o mesmo)
    }
};