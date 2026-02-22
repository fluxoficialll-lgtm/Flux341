
import { facebookCapi } from '../ServiçosBackEnd/facebookCapi.js';
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';

const trackingControle = {
    /**
     * Hub universal para eventos Server-Side.
     */
    handleCapiEvent: async (req, res) => {
        try {
            const { platform, pixelId, accessToken, eventName, eventData, userData, eventId, url } = req.body;

            if (platform === 'meta' || !platform) {
                const result = await facebookCapi.sendEvent({
                    pixelId,
                    accessToken,
                    eventName,
                    eventData,
                    userData,
                    eventId,
                    url
                });
                return res.json({ success: true, platform: 'meta', trace_id: result.fb_trace_id });
            }

            res.status(400).json({ error: "PLATFORM_NOT_SUPPORTED" });
        } catch (e) {
            console.warn(`[Tracking Hub Error]: ${e.message}`);
            res.status(202).json({ status: "FAILED", error: e.message });
        }
    },

    /**
     * Refatorado para usar o userRepositorio.
     */
    getPixelInfo: async (req, res) => {
        try {
            const { ref } = req.query;
            if (!ref) return res.status(400).json({ error: "REF_REQUIRED" });

            const user = await userRepositorio.findByEmail(ref) || await userRepositorio.findByHandle(ref);

            if (user && user.marketingConfig?.pixelId) {
                return res.json({
                    pixelId: user.marketingConfig.pixelId,
                    tiktokId: user.marketingConfig.tiktokId
                });
            }

            res.json({ pixelId: process.env.VITE_PIXEL_ID || "" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default trackingControle;
