
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente para que a DATABASE_URL esteja disponível imediatamente.
dotenv.config();

export const Ambiente = Object.freeze({
  LOCAL: 'local',
  VERCEL: 'vercel',
  RENDER: 'render',
  FIREBASE: 'firebase',
});

/**
 * Detecta o ambiente de execução com uma lógica de prioridade.
 */
export const identificarAmbiente = () => {

  // 1. Override manual (a mais alta prioridade)
  if (process.env.APP_ENV) {
    return process.env.APP_ENV;
  }

  // 2. Variáveis de ambiente específicas da plataforma
  if (process.env.VERCEL === '1') {
    return Ambiente.VERCEL;
  }

  if (process.env.RENDER === 'true') {
    return Ambiente.RENDER;
  }

  // 3. Detecção baseada na DATABASE_URL (crucial para scripts locais conectando a DBs remotas)
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('.render.com')) {
    return Ambiente.RENDER;
  }

  if (process.env.FIREBASE_CONFIG) {
    return Ambiente.FIREBASE;
  }

  // 4. Fallback para NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'cloud'; // Genérico para produção não identificada
  }

  // 5. Padrão é o ambiente local
  return Ambiente.LOCAL;
};

/**
 * O ambiente atual, determinado uma vez e exportado para consistência.
 */
export const ambienteAtual = identificarAmbiente();

/**
 * Funções de ajuda para verificações rápidas e legíveis.
 */
export const isLocal = ambienteAtual === Ambiente.LOCAL;
export const isVercel = ambienteAtual === Ambiente.VERCEL;
export const isRender = ambienteAtual === Ambiente.RENDER;
export const isFirebase = ambienteAtual === Ambiente.FIREBASE;
