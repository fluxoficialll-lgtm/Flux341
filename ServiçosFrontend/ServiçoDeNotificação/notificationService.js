
// --- MOCK DO SERVIÇO DE NOTIFICAÇÃO ---

class NotificationService {
    /**
     * Simula a busca por novas notificações.
     * @returns {Promise<object[]>}
     */
    getNotifications() {
        console.log("[Notification Mock] Buscando notificações...");
        return Promise.resolve([]); // Retorna um array vazio para simular a ausência de notificações
    }

    /**
     * Simula a marcação de uma notificação como lida.
     * @param {string} notificationId - O ID da notificação.
     * @returns {Promise<void>}
     */
    markAsRead(notificationId) {
        console.log(`[Notification Mock] Marcando notificação ${notificationId} como lida.`);
        return Promise.resolve();
    }
}

export const notificationService = new NotificationService();
