
// --- SERVIÇO DE GOVERNANÇA E CONFIGURAÇÃO (FLUX) ---

class ConfigControlService {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = 0;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    }

    async boot() {
        const now = Date.now();
        if (this.cache && (now - this.cacheTimestamp < this.CACHE_DURATION)) {
            console.log('[GovFlux] Usando configuração em cache.');
            return this.cache;
        }

        try {
            console.log('[GovFlux] Buscando configuração remota...');
            
            // PONTO DE CONTROLO 3: Verifica a função fetch no momento exato da chamada.
            if (import.meta.env.DEV) {
                console.log('🔵 [DIAGNÓSTICO 3/3] window.fetch em ConfigControl.boot():', window.fetch.toString());
            }
            
            const response = await fetch('/api/v1/config/boot');

            if (!response.ok) {
                throw new Error(`Falha ao buscar o plano de controle: ${response.statusText}`);
            }

            const config = await response.json();

            this.cache = config;
            this.cacheTimestamp = now;

            return config;
        } catch (error) {
            console.error('Falha crítica ao carregar a configuração remota. Usando fallback.', error);
            return this.getFallbackConfig();
        }
    }

    getFallbackConfig() {
        return {
            maintenanceMode: false,
        };
    }

    static async logAction(groupId, action, details) {
        console.log(`[GovFlux] Ação registrada no grupo ${groupId}: ${action}`, details);
    }
}

export const ConfigControl = new ConfigControlService();
