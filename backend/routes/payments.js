
import express from 'express';
import { dbManager } from '../databaseManager.js';
import { FeeEngine } from '../ServiçosBackEnd/financial/FeeEngine.js';
import { NotificationEmitter } from '../ServiçosBackEnd/socket/NotificationEmitter.js';
import { facebookCapi } from '../ServiçosBackEnd/facebookCapi.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const router = express.Router();

router.post('/process-sale-success', async (req, res) => {
    const { transactionId, grossAmount, provider, sellerId, groupId, buyerEmail } = req.body;
    const logContext = { transactionId, provider, sellerId, groupId };

    LogDeOperacoes.log('TENTATIVA_PROCESSAR_VENDA', { ...logContext, grossAmount }, req.traceId);

    try {
        // Etapa 1: Cálculo de Taxas
        LogDeOperacoes.log('CALCULANDO_TAXAS_TRANSACAO', logContext, req.traceId);
        const breakdown = await FeeEngine.calculateTransaction(grossAmount, sellerId, {
            provider,
            method: req.body.method,
            country: req.body.country
        });
        LogDeOperacoes.log('SUCESSO_CALCULO_TAXAS', { ...logContext, breakdown }, req.traceId);

        // Etapa 2: Registro Financeiro no Banco de Dados
        LogDeOperacoes.log('REGISTRANDO_TRANSACAO_FINANCEIRA_DB', { ...logContext, netAmount: breakdown.netAmount }, req.traceId);
        await dbManager.financial.recordTransaction({
            userId: sellerId,
            type: 'sale',
            amount: breakdown.netAmount,
            status: 'paid',
            providerTxId: transactionId,
            currency: req.body.currency || 'BRL',
            data: {
                originalGross: grossAmount,
                platformProfit: breakdown.platformFee,
                groupId,
                provider,
                method: req.body.method
            }
        });
        LogDeOperacoes.log('SUCESSO_REGISTRO_TRANSACAO_DB', logContext, req.traceId);

        // Etapa 3: Disparo de Evento para Facebook CAPI (se aplicável)
        const seller = await dbManager.users.findById(sellerId);
        const group = await dbManager.groups.findById(groupId);

        if (seller && seller.marketingConfig?.pixelId) {
            LogDeOperacoes.log('TENTATIVA_ENVIO_EVENTO_CAPI', { ...logContext, pixelId: seller.marketingConfig.pixelId }, req.traceId);
            try {
                await facebookCapi.sendEvent({
                    pixelId: seller.marketingConfig.pixelId,
                    accessToken: seller.marketingConfig.pixelToken,
                    eventName: 'Purchase',
                    eventId: `pur_${transactionId}`,
                    url: `${process.env.APP_URL}/vip-group-sales/${groupId}`,
                    eventData: {
                        value: grossAmount,
                        currency: req.body.currency || 'BRL',
                        content_ids: [groupId],
                        content_type: 'product_group',
                        content_name: group?.name || 'Venda VIP'
                    },
                    userData: {
                        email: buyerEmail,
                        ip: req.ip,
                        userAgent: req.headers['user-agent'],
                        ...req.body.userData
                    }
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
});

export default router;
