
import { financialRepositorio } from '../GerenciadoresDeDados/financial.repositorio.js';

export const analyticsService = {
    /**
     * Retorna um ranking de pagamentos, opcionalmente filtrado por país.
     */
    getPaymentRanking: async (country, logger) => {
        logger.log('ANALYTICS_PAYMENT_RANKING_START', { query: { country } });
        try {
            const ranking = await financialRepositorio.getPaymentRanking(country);
            logger.log('ANALYTICS_PAYMENT_RANKING_SUCCESS', {
                filters: { country: country || 'ALL' },
                rankingSize: ranking.length
            });
            return { success: true, filters: { country: country || 'ALL' }, ranking };
        } catch (e) {
            logger.error('ANALYTICS_PAYMENT_RANKING_ERROR', {
                error: e.message,
                stack: e.stack,
                query: { country }
            });
            throw e;
        }
    },

    /**
     * Retorna o ranking de pagamentos para um vendedor específico.
     */
    getSellerPaymentRanking: async (userId, logger) => {
        logger.log('ANALYTICS_SELLER_RANKING_START', { userId });
        try {
            const ranking = await financialRepositorio.getSellerPaymentRanking(userId);
            logger.log('ANALYTICS_SELLER_RANKING_SUCCESS', { userId, rankingSize: ranking.length });
            return { success: true, userId, ranking };
        } catch (e) {
            logger.error('ANALYTICS_SELLER_RANKING_ERROR', { 
                error: e.message, 
                stack: e.stack, 
                userId 
            });
            throw e;
        }
    },

    /**
     * Registra o uso de um método de pagamento.
     */
    logPaymentMethod: async (data, logger) => {
        logger.log('ANALYTICS_LOG_PAYMENT_START', { body: data });
        try {
            if (!data.methodName || !data.provider) {
                logger.warn('ANALYTICS_LOG_PAYMENT_INVALID_INPUT', { body: data });
                const error = new Error("methodName and provider are required.");
                error.statusCode = 400;
                throw error;
            }
            await financialRepositorio.recordPaymentMethodUsage(data);
            logger.log('ANALYTICS_LOG_PAYMENT_SUCCESS', { paymentData: data });
            return { success: true };
        } catch (e) {
            logger.error('ANALYTICS_LOG_PAYMENT_ERROR', { 
                error: e.message, 
                stack: e.stack, 
                body: data 
            });
            throw e;
        }
    }
};
