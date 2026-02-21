
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuração de Caminho Robusta para dotenv ---
// Em módulos ES, __dirname não é definido. Esta é a maneira moderna de obtê-lo.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constrói o caminho para a raiz do projeto subindo dois níveis (a partir de /backend/config)
const projectRoot = path.resolve(__dirname, '..', '..');
const envPath = path.join(projectRoot, '.env');

// Carrega o arquivo .env da raiz do projeto
dotenv.config({ path: envPath });

console.log('\n=======================================================');
console.log('=== INICIANDO CONFIGURAÇÃO DE AMBIENTE (BACKEND) ===');
console.log('=======================================================');

export const Ambientes = Object.freeze({ 
  PRODUCAO: 'producao',
  LOCAL: 'local',
});

export const Provedores = Object.freeze({
  RENDER: 'Render',
  VERCEL: 'Vercel',
  OUTRO: 'Outro',
  NENHUM: 'Nenhum',
});

const detectarAmbiente = () => {
  if (process.env.RENDER === 'true') {
    return { ambiente: Ambientes.PRODUCAO, provedor: Provedores.RENDER };
  }
  if (process.env.VERCEL === 'true') {
    return { ambiente: Ambientes.PRODUCAO, provedor: Provedores.VERCEL };
  }
  if (process.env.NODE_ENV === 'production') {
    return { ambiente: Ambientes.PRODUCAO, provedor: Provedores.OUTRO };
  }
  return { ambiente: Ambientes.LOCAL, provedor: Provedores.NENHUM };
};

const { ambiente: ambienteAtual, provedor: provedorAtual } = detectarAmbiente();
const isProducao = ambienteAtual === Ambientes.PRODUCAO;
export const isLocal = ambienteAtual === Ambientes.LOCAL;

console.log(`[INFO] Ambiente detectado: ${ambienteAtual.toUpperCase()}`);
if (isProducao) {
  console.log(`[INFO] Provedor de hospedagem: ${provedorAtual}`);
}

console.log('\n--- Carregando variáveis de ambiente ---');

const getVariavelObrigatoria = (nome) => {
  const valor = process.env[nome];
  if (!valor) {
    console.error(`[ERRO FATAL] Variável "${nome}" não definida. Verifique seu arquivo .env na raiz do projeto.`);
    process.exit(1);
  }
  console.log(`  [OK] Variável [${nome}] carregada.`);
  return valor;
};

const getVariavelComFallback = (nome, fallback) => {
    const valor = process.env[nome];
    if (valor) {
        console.log(`  [OK] Variável [${nome}] encontrada.`);
        return valor;
    }
    console.log(`  [INFO] Variável [${nome}] não definida. Usando valor padrão: ${fallback}`);
    return fallback;
}

export const backendConfig = {
  ambiente: ambienteAtual,
  provedor: provedorAtual,
  isProducao: isProducao,
  porta: getVariavelComFallback('PORT', 3001),
  corsOrigin: getVariavelComFallback('CORS_ORIGIN', isProducao ? undefined : 'http://localhost:5173'),
  databaseUrl: getVariavelObrigatoria('DATABASE_URL'),
  jwtSecret: getVariavelObrigatoria('JWT_SECRET'),
  googleClientId: getVariavelObrigatoria('GOOGLE_CLIENT_ID'),
  googleClientSecret: getVariavelObrigatoria('GOOGLE_CLIENT_SECRET'),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

if (backendConfig.stripeSecretKey) {
    console.log(`  [OK] Variável [STRIPE_SECRET_KEY] encontrada.`);
} else {
    console.log(`  [INFO] Variável [STRIPE_SECRET_KEY] não definida.`);
}

// --- Checklist de Sucesso Personalizado e Dinâmico ---
if (isProducao) {
  console.log('\n--- Checklist de Sucesso da Implantação ---');
  console.log(`Hospedagem em ${provedorAtual} identificada. ✅`);
  console.log('Variáveis identificadas. ✅');
  console.log('Variáveis de ambiente carregadas ✅');
  console.log('Quantidade de variáveis identificadas.✅');
  console.log('Consumindo variáveis de ambiente ✅');
  console.log('Quantidade de variáveis consumidas.✅');
}

console.log('\n========================================================');
console.log('=== CONFIGURAÇÃO DO BACKEND FINALIZADA COM SUCESSO ===');
console.log('========================================================\n');
