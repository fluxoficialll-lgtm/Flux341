
import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

// Configurações Modulares
import { initSocket } from './backend/config/socket.js';
import { setupMiddlewares } from './backend/config/middleware.js';
import { upload } from './backend/config/storage.js';

// Logging Centralizado
import { LogDeOperacoes } from './backend/ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

// Serviços, Rotas e Tarefas de Inicialização
import { db } from './backend/database/InicializaçãoDoPostgreSQL.js';
import { storageService } from './backend/ServiçosBackEnd/storageService.js';
import { IntegrityCheck } from './backend/jobs/IntegrityCheck.js';
import apiRoutes from './backend/routes.js';
import { contarBancosDeDados } from './backend/database/ContagemDosTiposDeBancos.js';
import { auditorDoPostgreSQL } from './backend/database/AuditoresDeBancos/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

// 1. Inicialização da Infraestrutura e Middlewares
const io = initSocket(httpServer);
setupMiddlewares(app, io); // Inclui o middleware de logging que injeta req.logger

// 2. Inicialização do Banco de Dados e Tarefas de Manutenção
db.init()
    .then(() => {
        LogDeOperacoes.log('DB_INIT', { message: 'Database system initialized successfully.' });

        // Executa tarefas de auditoria e manutenção após a inicialização
        setTimeout(() => {
            // <<< SUAS FUNÇÕES SERÃO EXECUTADAS AQUI >>>
            contarBancosDeDados();
            auditorDoPostgreSQL.inspectDatabases();
            
            // Funções de integridade já existentes
            IntegrityCheck.fixGroupMemberCounts();
            IntegrityCheck.cleanupExpiredVip();
        }, 5000);

        // Tarefa de manutenção recorrente
        setInterval(() => {
            IntegrityCheck.fixGroupMemberCounts();
        }, 1000 * 60 * 60);
    })
    .catch(err => {
        LogDeOperacoes.fatal('DB_BOOT_ERROR', { error: err });
        process.exit(1); // Encerra a aplicação se o DB não puder ser iniciado
    });

// --- ROTAS DE API ---
app.use('/api', apiRoutes);

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        req.logger.warn('UPLOAD_FAILURE', { reason: 'No file uploaded' });
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    try {
        const folder = req.body.folder || 'misc';
        const fileUrl = await storageService.uploadFile(req.file, folder);
        req.logger.log('UPLOAD_SUCCESS', { fileUrl, folder });
        res.json({ success: true, files: [{ url: fileUrl }] });
    } catch (error) {
        req.logger.error('UPLOAD_CLOUD_ERROR', { error });
        res.status(500).json({ error: 'Erro ao processar upload para nuvem' });
    }
});

// --- SERVIÇO DE ARQUIVOS ESTÁTICOS (SPA) ---
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Tratamento de erro 404 para API (Sempre JSON)
app.use('/api', (req, res) => {
    req.logger.warn('NOT_FOUND', { path: req.path, method: req.method });
    res.status(404).json({
        error: 'Endpoint não encontrado.',
        traceId: req.traceId
    });
});

// Tratamento global de erros da API
app.use((err, req, res, next) => {
    if (req.path.startsWith('/api')) {
        // Usa o logger da requisição para rastreabilidade completa
        req.logger.error('GLOBAL_API_ERROR', { 
            error: { message: err.message, stack: err.stack },
            path: req.path
        });
        return res.status(500).json({ 
            error: 'Erro interno no servidor.', 
            traceId: req.traceId 
        });
    }
    next(err);
});

// Catch-all para SPA (Apenas se NÃO for API)
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        LogDeOperacoes.warn('FRONTEND_BUILD_MISSING', { path: req.path });
        res.status(404).send('Frontend build not found.');
    }
});

// Tratamento final de erros (Global Catch-All)
app.use((err, req, res, next) => {
    const logger = req.logger || LogDeOperacoes; // Usa o logger da requisição se disponível
    const traceId = req.traceId || 'untraced-error';

    logger.error('GLOBAL_UNHANDLED_ERROR', {
        error: {
            message: err.message,
            stack: err.stack
        },
        path: req.path,
        method: req.method,
        traceId: traceId
    });

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Ocorreu um erro inesperado.',
        traceId: traceId
    });
});

httpServer.listen(PORT, '0.0.0.0', () => {
    LogDeOperacoes.log('SERVER_START', { port: PORT, env: process.env.NODE_ENV });
});
