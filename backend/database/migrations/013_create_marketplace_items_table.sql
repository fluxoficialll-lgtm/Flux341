-- 013_create_marketplace_items_table.sql: Tabela para armazenar itens do marketplace
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_condition') THEN
        CREATE TYPE item_condition AS ENUM ('new', 'used_like_new', 'used_good', 'used_fair');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_status') THEN
        CREATE TYPE item_status AS ENUM ('available', 'sold', 'delisted');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    -- Preço em centavos para precisão financeira
    price_in_cents BIGINT NOT NULL,
    category VARCHAR(100),
    condition item_condition NOT NULL,
    status item_status NOT NULL DEFAULT 'available',
    -- Armazena um array de URLs de imagem
    images JSONB,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar buscas comuns
CREATE INDEX IF NOT EXISTS idx_marketplace_items_seller_id ON marketplace_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_status ON marketplace_items(status);
-- Índice geoespacial seria ideal para buscas por localização, mas um índice de texto já ajuda
CREATE INDEX IF NOT EXISTS idx_marketplace_items_location ON marketplace_items(location);
