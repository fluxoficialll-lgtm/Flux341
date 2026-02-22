
import { adCampaignRepositorio } from '../GerenciadoresDeDados/ad.campaign.repositorio.js';
import { adAnalyticsRepositorio } from '../GerenciadoresDeDados/ad.analytics.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const adService = {
    createCampaign: async (campaignData, ownerId, traceId) => {
        LogDeOperacoes.log('TENTATIVA_CRIAR_CAMPANHA', { ownerId, body: campaignData }, traceId);
        try {
            const campaign = await adCampaignRepositorio.create({ ownerId, ...campaignData });
            return campaign;
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIAR_CAMPANHA', { ownerId, error: e }, traceId);
            throw e;
        }
    },

    getCampaigns: (ownerId) => adCampaignRepositorio.findByOwner(ownerId),

    getCampaignById: (campaignId) => adCampaignRepositorio.findById(campaignId),

    updateCampaign: async (campaignId, updates, traceId) => {
        LogDeOperacoes.log('TENTATIVA_ATUALIZAR_CAMPANHA', { campaignId, updates }, traceId);
        try {
            const updatedCampaign = await adCampaignRepositorio.update(campaignId, updates);
            return updatedCampaign;
        } catch (e) {
            LogDeOperacoes.error('FALHA_ATUALIZAR_CAMPANHA', { campaignId, error: e }, traceId);
            throw e;
        }
    },

    addBudgetToCampaign: async (campaignId, amount, traceId) => {
        if (!amount || amount <= 0) {
            const error = new Error('Valor inválido.');
            error.statusCode = 400;
            throw error;
        }
        LogDeOperacoes.log('TENTATIVA_ADICIONAR_ORCAMENTO', { campaignId, amount }, traceId);
        try {
            await adCampaignRepositorio.addBudget(campaignId, amount);
            return { success: true };
        } catch (e) {
            LogDeOperacoes.error('FALHA_ADICIONAR_ORCAMENTO', { campaignId, error: e }, traceId);
            throw e;
        }
    },

    deleteCampaign: async (campaignId, traceId) => {
        LogDeOperacoes.log('TENTATIVA_DELETAR_CAMPANHA', { campaignId }, traceId);
        try {
            await adCampaignRepositorio.delete(campaignId);
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_CAMPANHA', { campaignId, error: e }, traceId);
            throw e;
        }
    },

    getCampaignPerformance: (campaignId) => adAnalyticsRepositorio.getPerformanceMetrics(campaignId),

    trackAdEvent: (eventData) => {
        const { campaignId, userId, eventType, costInCents, metadata } = eventData;
        return adAnalyticsRepositorio.recordEvent(campaignId, userId, eventType, costInCents, metadata);
    },
};
