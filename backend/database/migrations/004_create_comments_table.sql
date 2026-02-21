-- 004_create_comments_table.sql: Tabela para armazenar os comentários dos posts

CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para otimizar a busca de comentários por post
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
