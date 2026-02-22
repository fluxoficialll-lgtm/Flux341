
import { eventsService } from '../ServiçosBackEnd/eventsService.js';

const eventsControle = {
    /**
     * POST /api/events/ingest
     */
    ingestEvent: async (req, res) => {
        try {
            const result = eventsService.ingestEvent(req.body);
            res.status(202).json(result);
        } catch (e) {
            res.status(500).json({ error: "COLLECTOR_BUSY" });
        }
    },

    /**
     * GET /api/events/health
     */
    getHealth: (req, res) => {
        try {
            const healthStatus = eventsService.getHealth();
            res.json(healthStatus);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default eventsControle;
