-- 006_create_groups_table.sql: Tabela para armazenar informações sobre os grupos

CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    group_type VARCHAR(50) DEFAULT 'public', -- Ex: 'public', 'private'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para otimizar a busca de grupos por criador
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
-- Índice para otimizar a busca por tipo de grupo
CREATE INDEX IF NOT EXISTS idx_groups_group_type ON groups(group_type);
