
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Carrega as variáveis de ambiente do arquivo .env. Isso garante que
// o DATABASE_URL esteja disponível para o módulo do pool.
dotenv.config();

// As importações que dependem das variáveis de ambiente são feitas dinamicamente
// para garantir que o dotenv.config() já tenha sido executado.
const [{ pool }, { ambienteAtual }] = await Promise.all([
    import('../backend/database/pool.js'),
    import('../backend/config/ambiente.js')
]);

// Analisador SQL simples para encontrar definições de tabela e coluna
const parseSql = (sqlContent) => {
    const tables = {};
    const createTableRegex = /CREATE TABLE (\w+) \(([\s\S]+?)\);/g;
    let match;
    while ((match = createTableRegex.exec(sqlContent)) !== null) {
        const tableName = match[1];
        const columnsPart = match[2];
        const columns = columnsPart.split(',').map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.toLowerCase().startsWith('primary key') || trimmedLine.toLowerCase().startsWith('foreign key') || trimmedLine.toLowerCase().startsWith('constraint')) {
                return null;
            }
            return trimmedLine.split(/\s+/)[0].replace(/"/g, '');
        }).filter(Boolean);
        tables[tableName] = columns;
    }
    return tables;
};

const getExpectedSchema = async () => {
    const migrationsDir = path.join(process.cwd(), 'backend', 'database', 'migrations');
    const files = await fs.readdir(migrationsDir);
    let expectedSchema = {};
    for (const file of files) {
        if (file.endsWith('.sql')) {
            const filePath = path.join(migrationsDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const schemaFromFile = parseSql(content);
            expectedSchema = { ...expectedSchema, ...schemaFromFile };
        }
    }
    return expectedSchema;
};

const getActualSchema = async () => {
    const client = await pool.connect();
    try {
        const tablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        const actualSchema = {};
        for (const table of tablesRes.rows) {
            const tableName = table.table_name;
            const columnsRes = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' AND table_name = $1
            `, [tableName]);
            actualSchema[tableName] = columnsRes.rows.map(row => row.column_name);
        }
        return actualSchema;
    } finally {
        client.release();
    }
};

const compareSchemas = (expected, actual) => {
    const issues = [];
    for (const tableName in expected) {
        if (!actual[tableName]) {
            issues.push(`Tabela ausente: ${tableName}`);
            continue;
        }
        for (const columnName of expected[tableName]) {
            if (!actual[tableName].includes(columnName)) {
                issues.push(`Coluna ausente na tabela ${tableName}: ${columnName}`);
            }
        }
    }
    return issues;
};

const run = async () => {
    try {
        console.log(`🚀 Iniciando auditor de estrutura no ambiente: ${ambienteAtual}`);

        console.log('Analizando o schema esperado a partir dos arquivos de migração...');
        const expectedSchema = await getExpectedSchema();
        
        console.log('Consultando o schema atual do banco de dados...');
        const actualSchema = await getActualSchema();

        console.log('Comparando os schemas...');
        const issues = compareSchemas(expectedSchema, actualSchema);

        if (issues.length > 0) {
            console.error('❌ Foram encontrados problemas de integridade no schema:');
            issues.forEach(issue => console.error(`- ${issue}`));
        } else {
            console.log('✅ Nenhum problema de integridade encontrado. O schema do banco de dados está sincronizado com as migrações.');
        }
    } catch (error) {
        console.error('Ocorreu um erro ao verificar a integridade do schema:', error);
    } finally {
        await pool.end();
    }
};

run();
