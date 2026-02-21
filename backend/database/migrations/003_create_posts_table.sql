-- 003_create_posts_table.sql: Tabela para armazenar as publicações (posts)

CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(255) PRIMARY KEY,
    author_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE, -- Para respostas/threads
    content TEXT NOT NULL,
    media_url VARCHAR(255), -- Para imagens ou vídeos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para otimizar a busca de posts por autor
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
-- Índice para otimizar a busca de respostas
CREATE INDEX IF NOT EXISTS idx_posts_parent_post_id ON posts(parent_post_id);
