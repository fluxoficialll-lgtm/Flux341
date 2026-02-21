-- 005_create_post_interactions_table.sql: Tabela para registrar interações (likes, views)

CREATE TABLE IF NOT EXISTS post_interactions (
    post_id VARCHAR(255) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- Ex: 'like', 'view'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Garante que um usuário só possa ter uma interação de cada tipo por post
    PRIMARY KEY (post_id, user_id, interaction_type)
);

-- Índice para otimizar a contagem de interações por post
CREATE INDEX IF NOT EXISTS idx_post_interactions_post_id_type ON post_interactions(post_id, interaction_type);
