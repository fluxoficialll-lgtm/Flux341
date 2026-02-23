
/**
 * Um serviço de telemetria para rastrear eventos importantes da aplicação,
 * como visualizações de página, interações de UI, erros e requisições de rede.
 * Pode ser expandido para enviar dados a serviços como Google Analytics, Sentry, etc.
 */
class RastreadorDeEventos {
    constructor() {
        this.logEventos = [];
        console.log('Rastreador de Eventos inicializado.');
    }

    /**
     * Rastreia um evento genérico.
     * @param {string} category - A categoria do evento (ex: 'UI', 'Network').
     * @param {string} action - A ação que ocorreu (ex: 'button_click').
     * @param {object} data - Dados adicionais sobre o evento.
     */
    trackEvent(category, action, data = {}) {
        const evento = { timestamp: new Date().toISOString(), category, action, data };
        this.logEventos.push(evento);
        // Em um cenário real, você enviaria este evento para um serviço de análise.
        console.log('Evento Rastreado:', evento);
    }

    /**
     * Rastreia um erro crítico na aplicação.
     * @param {Error | string} error - O objeto de erro ou mensagem.
     * @param {string} context - O contexto onde o erro ocorreu.
     */
    trackCriticalError(error, context) {
        this.trackEvent('Error', 'Critical', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            context,
        });
    }

    /**
     * Rastreia uma requisição de rede bem-sucedida.
     * @param {object} requestData - Dados sobre a requisição.
     */
    trackNetworkRequest(requestData) {
        this.trackEvent('Network', 'RequestSuccess', requestData);
    }

    /**
     * Rastreia um erro em uma requisição de rede.
     * @param {object} requestErrorData - Dados sobre o erro da requisição.
     */
    trackNetworkRequestError(requestErrorData) {
        this.trackEvent('Network', 'RequestFail', requestErrorData);
    }
}

// Exporta uma instância singleton do rastreador
export const rastreadorDeEventos = new RastreadorDeEventos();
