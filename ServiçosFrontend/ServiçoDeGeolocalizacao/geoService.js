
// Serviço para interagir com a API de Geolocalização.

const BASE_URL = '/api/geo';

/**
 * Lida com as respostas da API, convertendo para JSON ou lançando um erro.
 * @param {Response} res - O objeto de resposta do fetch.
 * @returns {Promise<any>} O corpo da resposta em JSON.
 * @throws {Error} Se a resposta não for bem-sucedida.
 */
const handleResponse = async (res) => {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido na API de Geolocalização' }));
        throw new Error(errorData.message || `Erro ${res.status}`);
    }
    return res.json();
};

/**
 * Obtém os headers de autorização.
 * @param {string} token - O token JWT.
 * @returns {object} Os headers com o token.
 */
const getAuthHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const geoService = {
    /**
     * Obtém informações de geolocalização com base no IP do cliente (inferido pelo backend).
     * @param {string} token - O token de autenticação.
     * @returns {Promise<GeoData>} Os dados de geolocalização.
     */
    async getGeoInfo(token) {
        // O backend irá inferir o IP a partir da requisição.
        const res = await fetch(`${BASE_URL}/info`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },
};
