
import { rastreadorDeEventos } from './RastreadorDeEventos';

/**
 * Intercepta e monitora as chamadas globais de `fetch` para fins de telemetria.
 * Esta função substitui o `fetch` original por uma versão que rastreia o tempo de resposta,
 * o status e os erros das requisições.
 */
export const initAuditorDeRequisições = () => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
        const [url, config] = args;
        const startTime = Date.now();

        try {
            const response = await originalFetch(...args);
            const duration = Date.now() - startTime;

            const clonedResponse = response.clone();

            rastreadorDeEventos.trackNetworkRequest({
                url: url.toString(),
                status: clonedResponse.status,
                duration,
                ok: clonedResponse.ok,
                method: config?.method || 'GET',
            });

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;

            rastreadorDeEventos.trackNetworkRequestError({
                url: url.toString(),
                duration,
                error: error.message,
                method: config?.method || 'GET',
            });

            throw error;
        }
    };

    console.log('Auditor de Requisições inicializado para telemetria.');
};
