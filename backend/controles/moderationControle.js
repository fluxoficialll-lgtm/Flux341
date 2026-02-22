
import * as genai from "@google/genai";

// 1. Inicialização Singleton da IA
let genAI;
if (process.env.API_KEY) {
    genAI = new genai.GoogleGenerativeAI(process.env.API_KEY);
} else {
    console.error("API_KEY for Generative AI is not configured. Moderation service will be disabled.");
}

const moderationControle = {
    /**
     * Analisa conteúdo usando IA para garantir a integridade da plataforma.
     */
    analyzeContent: async (req, res) => {
        req.logger.log('MODERATION_ANALYZE_START', { body: req.body });

        // 2. Melhor Tratamento de Erro para API Key Ausente
        if (!genAI) {
            req.logger.error('MODERATION_ERROR', { error: "AI service is not configured (API_KEY missing)" });
            return res.status(503).json({ error: "MODERATION_SERVICE_UNAVAILABLE" });
        }

        try {
            const { text, userEmail } = req.body;
            
            const prompt = `
                Analise o seguinte texto para determinar se ele contém conteúdo adulto, discurso de ódio, ou violação de termos de serviço.
                Responda APENAS com um objeto JSON com o formato: {"isAdult": boolean, "reason": "string"}.
                'reason' pode ser: "SAFE", "ADULT_CONTENT", "HATE_SPEECH", "TERMS_VIOLATION".
                Texto para análise: "${text}"
            `;

            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash-preview",
                generationConfig: { responseMimeType: "application/json" }
            });

            const result = await model.generateContent(prompt);
            const response = result.response;
            const analysis = JSON.parse(response.text());

            req.logger.log('MODERATION_ANALYZE_SUCCESS', { userEmail, analysis });
            res.json(analysis);

        } catch (error) {
            req.logger.error('MODERATION_AI_ERROR', { 
                error: error.message, 
                stack: error.stack,
                userEmail: req.body.userEmail
            });

            res.status(500).json({ isAdult: false, error: "MODERATION_FAILED" });
        }
    }
};

export default moderationControle;
