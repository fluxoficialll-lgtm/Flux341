CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES content(id), -- Para respostas/remixes
    body TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'published', -- ex: published, draft, archived
    visibility VARCHAR(20) DEFAULT 'public', -- ex: public, unlisted, private
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar buscas comuns
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_parent_id ON content(parent_id);

-- Trigger para atualizar 'updated_at' automaticamente
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_content_updated_at ON content;
CREATE TRIGGER set_content_updated_at
BEFORE UPDATE ON content
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();
