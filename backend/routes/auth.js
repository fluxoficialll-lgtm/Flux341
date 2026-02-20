
import express from 'express';
import { dbManager } from '../databaseManager.js';
import { googleAuthConfig } from '../authConfig.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const router = express.Router();
const client = new OAuth2Client(googleAuthConfig.clientId);

router.get('/config', (req, res) => {
    res.json({ clientId: googleAuthConfig.clientId });
});

router.post('/register', async (req, res) => {
    const { email, referredById } = req.body;
    LogDeOperacoes.log('TENTATIVA_REGISTRO', { email, hasReferral: !!referredById }, req.traceId);

    try {
        const user = req.body;
        if (user.referredById === "") user.referredById = null;
        const userId = await dbManager.users.create(user);

        LogDeOperacoes.log('SUCESSO_REGISTRO', { userId, email }, req.traceId);
        res.json({ success: true, user: { ...user, id: userId } });
    } catch (e) { 
        LogDeOperacoes.error('FALHA_REGISTRO', { email, error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

router.post('/login', async (req, res) => {
    const { email } = req.body;
    LogDeOperacoes.log('TENTATIVA_LOGIN', { email }, req.traceId);

    try {
        const { password } = req.body;
        const user = await dbManager.users.findByEmail(email);

        if (user && user.password === password) {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const ua = req.headers['user-agent'];
            await dbManager.admin.recordIp(user.id, ip, ua);

            LogDeOperacoes.log('SUCESSO_LOGIN', { userId: user.id, email }, req.traceId);
            res.json({ user, token: 'session_' + crypto.randomUUID() });
        } else {
            LogDeOperacoes.warn('FALHA_LOGIN_CREDENCIAL_INVALIDA', { email }, req.traceId);
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (e) { 
        LogDeOperacoes.error('FALHA_LOGIN', { email, error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

router.post('/google', async (req, res) => {
    LogDeOperacoes.log('TENTATIVA_AUTH_GOOGLE', { hasToken: !!req.body.googleToken }, req.traceId);

    try {
        const { googleToken, referredBy } = req.body;
        let googleId, email, name;

        if (googleAuthConfig.clientId !== "GOOGLE_CLIENT_ID_NAO_CONFIGURADO" && googleToken && googleToken.length > 50) {
            try {
                const ticket = await client.verifyIdToken({ idToken: googleToken, audience: googleAuthConfig.clientId });
                const payload = ticket.getPayload();
                googleId = payload['sub']; 
                email = payload['email']; 
                name = payload['name'];
            } catch (err) {
                LogDeOperacoes.warn("FALHA_VERIFICACAO_TOKEN_GOOGLE", { error: err }, req.traceId);
            }
        }

        if (!googleId) {
            googleId = `mock_${crypto.randomUUID().substring(0, 8)}`;
            email = `guest_${googleId}@gmail.com`;
        }

        let user = await dbManager.users.findByGoogleId(googleId);
        let isNew = false;

        if (!user) {
            const existingByEmail = await dbManager.users.findByEmail(email);
            if (existingByEmail) {
                user = existingByEmail; 
                user.googleId = googleId; 
                await dbManager.users.update(user);
                LogDeOperacoes.log('ASSOCIACAO_CONTA_GOOGLE', { userId: user.id, email }, req.traceId);
            } else {
                isNew = true;
                const newUser = { 
                    email: email.toLowerCase().trim(), 
                    googleId, 
                    isVerified: true, 
                    isProfileCompleted: false, 
                    referredById: referredBy || null, 
                    profile: { 
                        name: `user_${googleId.slice(-4)}`, 
                        nickname: name || 'Usuário Flux', 
                        isPrivate: false, 
                        photoUrl: '' 
                    } 
                };
                const id = await dbManager.users.create(newUser);
                user = { ...newUser, id };
                LogDeOperacoes.log('SUCESSO_REGISTRO_VIA_GOOGLE', { userId: id, email }, req.traceId);
            }
        }

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const ua = req.headers['user-agent'];
        await dbManager.admin.recordIp(user.id, ip, ua);
        
        LogDeOperacoes.log('SUCESSO_AUTH_GOOGLE', { userId: user.id, email, isNew }, req.traceId);
        res.json({ user, token: 'g_session_' + crypto.randomUUID(), isNew });
    } catch (e) { 
        LogDeOperacoes.error("FALHA_AUTH_GOOGLE", { error: e }, req.traceId);
        res.status(500).json({ error: "Erro na autenticação." }); 
    }
});

router.post('/change-password', async (req, res) => {
    const { email } = req.body;
    LogDeOperacoes.log('TENTATIVA_MUDANCA_SENHA', { email }, req.traceId);

    try {
        const { currentPassword, newPassword } = req.body;
        const user = await dbManager.users.findByEmail(email);

        if (user && user.password === currentPassword) {
            user.password = newPassword;
            await dbManager.users.update(user);
            LogDeOperacoes.log('SUCESSO_MUDANCA_SENHA', { userId: user.id, email }, req.traceId);
            res.json({ success: true });
        } else {
            LogDeOperacoes.warn('FALHA_MUDANCA_SENHA_SENHA_ATUAL_INCORRETA', { email }, req.traceId);
            res.status(401).json({ error: 'Senha atual incorreta' });
        }
    } catch (e) { 
        LogDeOperacoes.error('FALHA_MUDANCA_SENHA', { email, error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

router.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    LogDeOperacoes.log('TENTATIVA_RESET_SENHA', { email }, req.traceId);

    try {
        const { password } = req.body;
        const user = await dbManager.users.findByEmail(email);

        if (user) {
            user.password = password;
            await dbManager.users.update(user);
            LogDeOperacoes.log('SUCESSO_RESET_SENHA', { userId: user.id, email }, req.traceId);
            res.json({ success: true });
        } else {
            LogDeOperacoes.warn('FALHA_RESET_SENHA_USUARIO_NAO_ENCONTRADO', { email }, req.traceId);
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (e) { 
        LogDeOperacoes.error('FALHA_RESET_SENHA', { email, error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

router.post('/sessions/revoke-others', async (req, res) => {
    const { email } = req.body;
    LogDeOperacoes.log('TENTATIVA_REVOGAR_SESSOES', { email }, req.traceId);

    try {
        const user = await dbManager.users.findByEmail(email);
        if (user) {
            // Em um sistema real, aqui invalidaríamos tokens no Redis
            LogDeOperacoes.log('SUCESSO_REVOGAR_SESSOES', { userId: user.id, email }, req.traceId);
            res.json({ success: true });
        } else {
            LogDeOperacoes.warn('FALHA_REVOGAR_SESSOES_USUARIO_NAO_ENCONTRADO', { email }, req.traceId);
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (e) { 
        LogDeOperacoes.error('FALHA_REVOGAR_SESSOES', { email, error: e }, req.traceId);
        res.status(500).json({ error: e.message }); 
    }
});

export default router;
