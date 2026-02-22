
import { moderationService } from '../ServiçosBackEnd/moderationService.js';

const moderationControle = {
    /**
     * Analisa conteúdo usando IA para garantir a integridade da plataforma.
     */
    analyzeContent: async (req, res) => {
        try {
            const analysis = await moderationService.analyzeContent(req.body, req.traceId);
            
            // Se o serviço retornou um erro interno (ex: MODERATION_FAILED), pode ser melhor retornar um status 500.
            if (analysis.error) {
                return res.status(500).json(analysis);
            }
            
            res.json(analysis);

        } catch (error) {
            // Captura erros lançados pelo serviço, como a indisponibilidade da IA (503)
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};

export default moderationControle;
