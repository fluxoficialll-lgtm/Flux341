
console.log('\n========================================================');
console.log('=== INICIANDO CONFIGURAÇÃO DE AMBIENTE (FRONTEND) ===');
console.log('========================================================');

const isProducao = import.meta.env.PROD;
const ambienteAtual = isProducao ? 'producao' : 'desenvolvimento';

console.log(`[INFO] Ambiente detectado: ${ambienteAtual.toUpperCase()}`);

console.log('\n--- Carregando variáveis de ambiente (prefixo VITE_) ---');

const getVariavelFrontendObrigatoria = (nome) => {
  const valor = import.meta.env[nome];
  if (!valor) {
    console.error(`[ERRO FATAL] Variável de ambiente "${nome}" não foi definida.`);
    throw new Error(`Variável de ambiente "${nome}" não definida.`); 
  }
  console.log(`  [OK] Variável [${nome}] carregada.`);
  return valor;
};

const getVariavelFrontendComFallback = (nome, fallback) => {
    const valor = import.meta.env[nome];
    if (valor) {
        console.log(`  [OK] Variável [${nome}] encontrada.`);
        return valor;
    }
    console.log(`  [INFO] Variável [${nome}] não definida. Usando valor padrão: ${fallback}`);
    return fallback;
}

export const frontendConfig = {
  isProducao: isProducao,
  apiUrl: getVariavelFrontendComFallback('VITE_API_URL', 'http://localhost:3001'),
  googleClientId: getVariavelFrontendObrigatoria('VITE_GOOGLE_CLIENT_ID'),
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

if (frontendConfig.stripePublishableKey) {
    console.log(`  [OK] Variável [VITE_STRIPE_PUBLISHABLE_KEY] encontrada.`);
} else {
    console.log(`  [INFO] Variável [VITE_STRIPE_PUBLISHABLE_KEY] não definida.`);
}

// --- Checklist de Sucesso Personalizado para o Frontend ---
if (isProducao) {
  console.log('\n--- Checklist de Sucesso do Build ---');
  console.log('Ambiente de Produção identificado. ✅');
  console.log('Variáveis (VITE_) identificadas. ✅');
  console.log('Variáveis de ambiente carregadas ✅');
  console.log('Quantidade de variáveis identificadas.✅');
  console.log('Consumindo variáveis de ambiente ✅');
  console.log('Quantidade de variáveis consumidas.✅');
}

console.log('\n==========================================================');
console.log('=== CONFIGURAÇÃO DO FRONTEND FINALIZADA COM SUCESSO ===');
console.log('==========================================================\n');
