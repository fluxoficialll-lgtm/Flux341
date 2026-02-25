
import fs from 'fs';
import path from 'path';
import { fileURLToPath as fileURLToPath_log } from 'url';

// --- Início do Código de Log Personalizado ---
const __filename_log = fileURLToPath_log(import.meta.url);
const __dirname_log = path.dirname(__filename_log);
const logDir = path.join(__dirname_log, 'logs');

// Cria o diretório de log se não existir
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logFile = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

// Salva as funções originais do console
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;

const logTimestamp = () => `[${new Date().toISOString()}]`;

// Sobrescreve as funções do console para escrever em arquivo
console.log = (...args) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
    logFile.write(`${logTimestamp()} [LOG] ${message}\n`);
    originalLog.apply(console, args); // Mantém o log no terminal também
};

console.error = (...args) => {
    const message = args.map(arg => arg instanceof Error ? arg.stack : (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ');
    logFile.write(`${logTimestamp()} [ERROR] ${message}\n`);
    originalError.apply(console, args);
};

console.warn = (...args) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
    logFile.write(`${logTimestamp()} [WARN] ${message}\n`);
    originalWarn.apply(console, args);
};

console.info = (...args) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
    logFile.write(`${logTimestamp()} [INFO] ${message}\n`);
    originalInfo.apply(console, args);
};

process.on('uncaughtException', (err, origin) => {
    console.error(`Exceção Não Capturada: ${err.message}`, { stack: err.stack, origin });
    // O fs.writeSync garante que o log seja escrito antes de sair
    fs.writeSync(logFile.fd, `${logTimestamp()} [FATAL] Uncaught Exception: ${err.stack}\n`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejeição de Promise Não Tratada:', reason);
    fs.writeSync(logFile.fd, `${logTimestamp()} [FATAL] Unhandled Rejection: ${reason}\n`);
});

console.log('--- Sistema de Log em Arquivo Inicializado. Saída será gravada em logs/app.log ---');
// --- Fim do Código de Log Personalizado ---


import 'dotenv/config';
import express from 'express';
// import path from 'path'; // Já importado acima
// import fs from 'fs'; // Já importado acima
import http from 'http';
import { fileURLToPath } from 'url';

// Importe a função de migração
import { run as runMigrations } from './scripts/executar-migracoes.js';

// Configurações Modulares
import { initSocket } from './backend/config/socket.js';
import { setupMiddlewares } from './backend/config/middleware.js';
import { upload } from './backend/config/storage.js';

// Serviços, Rotas e Tarefas de Inicialização
import { db } from './backend/database/InicializacaoDoPostgreSQL.js';
// import { IntegrityCheck } from './backend/jobs/IntegrityCheck.js'; // Desativado temporariamente
import apiRoutes from './backend/RotasBackend/Rotas.js';
import { contarBancosDeDados } from './backend/database/ContagemDosTiposDeBancos.js';
import { auditorDoPostgreSQL } from './backend/database/AuditoresDeBancos/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

// Inicialização da Infraestrutura e Middlewares
const io = initSocket(httpServer);
setupMiddlewares(app, io);

// --- ROTAS DE API ---
app.use('/api', apiRoutes);

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        req.logger.warn('UPLOAD_FAILURE', { reason: 'No file uploaded' });
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    try {
        const folder = req.body.folder || 'misc';
        // A lógica de upload foi comentada pois o storageService não foi encontrado
        // const fileUrl = await storageService.uploadFile(req.file, folder);
        // req.logger.log('UPLOAD_SUCCESS', { fileUrl, folder });
        // res.json({ success: true, files: [{ url: fileUrl }] });
        res.status(501).json({ error: 'A funcionalidade de upload está temporariamente desativada.' });
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
        console.warn('FRONTEND_BUILD_MISSING', { path: req.path });
        res.status(404).send('Frontend build not found.');
    }
});

// Tratamento final de erros (Global Catch-All)
app.use((err, req, res, next) => {
    const logger = req.logger || console;
    const traceId = req.traceId || 'untraced-error';

    logger.error('GLOBAL_UNHANDLED_ERROR', {
        error: { message: err.message, stack: err.stack },
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

// Função de inicialização da aplicação
const startApp = async () => {
    try {
        // 1. Executar as migrações do banco de dados
        await runMigrations();
        console.log('MIGRATION_SUCCESS', { message: 'Migrações do banco de dados aplicadas com sucesso.' });

        // 2. Inicializar o sistema de banco de dados
        await db.init();
        console.log('DB_INIT', { message: 'Database system initialized successfully.' });

        // 3. Agendar tarefas de manutenção (não bloqueiam a inicialização)
        setTimeout(() => {
            contarBancosDeDados();
            auditorDoPostgreSQL.inspectDatabases();
            // IntegrityCheck.fixGroupMemberCounts(); // Desativado temporariamente
            // IntegrityCheck.cleanupExpiredVip(); // Desativado temporariamente
        }, 5000);

        setInterval(() => {
            // IntegrityCheck.fixGroupMemberCounts(); // Desativado temporariamente
        }, 1000 * 60 * 60);

        // 4. Iniciar o servidor HTTP
        httpServer.listen(PORT, '0.0.0.0', () => {
            console.log('SERVER_START', { port: PORT, env: process.env.NODE_ENV });
        });

    } catch (error) {
        console.error('APP_STARTUP_FAILURE', {
            error: { message: error.message, stack: error.stack },
            reason: 'Falha crítica durante a inicialização da aplicação.'
        });
        process.exit(1);
    }
};

// Iniciar a aplicação
startApp();
