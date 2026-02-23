
// --- GERENCIADOR DE SINCRONIZAÇÃO E ESTADO INICIAL ---

/**
 * Orquestra o carregamento dos dados iniciais da aplicação (hidratação).
 * Garante que a UI só seja totalmente renderizada após a sincronização de dados essenciais,
 * como perfil do usuário, configurações, permissões, etc.
 */
class GerenciadorDeSincronizacao {
    constructor() {
        // Silos de dados que precisam ser sincronizados antes do app estar "pronto"
        this.silos = new Set(['userProfile', 'userSettings', 'permissions']);
        this.hydratedSilos = new Set();
        this.listeners = new Set();
        this.isHydrated = false;
    }

    /**
     * Adiciona um listener para ser notificado sobre mudanças no estado de hidratação.
     * @param {function} listener - A função a ser chamada.
     * @returns {function} - Uma função para cancelar a inscrição.
     */
    subscribe(listener) {
        this.listeners.add(listener);
        // Notifica o novo listener sobre o estado atual
        listener(this.isHydrated);
        return () => this.listeners.delete(listener);
    }

    /**
     * Marca um silo de dados como hidratado (carregado).
     * @param {string} siloName - O nome do silo de dados.
     */
    markAsHydrated(siloName) {
        if (!this.silos.has(siloName)) {
            console.warn(`[Sincronização] Tentativa de hidratar um silo desconhecido: ${siloName}`);
            return;
        }

        if (this.hydratedSilos.has(siloName)) {
            return; // Já hidratado
        }

        console.log(`[Sincronização] Silo de dados sincronizado: ${siloName}`);
        this.hydratedSilos.add(siloName);
        this.checkIfFullyHydrated();
    }

    /**
     * Verifica se todos os silos registrados foram hidratados.
     */
    checkIfFullyHydrated() {
        if (this.hydratedSilos.size >= this.silos.size) {
            if (!this.isHydrated) {
                console.log('✅ [Sincronização] Todos os silos de dados foram sincronizados. App pronto!');
                this.isHydrated = true;
                this.notifyListeners();
            }
        }
    }

    /**
     * Notifica todos os listeners sobre a mudança de estado.
     */
    notifyListeners() {
        for (const listener of this.listeners) {
            listener(this.isHydrated);
        }
    }

    /**
     * Retorna o estado atual de hidratação.
     * @returns {boolean}
     */
    isFullyHydrated() {
        return this.isHydrated;
    }
}

// Exporta uma instância singleton do gerenciador com o nome que o App.tsx espera.
export const hydrationManager = new GerenciadorDeSincronizacao();
