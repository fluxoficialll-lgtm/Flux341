
import { usersService } from '../ServiçosBackEnd/usersService.js';

const usersControle = {
    // Endpoint de busca de usuários
    searchUsers: async (req, res) => {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }

        try {
            const users = await usersService.searchUsers(q, req.traceId);
            res.json(users);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Endpoint para obter um usuário para atualização
    getUserForUpdate: async (req, res) => {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }

        try {
            const user = await usersService.getUserForUpdate(email, req.traceId);
            if (user) {
                res.json({ user });
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Endpoint para atualizar um usuário
    updateUser: async (req, res) => {
        const { email, updates } = req.body;
        if (!email || !updates) {
            return res.status(400).json({ error: 'Email e updates são obrigatórios' });
        }

        try {
            const updatedUser = await usersService.updateUser(email, updates, req.traceId);
            if (updatedUser) {
                res.json({ user: updatedUser });
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default usersControle;
