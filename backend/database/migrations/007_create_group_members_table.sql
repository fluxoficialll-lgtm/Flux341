-- 007_create_group_members_table.sql: Tabela para associar usuários a grupos

CREATE TABLE IF NOT EXISTS group_members (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- Ex: 'member', 'admin', 'moderator'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Um usuário só pode se juntar a um grupo uma vez
    PRIMARY KEY (group_id, user_id)
);

-- Índice para buscar rapidamente os grupos de um usuário
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
