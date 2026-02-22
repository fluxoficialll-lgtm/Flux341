-- 014_create_reports_table.sql: Tabela para armazenar denúncias de usuários/conteúdo
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_target_type') THEN
        CREATE TYPE report_target_type AS ENUM ('user', 'post', 'group', 'message', 'marketplace_item', 'comment');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
        CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    -- Quem fez a denúncia
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- O que está sendo denunciado
    target_id UUID NOT NULL,
    -- O tipo de entidade sendo denunciada
    target_type report_target_type NOT NULL,
    -- A razão da denúncia
    reason TEXT NOT NULL,
    -- Status da revisão da denúncia
    status report_status NOT NULL DEFAULT 'pending',
    -- Notas adicionais do revisor
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Índice para buscar todas as denúncias feitas por um usuário
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
-- Índice para buscar denúncias pendentes de um tipo específico
CREATE INDEX IF NOT EXISTS idx_reports_target_type_status ON reports(target_type, status);
