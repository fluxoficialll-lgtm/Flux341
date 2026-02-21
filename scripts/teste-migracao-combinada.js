
import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../backend/database/pool.js';
import { ambienteAtual } from '../backend/config/ambiente.js';

const combinedSql = `
    -- 001_create_auth_tables.sql
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        handle VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 002_add_profile_fields_to_users.sql
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS cover_photo_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS location VARCHAR(255),
    ADD COLUMN IF NOT EXISTS website VARCHAR(255);

    -- 003_create_posts_table.sql
    CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(255) PRIMARY KEY,
        author_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        parent_post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        media_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_posts_parent_post_id ON posts(parent_post_id);
`;

const run = async () => {
    console.log(`🚀 Iniciando teste de migração combinada no ambiente: ${ambienteAtual}`);
    const client = await pool.connect();

    try {
        console.log('📦 Executando SQL combinado...');
        await client.query(combinedSql);
        console.log('✅ Sucesso! O SQL combinado foi executado sem erros.');
    } catch (error) {
        console.error('🔥 Falha na execução do SQL combinado:', error.message);
    } finally {
        client.release();
        await pool.end();
        console.log('🔌 Conexão com o banco de dados encerrada.');
    }
};

run();
