
import { financialRepositorio } from '../GerenciadoresDeDados/financial.repositorio.js';
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';
import { groupRepositorio } from '../GerenciadoresDeDados/group.repositorio.js';
// import { FeeEngine } from '../ServiçosBackEnd/financial/FeeEngine.js'; // Temporariamente desativado
import { NotificationEmitter } from '../ServiçosBackEnd/socket/NotificationEmitter.js';
import { facebookCapi } from '../ServiçosBackEnd/facebookCapi.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const paymentsControle = {
    processSaleSuccess: async (req, res) => {
        const { transactionId, grossAmount, provider, sellerId, groupId, buyerEmail, currency = 'BRL', method, country, userData } = req.body;
        const logContext = { transactionId, provider, sellerId, groupId };

        LogDeOperacoes.log('TENTATIVA_PROCESSAR_VENDA', { ...logContext, grossAmount }, req.traceId);

        try {
            // Etapa 1: Cálculo de Taxas (Temporariamente desativado)
            LogDeOperacoes.log('CALCULANDO_TAXAS_TRANSACAO (DESATIVADO)', logContext, req.traceId);
            // const breakdown = await FeeEngine.calculateTransaction(grossAmount, sellerId, { provider, method, country });
            
            // Mock do objeto breakdown para permitir que a aplicação continue funcionando
            const breakdown = {
                platformFee: 0, // Taxa da plataforma zerada
                providerFee: 0, // Assumindo que a taxa do provedor não é calculada aqui
                netAmount: grossAmount,
                currency: currency
            };

            LogDeOperacoes.log('SUCESSO_CALCULO_TAXAS (MOCK)', { ...logContext, breakdown }, req.traceId);

            // Etapa 2: Registro Financeiro no Banco de Dados com o novo repositório
            LogDeOperacoes.log('REGISTRANDO_TRANSACAO_FINANCEIRA_DB', { ...logContext, netAmount: breakdown.netAmount }, req.traceId);
            await financialRepositorio.recordTransaction({
                userId: sellerId,
                relatedEntityId: groupId,
                relatedEntityType: 'group',
                grossAmount: grossAmount,
                platformFee: breakdown.platformFee,
                providerFee: breakdown.providerFee, // Pode ser 0 se não for conhecido
                netAmount: breakdown.netAmount,
                currency: currency,
                type: 'sale',
                status: 'completed', // Status final, pois o pagamento já foi confirmado
                provider: provider,
                providerTransactionId: transactionId,
                metadata: {
                    buyerEmail,
                    paymentMethod: method,
                    buyerCountry: country,
                    userAgent: req.headers['user-agent'],
                    ipAddress: req.ip,
                }
            });
            LogDeOperacoes.log('SUCESSO_REGISTRO_TRANSACAO_DB', logContext, req.traceId);

            // Etapa 3: Disparo de Evento para Facebook CAPI (utilizando os novos repositórios)
            const seller = await userRepositorio.findById(sellerId);
            const group = await groupRepositorio.findById(groupId);

            if (seller && seller.marketingConfig?.pixelId) {
                LogDeOperacoes.log('TENTATIVA_ENVIO_EVENTO_CAPI', { ...logContext, pixelId: seller.marketingConfig.pixelId }, req.traceId);
                try {
                    await facebookCapi.sendEvent({
                        pixelId: seller.marketingConfig.pixelId,
                        accessToken: seller.marketingConfig.pixelToken,
                        eventName: 'Purchase',
                        eventId: `pur_${transactionId}`,
                        url: `${process.env.APP_URL}/vip-group-sales/${groupId}`,
                        eventData: { value: grossAmount, currency, content_ids: [groupId], content_type: 'product_group', content_name: group?.name || 'Venda VIP' },
                        userData: { email: buyerEmail, ip: req.ip, userAgent: req.headers['user-agent'], ...userData }
                    });
                    LogDeOperacoes.log('SUCESSO_ENVIO_EVENTO_CAPI', { ...logContext, pixelId: seller.marketingConfig.pixelId }, req.traceId);
                } catch (capiErr) {
                    LogDeOperacoes.warn('FALHA_ENVIO_EVENTO_CAPI', { ...logContext, error: capiErr }, req.traceId);
                }
            } else {
                LogDeOperacoes.log('ENVIO_EVENTO_CAPI_IGNORADO_SELLER_NAO_CONFIGURADO', logContext, req.traceId);
            }

            // Etapa 4: Notificação Real-time
            if (req.io && buyerEmail && groupId) {
                LogDeOperacoes.log('EMITINDO_NOTIFICACAO_PAGAMENTO', { ...logContext, buyerEmail }, req.traceId);
                NotificationEmitter.emitPaymentSuccess(req.io, buyerEmail, groupId, group?.name || 'VIP');
            }

            LogDeOperacoes.log('SUCESSO_PROCESSAR_VENDA', logContext, req.traceId);
            res.json({ success: true, breakdown });

        } catch (e) {
            LogDeOperacoes.error('FALHA_CRITICA_PROCESSAR_VENDA', { ...logContext, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    }
};

export default paymentsControle;
