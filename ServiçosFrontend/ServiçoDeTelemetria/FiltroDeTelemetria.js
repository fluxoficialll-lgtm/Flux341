
/**
 * Um filtro para decidir se um determinado erro ou evento de telemetria
 * deve ser rastreado ou ignorado.
 */
export const FiltroDeTelemetria = {
    /**
     * Decide se um erro deve ser rastreado.
     * @param {Error | any} error - O erro a ser analisado.
     * @returns {boolean} - Retorna `true` se o erro deve ser rastreado.
     */
    shouldTrack(error) {
        // Ignora erros comuns e não acionáveis do navegador
        if (error && error.message && error.message.includes('ResizeObserver loop limit exceeded')) {
            return false;
        }

        // Ignora erros de rejeição de promessa sem motivo (ex: cancelamento)
        if (!error) {
            return false;
        }

        // Adicione aqui outras lógicas de filtragem que você precisar.
        // Por exemplo, ignorar erros de uma biblioteca específica em ambiente de dev.

        return true; // Rastreia todos os outros erros por padrão
    },
};
