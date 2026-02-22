
import * as genai from "@google/genai";
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

// Inicialização Singleton da IA
let genAI;
if (process.env.API_KEY) {
    genAI = new genai.GoogleGenerativeAI(process.env.API_KEY);
} else {
    console.error("API_KEY for Generative AI is not configured. Moderation service will be disabled.");
}

export const moderationService = {
    /**
     * Analisa conteúdo usando IA para garantir a integridade da plataforma.
     */
    analyzeContent: async ({ text, userEmail }, traceId) => {
        LogDeOperacoes.log('MODERATION_ANALYZE_START', { userEmail }, traceId);

        if (!genAI) {
            const error = new Error("MODERATION_SERVICE_UNAVAILABLE");
            error.statusCode = 503;
            LogDeOperacoes.error('MODERATION_ERROR', { error: "AI service is not configured (API_KEY missing)" }, traceId);
            throw error;
        }

        try {
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

            LogDeOperacoes.log('MODERATION_ANALYZE_SUCCESS', { userEmail, analysis }, traceId);
            return analysis;

        } catch (error) {
            LogDeOperacoes.error('MODERATION_AI_ERROR', { 
                error: error.message, 
                stack: error.stack,
                userEmail
            }, traceId);

            // Mantém a resposta padrão em caso de falha na moderação
            return { isAdult: false, error: "MODERATION_FAILED" };
        }
    }
};
