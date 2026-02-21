-- 009_create_conversation_members_table.sql: Tabela para associar usuários a conversas

CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id VARCHAR(255) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Data em que o usuário entrou na conversa
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Data até a qual o usuário viu as mensagens. Útil para notificações de "não lidas".
    last_seen_at TIMESTAMP WITH TIME ZONE,

    -- Um usuário só pode fazer parte de uma conversa uma vez
    PRIMARY KEY (conversation_id, user_id)
);

-- Índice para buscar rapidamente as conversas de um usuário
CREATE INDEX IF NOT EXISTS idx_conversation_members_user_id ON conversation_members(user_id);
