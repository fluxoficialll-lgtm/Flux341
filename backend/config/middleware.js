
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import crypto from 'crypto';
// import { LogDeOperacoes } from '../ServicosBackEnd/ServicosDeLogsSofisticados/LogDeOperacoes.js';

/**
 * Cria um "child logger" para uma requisição específica, com o traceId já embutido.
 * Isso evita a necessidade de passar o traceId manualmente em cada chamada de log.
 * @param {string} traceId - O ID de rastreamento da requisição.
 * @returns {object} - Um objeto logger com os métodos (log, error, etc.) pré-configurados.
 */
const createRequestLogger = (traceId) => {
    const requestLogger = {};
    // for (const level in LogDeOperacoes) {
    //     if (typeof LogDeOperacoes[level] === 'function') {
    //         requestLogger[level] = (contexto, data = {}) => {
    //             LogDeOperacoes[level](contexto, data, traceId);
    //         };
    //     }
    // }
    // return requestLogger;
    // Mock logger since the original is missing
    const levels = ['log', 'error', 'warn', 'debug'];
    levels.forEach(level => {
        requestLogger[level] = (contexto, data) => {
            console.log(`[${level.toUpperCase()}] (${traceId}) ${contexto}`, data);
        };
    });
    return requestLogger;
};

export const setupMiddlewares = (app, io) => {
    // Configurações de segurança e otimização
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        referrerPolicy: { policy: "no-referrer-when-downgrade" }
    }));
    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action', 'X-Protocol-Version'],
        exposedHeaders: ['X-Flux-Trace-ID']
    }));
    app.use(compression());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.set('trust proxy', 1);

    // Middleware Central de Logging e Contexto
    app.use((req, res, next) => {
        const start = Date.now();

        // 1. Geração e atribuição do Trace ID
        const traceId = req.headers['x-flux-trace-id'] || crypto.randomUUID();
        req.traceId = traceId; // Anexa à requisição para uso interno
        res.setHeader('X-Flux-Trace-ID', traceId); // Expõe no header da resposta

        // 2. Criação do Logger específico para a requisição
        req.logger = createRequestLogger(traceId);
        
        // Anexa o objeto 'io' do Socket.IO à requisição para uso nos controllers
        req.io = io;

        // 3. Log de Requisição de Entrada (Inbound)
        if (req.method === 'OPTIONS') {
            req.logger.debug('CORS_PREFLIGHT', { method: req.method, path: req.path, origin: req.headers.origin });
        } else {
            req.logger.log('INBOUND_REQUEST', { 
                method: req.method, 
                path: req.path, 
                ip: req.ip, 
                clientId: req.headers['x-flux-client-id'] 
            });
        }

        // 4. Interceptor de Resposta para Log de Saída (Outbound)
        res.on('finish', () => {
            const duration = Date.now() - start;
            const { statusCode } = res;

            const logData = {
                method: req.method,
                path: req.path,
                statusCode,
                duration_ms: duration,
            };

            if (statusCode >= 500) {
                // Erros de servidor são sempre 'error' ou 'fatal'
                req.logger.error('OUTBOUND_RESPONSE', logData);
            } else if (statusCode >= 400) {
                // Erros do cliente (4xx) são 'warn'
                req.logger.warn('OUTBOUND_RESPONSE', logData);
            } else {
                // Sucessos (2xx, 3xx) são 'info'
                req.logger.log('OUTBOUND_RESPONSE', logData);
            }
        });

        next();
    });
};
