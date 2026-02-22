
import { analyticsService } from '../ServiçosBackEnd/analyticsService.js';

const analyticsControle = {
    /**
     * GET /api/analytics/payment-ranking
     */
    getPaymentRanking: async (req, res) => {
        try {
            const { country } = req.query;
            const result = await analyticsService.getPaymentRanking(country, req.logger);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    /**
     * GET /api/analytics/user/:userId/payment-ranking
     */
    getSellerPaymentRanking: async (req, res) => {
        const { userId } = req.params;
        try {
            const result = await analyticsService.getSellerPaymentRanking(userId, req.logger);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    /**
     * POST /api/analytics/log-payment-method
     */
    logPaymentMethod: async (req, res) => {
        try {
            const result = await analyticsService.logPaymentMethod(req.body, req.logger);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    }
};

export default analyticsControle;
