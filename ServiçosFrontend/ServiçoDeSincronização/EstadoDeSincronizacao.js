
// --- CONTROLE DE ESTADO DE SINCRONIZAÇÃO ---

const FULL_SYNC_INTERVAL = 15 * 60 * 1000; // Força uma sincronização completa a cada 15 minutos
const LAST_SYNC_KEY = 'last_full_sync_timestamp';

/**
 * Gerencia o estado do tempo de sincronização para determinar se uma sincronização
 * completa dos dados do usuário é necessária.
 */
class EstadoDeSincronizacao {
    /**
     * Verifica se uma sincronização completa deve ser realizada.
     * @returns {boolean}
     */
    shouldDoFullSync() {
        const lastSync = localStorage.getItem(LAST_SYNC_KEY);
        if (!lastSync) {
            return true; // Nunca sincronizou antes
        }

        const now = Date.now();
        const lastSyncTime = parseInt(lastSync, 10);

        if (now - lastSyncTime > FULL_SYNC_INTERVAL) {
            return true; // O tempo de cache expirou
        }

        return false;
    }

    /**
     * Marca que uma sincronização completa foi realizada com sucesso.
     */
    recordFullSync() {
        localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    }
}

// Exporta uma instância, que é o que o código em `useAuthSync` parece esperar.
export const SyncState = new EstadoDeSincronizacao();
