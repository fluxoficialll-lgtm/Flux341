
import { adCampaignRepositorio } from '../GerenciadoresDeDados/ad.campaign.repositorio.js';
import { adAnalyticsRepositorio } from '../GerenciadoresDeDados/ad.analytics.repositorio.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const adsControle = {
    // Criar nova campanha
    createCampaign: async (req, res) => {
        const ownerId = req.userId;
        LogDeOperacoes.log('TENTATIVA_CRIAR_CAMPANHA', { ownerId, body: req.body }, req.traceId);
        try {
            const campaign = await adCampaignRepositorio.create({ ownerId, ...req.body });
            res.status(201).json(campaign);
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIAR_CAMPANHA', { ownerId, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Obter todas as campanhas do usuário logado
    getCampaigns: async (req, res) => {
        const ownerId = req.userId;
        try {
            const campaigns = await adCampaignRepositorio.findByOwner(ownerId);
            res.json(campaigns);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Obter detalhes de uma campanha
    getCampaignById: async (req, res) => {
        try {
            const campaign = await adCampaignRepositorio.findById(req.params.id);
            if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada.' });
            res.json(campaign);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Atualizar campanha
    updateCampaign: async (req, res) => {
        LogDeOperacoes.log('TENTATIVA_ATUALIZAR_CAMPANHA', { campaignId: req.params.id, updates: req.body }, req.traceId);
        try {
            const updatedCampaign = await adCampaignRepositorio.update(req.params.id, req.body);
            res.json(updatedCampaign);
        } catch (e) {
            LogDeOperacoes.error('FALHA_ATUALIZAR_CAMPANHA', { campaignId: req.params.id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Adicionar orçamento (top-up)
    addBudgetToCampaign: async (req, res) => {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: 'Valor inválido.' });
        LogDeOperacoes.log('TENTATIVA_ADICIONAR_ORCAMENTO', { campaignId: req.params.id, amount }, req.traceId);

        try {
            await adCampaignRepositorio.addBudget(req.params.id, amount);
            res.json({ success: true });
        } catch (e) {
            LogDeOperacoes.error('FALHA_ADICIONAR_ORCAMENTO', { campaignId: req.params.id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Deletar campanha
    deleteCampaign: async (req, res) => {
        LogDeOperacoes.log('TENTATIVA_DELETAR_CAMPANHA', { campaignId: req.params.id }, req.traceId);
        try {
            await adCampaignRepositorio.delete(req.params.id);
            res.status(204).send();
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_CAMPANHA', { campaignId: req.params.id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Endpoint de Performance
    getCampaignPerformance: async (req, res) => {
        try {
            const metrics = await adAnalyticsRepositorio.getPerformanceMetrics(req.params.id);
            res.json(metrics);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Registrar evento (View/Click)
    trackAdEvent: async (req, res) => {
        const { campaignId, eventType, costInCents, metadata } = req.body;
        const userId = req.userId; // pode ser nulo

        try {
            await adAnalyticsRepositorio.recordEvent(campaignId, userId, eventType, costInCents, metadata);
            res.status(202).json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default adsControle;
