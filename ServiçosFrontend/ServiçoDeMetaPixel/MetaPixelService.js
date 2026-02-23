
// --- SERVIÇO DE INTEGRAÇÃO COM O PIXEL DO META (FACEBOOK) ---

/**
 * Gerencia o envio de eventos para o Pixel do Meta para rastreamento de conversões e audiências.
 */
class MetaPixelService {
    /**
     * Rastreia uma visualização de página padrão.
     * @param {string} pixelId - O ID do Pixel do Meta.
     */
    trackPageView(pixelId) {
        console.log(`[Meta Pixel] Visualização de Página rastreada para o Pixel ID: ${pixelId}`);
        // Em uma implementação real:
        // window.fbq('track', 'PageView');
    }

    /**
     * Rastreia o acesso através de um link de recrutamento/afiliado.
     * @param {string} refCode - O código de referência do afiliado.
     */
    trackRecruitmentAccess(refCode) {
        console.log(`[Meta Pixel] Acesso de Recrutamento rastreado com ref: ${refCode}`);
        // Exemplo de evento personalizado
        // window.fbq('trackCustom', 'RecruitmentAccess', { ref: refCode });
    }
}

// Exporta uma instância singleton do serviço
export const metaPixelService = new MetaPixelService();
