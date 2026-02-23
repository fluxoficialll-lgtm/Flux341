
// --- SERVIÇO DE RASTREAMENTO DE ATIVIDADE DO USUÁRIO ---

/**
 * Monitora a atividade do usuário para fins de análise de engajamento e segurança.
 * Este serviço pode rastrear cliques, navegação de página e outros eventos importantes.
 */
class TrackingService {
    constructor() {
        this.params = new URLSearchParams(window.location.search);
    }
    /**
     * Registra a visualização de uma página pelo usuário.
     * @param {string} pageName - O nome ou URL da página visualizada.
     */
    trackPageView(pageName) {
        console.log(`[Rastreamento] Visualização de Página: ${pageName}`);
    }

    /**
     * Rastreia um evento de interação do usuário, como um clique de botão.
     * @param {string} eventName - Um nome único para o evento (ex: 'clicou-em-salvar-perfil').
     * @param {object} [data={}] - Dados adicionais sobre o evento.
     */
    trackUserEvent(eventName, data = {}) {
        console.log(`[Rastreamento] Evento de Usuário: ${eventName}`, data);
    }

    /**
     * Captura parâmetros da URL como UTMs e 'ref'.
     */
    captureUrlParams() {
        console.log('[Rastreamento] Parâmetros da URL capturados.');
        // Atualiza os parâmetros a cada chamada, se necessário
        this.params = new URLSearchParams(window.location.search);
    }

    /**
     * Obtém o código de referência do afiliado a partir dos parâmetros da URL.
     * @returns {string|null} O código de referência ou nulo se não encontrado.
     */
    getAffiliateRef() {
        return this.params.get('ref');
    }
}

// Exporta uma instância singleton do serviço
export const trackingService = new TrackingService();
