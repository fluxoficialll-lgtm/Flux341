
import { adService } from '../ServiçosBackEnd/adService.js';

const adsControle = {
    createCampaign: async (req, res) => {
        try {
            const campaign = await adService.createCampaign(req.body, req.userId, req.traceId);
            res.status(201).json(campaign);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    getCampaigns: async (req, res) => {
        try {
            const campaigns = await adService.getCampaigns(req.userId);
            res.json(campaigns);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    getCampaignById: async (req, res) => {
        try {
            const campaign = await adService.getCampaignById(req.params.id);
            if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada.' });
            res.json(campaign);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    updateCampaign: async (req, res) => {
        try {
            const updatedCampaign = await adService.updateCampaign(req.params.id, req.body, req.traceId);
            res.json(updatedCampaign);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    addBudgetToCampaign: async (req, res) => {
        try {
            const result = await adService.addBudgetToCampaign(req.params.id, req.body.amount, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    deleteCampaign: async (req, res) => {
        try {
            await adService.deleteCampaign(req.params.id, req.traceId);
            res.status(204).send();
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    getCampaignPerformance: async (req, res) => {
        try {
            const metrics = await adService.getCampaignPerformance(req.params.id);
            res.json(metrics);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    trackAdEvent: async (req, res) => {
        try {
            await adService.trackAdEvent({ ...req.body, userId: req.userId });
            res.status(202).json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default adsControle;
