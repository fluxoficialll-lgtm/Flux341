
import { paymentsService } from '../ServiçosBackEnd/paymentsService.js';

const paymentsControle = {
    processSaleSuccess: async (req, res) => {
        try {
            const result = await paymentsService.processSaleSuccess(req.body, {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                io: req.io,
                traceId: req.traceId
            });
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default paymentsControle;
