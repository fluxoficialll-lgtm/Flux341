
import { financialRepositorio } from '../GerenciadoresDeDados/financial.repositorio.js';
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';
import { groupRepositorio } from '../GerenciadoresDeDados/group.repositorio.js';
import { NotificationEmitter } from './socket/NotificationEmitter.js';
import { facebookCapi } from './facebookCapi.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const paymentsService = {
    processSaleSuccess: async (saleData, { ip, userAgent, io, traceId }) => {
        const { transactionId, grossAmount, provider, sellerId, groupId, buyerEmail, currency = 'BRL', method, country, userData } = saleData;
        const logContext = { transactionId, provider, sellerId, groupId };

        LogDeOperacoes.log('TENTATIVA_PROCESSAR_VENDA', { ...logContext, grossAmount }, traceId);

        try {
            // Mock do objeto breakdown para permitir que a aplicação continue funcionando
            const breakdown = {
                platformFee: 0,
                providerFee: 0,
                netAmount: grossAmount,
                currency: currency
            };

            LogDeOperacoes.log('SUCESSO_CALCULO_TAXAS (MOCK)', { ...logContext, breakdown }, traceId);

            await financialRepositorio.recordTransaction({
                userId: sellerId,
                relatedEntityId: groupId,
                relatedEntityType: 'group',
                grossAmount: grossAmount,
                platformFee: breakdown.platformFee,
                providerFee: breakdown.providerFee,
                netAmount: breakdown.netAmount,
                currency: currency,
                type: 'sale',
                status: 'completed',
                provider: provider,
                providerTransactionId: transactionId,
                metadata: {
                    buyerEmail,
                    paymentMethod: method,
                    buyerCountry: country,
                    userAgent: userAgent,
                    ipAddress: ip,
                }
            });
            LogDeOperacoes.log('SUCESSO_REGISTRO_TRANSACAO_DB', logContext, traceId);

            const seller = await userRepositorio.findById(sellerId);
            const group = await groupRepositorio.findById(groupId);

            if (seller && seller.marketingConfig?.pixelId) {
                LogDeOperacoes.log('TENTATIVA_ENVIO_EVENTO_CAPI', { ...logContext, pixelId: seller.marketingConfig.pixelId }, traceId);
                try {
                    await facebookCapi.sendEvent({
                        pixelId: seller.marketingConfig.pixelId,
                        accessToken: seller.marketingConfig.pixelToken,
                        eventName: 'Purchase',
                        eventId: `pur_${transactionId}`,
                        url: `${process.env.APP_URL}/vip-group-sales/${groupId}`,
                        eventData: { value: grossAmount, currency, content_ids: [groupId], content_type: 'product_group', content_name: group?.name || 'Venda VIP' },
                        userData: { email: buyerEmail, ip: ip, userAgent: userAgent, ...userData }
                    });
                    LogDeOperacoes.log('SUCESSO_ENVIO_EVENTO_CAPI', { ...logContext, pixelId: seller.marketingConfig.pixelId }, traceId);
                } catch (capiErr) {
                    LogDeOperacoes.warn('FALHA_ENVIO_EVENTO_CAPI', { ...logContext, error: capiErr }, traceId);
                }
            } else {
                LogDeOperacoes.log('ENVIO_EVENTO_CAPI_IGNORADO_SELLER_NAO_CONFIGURADO', logContext, traceId);
            }

            if (io && buyerEmail && groupId) {
                LogDeOperacoes.log('EMITINDO_NOTIFICACAO_PAGAMENTO', { ...logContext, buyerEmail }, traceId);
                NotificationEmitter.emitPaymentSuccess(io, buyerEmail, groupId, group?.name || 'VIP');
            }

            LogDeOperacoes.log('SUCESSO_PROCESSAR_VENDA', logContext, traceId);
            return { success: true, breakdown };

        } catch (e) {
            LogDeOperacoes.error('FALHA_CRITICA_PROCESSAR_VENDA', { ...logContext, error: e }, traceId);
            throw e;
        }
    }
};
