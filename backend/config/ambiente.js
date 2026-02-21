
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { VARIAVEIS_BACKEND } from './variaveis.js'; 

// --- Configuração de Caminho Robusta para dotenv ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const envPath = path.join(projectRoot, '.env');
dotenv.config({ path: envPath });

// --- Classe para Construção de Logs ---
class LogBuilder {
    constructor() {
        this.logs = [];
        this.contadores = {
            identificadas: 0,
            consumidas: 0,
        };
    }

    add(level, message) {
        this.logs.push({ level, message });
    }

    addVariavelLog(type, nome, status, details = '') {
        this.add('info', `  [${type}] Variável [${nome}] ${status}. ${details}`);
    }

    getContador(tipo) {
        return this.contadores[tipo];
    }

    incrementarContador(tipo) {
        if (this.contadores.hasOwnProperty(tipo)) {
            this.contadores[tipo]++;
        }
    }

    imprimir() {
        this.logs.forEach(log => console[log.level](log.message));
    }
}

const logBuilder = new LogBuilder();

// --- Detecção de Ambiente ---
logBuilder.add('log', '\n=======================================================');
logBuilder.add('log', '=== INICIANDO CONFIGURAÇÃO DE AMBIENTE (BACKEND) ===');
logBuilder.add('log', '=======================================================');

const detectarAmbiente = () => {
    if (process.env.RENDER === 'true') return { ambiente: 'producao', provedor: 'Render' };
    if (process.env.VERCEL === 'true') return { ambiente: 'producao', provedor: 'Vercel' };
    if (process.env.NODE_ENV === 'production') return { ambiente: 'producao', provedor: 'Outro' };
    return { ambiente: 'local', provedor: 'Nenhum' };
};

const { ambiente: ambienteAtual, provedor: provedorAtual } = detectarAmbiente();
const isProducao = ambienteAtual === 'producao';

logBuilder.add('info', `[INFO] Ambiente detectado: ${ambienteAtual.toUpperCase()}`);
if (isProducao) {
    logBuilder.add('info', `[INFO] Provedor de hospedagem: ${provedorAtual}`);
}

logBuilder.add('log', '\n--- Carregando variáveis de ambiente ---');

// --- Processamento de Variáveis ---
const backendConfig = {
    ambiente: ambienteAtual,
    provedor: provedorAtual,
    isProducao,
};

VARIAVEIS_BACKEND.obrigatorias.forEach(nome => {
    const valor = process.env[nome];
    logBuilder.incrementarContador('identificadas');
    if (!valor) {
        logBuilder.add('error', `[ERRO FATAL] Variável obrigatória "${nome}" não definida.`);
        logBuilder.imprimir();
        process.exit(1);
    }
    backendConfig[nome] = valor;
    logBuilder.incrementarContador('consumidas');
    logBuilder.addVariavelLog('OK', nome, 'carregada');
});

Object.entries(VARIAVEIS_BACKEND.comFallback).forEach(([nome, fallback]) => {
    const valor = process.env[nome];
    logBuilder.incrementarContador('identificadas');
    if (valor) {
        backendConfig[nome] = valor;
        logBuilder.incrementarContador('consumidas');
        logBuilder.addVariavelLog('OK', nome, 'encontrada');
    } else {
        backendConfig[nome] = fallback;
        logBuilder.incrementarContador('consumidas');
        logBuilder.addVariavelLog('INFO', nome, 'não definida', `Usando valor padrão: ${fallback}`);
    }
});

VARIAVEIS_BACKEND.opcionais.forEach(nome => {
    const valor = process.env[nome];
    logBuilder.incrementarContador('identificadas');
    if (valor) {
        backendConfig[nome] = valor;
        logBuilder.incrementarContador('consumidas');
        logBuilder.addVariavelLog('OK', nome, 'encontrada');
    } else {
        logBuilder.addVariavelLog('INFO', nome, 'não definida');
    }
});

// --- Logs de Resumo ---
if (isProducao) {
    logBuilder.add('log', '\n--- Checklist de Sucesso da Implantação ---');
    logBuilder.add('info', `Hospedagem em ${provedorAtual} identificada. ✅`);
    logBuilder.add('info', `Quantidade de variáveis identificadas: ${logBuilder.getContador('identificadas')} ✅`);
    logBuilder.add('info', `Quantidade de variáveis consumidas: ${logBuilder.getContador('consumidas')} ✅`);
}

logBuilder.add('log', '\n========================================================');
logBuilder.add('log', '=== CONFIGURAÇÃO DO BACKEND FINALIZADA COM SUCESSO ===');
logBuilder.add('log', '========================================================\n');

logBuilder.imprimir();

// --- Exportação da Configuração ---
export { backendConfig };
