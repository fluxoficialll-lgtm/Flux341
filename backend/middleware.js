
import crypto from 'crypto';
import { LogDeOperacoes } from './ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

/**
 * Middleware para adicionar um ID de rastreamento (Trace ID) a cada requisição.
 * Isso permite correlacionar todos os logs gerados por uma única chamada de API.
 */
export const addTraceId = (req, res, next) => {
    const traceId = crypto.randomUUID();
    req.traceId = traceId;
    res.setHeader('X-Trace-Id', traceId);
    next();
};

/**
 * Middleware para validar o token de administrador.
 * Agora utiliza o logger estruturado com Trace ID.
 */
export const validateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const expectedToken = process.env.VITE_ADMIN_TOKEN || 'ADMIN_TOKEN_V3';
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
        // Usando o novo logger com o traceId da requisição
        LogDeOperacoes.warn(
            'ACESSO_ADMIN_RECUSADO',
            { 
                reason: 'Token de administrador inválido ou ausente',
                path: req.originalUrl,
                ip: req.ip
            },
            req.traceId // Passando o Trace ID para correlação
        );
        return res.status(401).json({ error: 'Não autorizado. Token de administrador inválido ou ausente.' });
    }
    
    // Log de acesso autorizado para auditoria
    LogDeOperacoes.log(
        'ACESSO_ADMIN_AUTORIZADO',
        { 
            path: req.originalUrl,
            ip: req.ip
        },
        req.traceId
    );
    
    next();
};
