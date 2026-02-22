-- 016_create_transactions_table.sql: Tabela para armazenar todas as transações financeiras
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('sale', 'withdrawal', 'refund', 'fee', 'adjustment', 'payout');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'disputed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_provider') THEN
        CREATE TYPE payment_provider AS ENUM ('stripe', 'paypal', 'syncpay', 'manual');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    -- O usuário associado a esta transação (vendedor em uma venda, usuário em um saque)
    user_id UUID NOT NULL REFERENCES users(id),
    -- Entidade relacionada, como um grupo, anúncio ou item do marketplace
    related_entity_id UUID,
    -- Tipo da entidade relacionada
    related_entity_type VARCHAR(100),

    -- Detalhes financeiros (em centavos)
    gross_amount BIGINT NOT NULL,          -- Valor bruto da transação
    platform_fee BIGINT NOT NULL,         -- Taxa da plataforma
    provider_fee BIGINT NOT NULL,         -- Taxa do provedor de pagamento
    net_amount BIGINT NOT NULL,            -- Valor líquido (gross_amount - platform_fee - provider_fee)
    currency VARCHAR(10) NOT NULL DEFAULT 'BRL',

    -- Tipos e status
    type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    
    -- Informações do Provedor de Pagamento
    provider payment_provider NOT NULL,
    provider_transaction_id VARCHAR(255) UNIQUE NOT NULL,

    -- Metadados adicionais
    metadata JSONB, -- Para armazenar dados como e-mail do comprador, método de pagamento, etc.

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para consultas comuns
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_related_entity ON transactions(related_entity_id, related_entity_type);
