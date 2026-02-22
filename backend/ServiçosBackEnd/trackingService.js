
import { facebookCapi } from './facebookCapi.js';
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const trackingService = {
    /**
     * Hub universal para eventos Server-Side.
     */
    handleCapiEvent: async (eventDetails, traceId) => {
        const { platform = 'meta', pixelId, accessToken, eventName, eventData, userData, eventId, url } = eventDetails;
        LogDeOperacoes.log('TENTATIVA_HANDLE_CAPI_EVENT', { platform, eventName }, traceId);

        try {
            if (platform === 'meta') {
                const result = await facebookCapi.sendEvent({
                    pixelId,
                    accessToken,
                    eventName,
                    eventData,
                    userData,
                    eventId,
                    url
                });
                LogDeOperacoes.log('SUCESSO_HANDLE_CAPI_EVENT', { platform, eventName, trace_id: result.fb_trace_id }, traceId);
                return { success: true, platform: 'meta', trace_id: result.fb_trace_id };
            }

            const error = new Error("PLATFORM_NOT_SUPPORTED");
            error.statusCode = 400;
            throw error;

        } catch (e) {
            LogDeOperacoes.error('FALHA_HANDLE_CAPI_EVENT', { platform, eventName, error: e }, traceId);
            // Manter o comportamento original de retornar um status 202 em caso de falha
            e.statusCode = 202; 
            throw e;
        }
    },

    /**
     * Obtém informações de pixel de marketing para um usuário.
     */
    getPixelInfo: async (ref, traceId) => {
        LogDeOperacoes.log('TENTATIVA_GET_PIXEL_INFO', { ref }, traceId);
        try {
            if (!ref) {
                const error = new Error("REF_REQUIRED");
                error.statusCode = 400;
                throw error;
            }

            const user = await userRepositorio.findByEmail(ref) || await userRepositorio.findByHandle(ref);

            if (user && user.marketingConfig?.pixelId) {
                LogDeOperacoes.log('SUCESSO_GET_PIXEL_INFO_USUARIO', { ref, userId: user.id }, traceId);
                return {
                    pixelId: user.marketingConfig.pixelId,
                    tiktokId: user.marketingConfig.tiktokId
                };
            }
            
            LogDeOperacoes.log('SUCESSO_GET_PIXEL_INFO_DEFAULT', { ref }, traceId);
            return { pixelId: process.env.VITE_PIXEL_ID || "" };

        } catch (e) {
            LogDeOperacoes.error('FALHA_GET_PIXEL_INFO', { ref, error: e }, traceId);
            throw e;
        }
    }
};
