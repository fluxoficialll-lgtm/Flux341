
import express from 'express';
import { dbManager } from '../databaseManager.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const router = express.Router();

router.get('/sync', async (req, res) => {
    // Log de depuração para uma rota potencialmente ruidosa.
    LogDeOperacoes.debug('TENTATIVA_SYNC_USUARIOS', {}, req.traceId);
    try {
        const users = await dbManager.users.getAll();
        res.json({ users });
    } catch (e) { 
        LogDeOperacoes.error('FALHA_SYNC_USUARIOS', { error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    LogDeOperacoes.log('TENTATIVA_BUSCA_USUARIO', { query: q }, req.traceId);

    try {
        const users = await dbManager.users.getAll();
        const filtered = users.filter(u => 
            u.profile?.name?.toLowerCase().includes(q.toLowerCase()) || 
            u.profile?.nickname?.toLowerCase().includes(q.toLowerCase())
        );
        LogDeOperacoes.log('SUCESSO_BUSCA_USUARIO', { query: q, resultsCount: filtered.length }, req.traceId);
        res.json(filtered);
    } catch (e) { 
        LogDeOperacoes.error('FALHA_BUSCA_USUARIO', { query: q, error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

router.get('/update', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

    LogDeOperacoes.log('TENTATIVA_GET_USUARIO_PARA_UPDATE', { email }, req.traceId);

    try {
        const user = await dbManager.users.findByEmail(email);
        if (user) {
            LogDeOperacoes.log('SUCESSO_GET_USUARIO_PARA_UPDATE', { userId: user.id, email }, req.traceId);
            res.json({ user });
        } else {
            LogDeOperacoes.warn('GET_USUARIO_PARA_UPDATE_NAO_ENCONTRADO', { email }, req.traceId);
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (e) { 
        LogDeOperacoes.error('FALHA_GET_USUARIO_PARA_UPDATE', { email, error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

router.put('/update', async (req, res) => {
    const { email, updates } = req.body;
    LogDeOperacoes.log('TENTATIVA_ATUALIZACAO_USUARIO', { email, fields: Object.keys(updates) }, req.traceId);

    try {
        const user = await dbManager.users.findByEmail(email);
        if (user) {
            const updated = { ...user, ...updates };
            await dbManager.users.update(updated);
            LogDeOperacoes.log('SUCESSO_ATUALIZACAO_USUARIO', { userId: user.id, email, fields: Object.keys(updates) }, req.traceId);
            res.json({ user: updated });
        } else { 
            LogDeOperacoes.warn('ATUALIZACAO_USUARIO_NAO_ENCONTRADO', { email }, req.traceId);
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (e) { 
        LogDeOperacoes.error('FALHA_ATUALIZACAO_USUARIO', { email, error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

export default router;
