
// --- CONTROLE CENTRAL DE SIMULAÇÃO (ORQUESTRADOR) ---

import { feedHandlers } from './simulacoes/SimulacaoDeFeed.js';

// Mapeia o caminho do endpoint para a sua função de tratamento
const configBootHandler = (urlObj) => {
    console.log('[SIMULAÇÃO] ✅ Retornando mock para: GET /api/v1/config/boot');
    return Promise.resolve(new Response(JSON.stringify({
        maintenanceMode: false,
        ambiente: 'local-simulado'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
};

// Centraliza todos os handlers de simulação da aplicação.
// A chave é o NOME DO CAMINHO (pathname) da URL.
const todosOsHandlers = {
    ...feedHandlers,
    '/api/v1/config/boot': configBootHandler,
    // Adicione outros handlers importados aqui. Ex: ...authHandlers
};

let mockModeAtivado = false;

class SimulationControl {
    isMockMode() {
        return mockModeAtivado;
    }

    ativarSimulacao() {
        if (mockModeAtivado) return;
        mockModeAtivado = true;

        console.warn('***********************************************************');
        console.warn('** MODO DE SIMULAÇÃO ATIVADO. API REAL DESABILITADA. **');
        console.warn('***********************************************************');

        const originalFetch = window.fetch;

        window.fetch = async (url, config) => {
            const urlObj = new URL(url.toString(), window.location.origin);
            const handler = todosOsHandlers[urlObj.pathname];

            if (handler) {
                console.log(`[SIMULAÇÃO] Interceptado: ${config?.method || 'GET'} ${urlObj.pathname}`);
                return handler(urlObj, config);
            }

            // --- CONTROLO PARA REQUISIÇÕES NÃO SIMULADAS ---
            console.error(`[SIMULAÇÃO] ❌ ERRO: Requisição para "${urlObj.pathname}" não foi simulada.`);
            console.error('[SIMULAÇÃO] 💡 Para corrigir, adicione um handler para esta URL no ficheiro de simulação apropriado.');

            return Promise.resolve(new Response(
                JSON.stringify({ error: 'Endpoint não simulado', message: `A requisição para ${urlObj.pathname} foi interceptada, mas não há um mock para ela.` }),
                { status: 404, statusText: 'Not Found (Mock Missing)', headers: { 'Content-Type': 'application/json' } }
            ));
        };
    }
}

export const ControleDeSimulacao = new SimulationControl();
