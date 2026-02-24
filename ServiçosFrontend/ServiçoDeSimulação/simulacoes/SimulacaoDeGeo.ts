
import { GeoData } from '../../../types';

/**
 * Simula a resposta da API de geolocalização.
 * @param url - O objeto URL da requisição (não utilizado aqui, mas parte da assinatura do handler).
 * @returns Uma Promise que resolve para um objeto Response com dados de geolocalização simulados.
 */
export const handleGeoInfoSimulado = (url: URL): Promise<Response> => {
    console.log('[SIMULAÇÃO] ✅ Retornando mock para: GET /api/geo/info');

    const mockGeoData: GeoData = {
        country: 'BR',
        region: 'São Paulo',
        city: 'São Paulo',
        currency: 'BRL',
    };

    return Promise.resolve(new Response(JSON.stringify(mockGeoData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    }));
};

// Mapeamento de handlers para URLs de geolocalização
export const geoHandlers: Record<string, (url: URL, config?: RequestInit) => Promise<Response>> = {
    '/api/geo/info': handleGeoInfoSimulado,
};
