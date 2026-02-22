-- 015_create_user_relationships_table.sql: Tabela para as relações de 'seguir' entre usuários

CREATE TABLE IF NOT EXISTS user_relationships (
    -- Quem está seguindo
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Quem está sendo seguido
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Data de quando a relação começou
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Chave primária composta para garantir que um usuário só pode seguir outro uma vez
    PRIMARY KEY (follower_id, following_id)
);

-- Índice para encontrar rapidamente todos os seguidores de um usuário
CREATE INDEX IF NOT EXISTS idx_user_relationships_following_id ON user_relationships(following_id);
-- Índice para encontrar rapidamente todos os usuários que alguém segue
CREATE INDEX IF NOT EXISTS idx_user_relationships_follower_id ON user_relationships(follower_id);
