
import { userRepositorio } from '../GerenciadoresDeDados/user.repositorio.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const usersControle = {
    // Endpoint de busca de usuários
    searchUsers: async (req, res) => {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        
        LogDeOperacoes.log('TENTATIVA_BUSCA_USUARIO', { query: q }, req.traceId);

        try {
            const users = await userRepositorio.search(q);
            LogDeOperacoes.log('SUCESSO_BUSCA_USUARIO', { query: q, resultsCount: users.length }, req.traceId);
            res.json(users);
        } catch (e) { 
            LogDeOperacoes.error('FALHA_BUSCA_USUARIO', { query: q, error: e }, req.traceId);
            res.status(500).json({ error: e.message }); 
        }
    },

    // Endpoint para obter um usuário para atualização
    getUserForUpdate: async (req, res) => {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }

        LogDeOperacoes.log('TENTATIVA_GET_USUARIO_PARA_UPDATE', { email }, req.traceId);

        try {
            const user = await userRepositorio.findByEmail(email);
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
    },

    // Endpoint para atualizar um usuário
    updateUser: async (req, res) => {
        const { email, updates } = req.body;
        if (!email || !updates) {
            return res.status(400).json({ error: 'Email e updates são obrigatórios' });
        }

        LogDeOperacoes.log('TENTATIVA_ATUALIZACAO_USUARIO', { email, fields: Object.keys(updates) }, req.traceId);

        try {
            const updatedUser = await userRepositorio.update(email, updates);
            if (updatedUser) {
                LogDeOperacoes.log('SUCESSO_ATUALIZACAO_USUARIO', { userId: updatedUser.id, email, fields: Object.keys(updates) }, req.traceId);
                res.json({ user: updatedUser });
            } else { 
                LogDeOperacoes.warn('ATUALIZACAO_USUARIO_NAO_ENCONTRADO', { email }, req.traceId);
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (e) { 
            LogDeOperacoes.error('FALHA_ATUALIZACAO_USUARIO', { email, error: e }, req.traceId);
            res.status(500).json({ error: e.message }); 
        }
    }
};

export default usersControle;
