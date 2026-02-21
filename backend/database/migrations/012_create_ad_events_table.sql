-- 012_create_ad_events_table.sql: Tabela para registrar eventos de interação com anúncios
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ad_event_type') THEN
        CREATE TYPE ad_event_type AS ENUM ('impression', 'click', 'conversion');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS ad_events (
    id BIGSERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    -- Opcional, nem todos os eventos terão um usuário associado
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    event_type ad_event_type NOT NULL,
    event_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Custo do evento em centavos (ex: custo por clique)
    cost_in_cents BIGINT DEFAULT 0,
    -- Informações adicionais, como de onde o usuário veio
    metadata JSONB
);

-- Índice essencial para analisar a performance de uma campanha
CREATE INDEX IF NOT EXISTS idx_ad_events_campaign_id_event_type ON ad_events(campaign_id, event_type);
-- Índice para analisar o comportamento de um usuário com anúncios
CREATE INDEX IF NOT EXISTS idx_ad_events_user_id ON ad_events(user_id);
