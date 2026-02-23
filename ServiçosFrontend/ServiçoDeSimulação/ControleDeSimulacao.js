
// --- CONTROLE CENTRAL DE SIMULAÇÃO (MOCKS) ---

/**
 * Variável de controle principal para ativar ou desativar o modo de simulação em toda a aplicação.
 * O valor é lido da variável de ambiente VITE_USE_MOCKS, configurada no arquivo .env.
 *
 * Para ativar o modo de simulação, adicione VITE_USE_MOCKS=true ao seu arquivo .env.local
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
export const MOCK_USERS = {};
export const MOCK_POSTS = [];
export const MOCK_PRODUCTS = [];
export const MOCK_GROUPS = [];
export const MOCK_CAMPAIGNS = [];
export const MOCK_NOTIFICATIONS = [];
export const MOCK_CHATS = [];


class SimulationControl {
    isMockMode() {
        return USE_MOCKS;
    }
}

export const ControleDeSimulacao = new SimulationControl();


/**
 * Função para inicializar o servidor de simulação (ex: MirageJS).
 * A inicialização só ocorre se USE_MOCKS for verdadeiro e estivermos em um ambiente de desenvolvimento.
 */
export function inicializarServidorDeSimulacao() {
    if (USE_MOCKS && import.meta.env.DEV) {
        // O código para iniciar o servidor de simulação (como o MirageJS) iria aqui.
        // Exemplo:
        //
        // import { createServer } from "miragejs";
        // createServer({
        //   routes() {
        //     this.namespace = 'api';
        //     this.get("/users", () => [{ id: "1", name: "Luke" }]);
        //   },
        // });

        console.warn('***********************************************************');
        console.warn('** MODO DE SIMULAÇÃO ATIVADO. API REAL DESABILITADA. **');
        console.warn('***********************************************************');
    }
}

// Inicializa o servidor ao carregar este módulo
inicializarServidorDeSimulacao();
