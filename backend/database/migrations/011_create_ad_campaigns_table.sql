-- 011_create_ad_campaigns_table.sql: Tabela para armazenar campanhas de anúncios

CREATE TABLE IF NOT EXISTS ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    -- Ex: 'active', 'paused', 'ended', 'draft'
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    -- Orçamento total em centavos para evitar problemas com ponto flutuante
    total_budget BIGINT NOT NULL DEFAULT 0,
    -- Orçamento restante em centavos
    remaining_budget BIGINT NOT NULL DEFAULT 0,
    -- JSON para armazenar os criativos do anúncio (imagens, texto, links)
    creatives JSONB,
    -- JSON para as configurações de segmentação (público, localização, etc.)
    targeting JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
);

-- Índice para buscar rapidamente as campanhas de um usuário
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_owner_id ON ad_campaigns(owner_id);
-- Índice para buscar campanhas por status
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
