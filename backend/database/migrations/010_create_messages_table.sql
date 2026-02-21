-- 010_create_messages_table.sql: Tabela para armazenar as mensagens individuais

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- O conteúdo da mensagem pode ser texto, links para imagens, etc.
    content TEXT NOT NULL,
    -- Rastreia se a mensagem foi editada
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Mantém um registro de quem excluiu a mensagem e quando, sem realmente a apagar
    deleted_by JSONB DEFAULT '[]' -- Armazena IDs de usuários que deletaram a msg para si
);

-- Índice essencial para buscar mensagens de uma conversa em ordem cronológica
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at ON messages(conversation_id, created_at DESC);
-- Índice para buscar mensagens enviadas por um usuário específico
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
