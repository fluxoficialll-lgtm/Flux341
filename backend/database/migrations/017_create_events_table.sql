-- 017_create_events_table.sql: Tabela para armazenar eventos para auditoria e processamento assíncrono

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_source_type') THEN
        CREATE TYPE event_source_type AS ENUM ('frontend', 'backend', 'payment_gateway', 'auth_service', 'moderation_service', 'external_api');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status_type') THEN
        CREATE TYPE event_status_type AS ENUM ('received', 'processing', 'completed', 'failed');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS events (
    -- Usando o ID do evento fornecido pelo cliente para idempotência
    id UUID PRIMARY KEY,
    
    -- Detalhes do Evento
    source event_source_type NOT NULL,
    type VARCHAR(255) NOT NULL, -- O tipo específico do evento, ex: 'payment_success'
    payload JSONB NOT NULL, -- Carga de dados do evento
    
    -- Metadados de Processamento
    status event_status_type NOT NULL DEFAULT 'received',
    processing_notes TEXT, -- Notas sobre falhas ou resultados do processamento
    
    -- Timestamps
    client_timestamp TIMESTAMP WITH TIME ZONE NOT NULL, -- Timestamp enviado pelo cliente/origem
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp de quando o evento foi ingerido
);

-- Índices para consultas de status e tipo
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);
