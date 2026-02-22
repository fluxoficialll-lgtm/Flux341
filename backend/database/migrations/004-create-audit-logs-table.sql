-- Tabela para armazenar logs de auditoria e operacionais estruturados
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trace_id UUID, -- Agrupa todos os logs de uma única requisição
    timestamp TIMESTAMPTZ NOT NULL,
    level VARCHAR(20) NOT NULL,       -- ex: info, warn, error
    service VARCHAR(50),      -- Nome do serviço que gerou o log
    contexto VARCHAR(100) NOT NULL, -- Contexto da operação (ex: INBOUND_REQUEST)
    data JSONB,               -- Dados detalhados do log
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar buscas por trace_id e por tempo
CREATE INDEX IF NOT EXISTS idx_audit_logs_trace_id ON audit_logs(trace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
