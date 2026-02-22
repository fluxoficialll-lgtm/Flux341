-- 008_create_conversations_table.sql: Tabela para representar conversas (chats)

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    -- 'private' para DMs, 'group' para chats em grupo
    conversation_type VARCHAR(50) NOT NULL,
    -- Se for um chat de grupo, este campo o vincula à tabela de grupos
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Para rastrear a última atividade e ordenar as conversas
    last_message_at TIMESTAMP WITH TIME ZONE
);

-- Índice para buscar conversas de grupo
CREATE INDEX IF NOT EXISTS idx_conversations_group_id ON conversations(group_id);
