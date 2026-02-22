
import { trackingService } from '../ServiçosBackEnd/trackingService.js';

const trackingControle = {
    /**
     * Hub universal para eventos Server-Side.
     */
    handleCapiEvent: async (req, res) => {
        try {
            const result = await trackingService.handleCapiEvent(req.body, req.traceId);
            res.json(result);
        } catch (e) {
            // O serviço pode definir um statusCode específico (ex: 202 para falhas de CAPI)
            res.status(e.statusCode || 500).json({ status: "FAILED", error: e.message });
        }
    },

    /**
     * Obtém informações de pixel de marketing para um usuário.
     */
    getPixelInfo: async (req, res) => {
        try {
            const { ref } = req.query;
            const pixelInfo = await trackingService.getPixelInfo(ref, req.traceId);
            res.json(pixelInfo);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    }
};

export default trackingControle;
