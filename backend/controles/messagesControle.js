
import { messagesService } from '../ServiçosBackEnd/messagesService.js';

const messagesControle = {
    // Listar todas as conversas de um usuário
    listConversations: async (req, res) => {
        try {
            const conversations = await messagesService.listConversations(req.userId, req.traceId);
            res.json({ chats: conversations });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Buscar mensagens de uma conversa específica
    getMessages: async (req, res) => {
        try {
            const messages = await messagesService.getMessages(req.params.conversationId, req.userId, req.query, req.traceId);
            res.json({ messages });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Enviar uma mensagem
    sendMessage: async (req, res) => {
        try {
            const newMessage = await messagesService.sendMessage({ ...req.body, senderId: req.userId }, req.io, req.traceId);
            res.status(201).json({ success: true, message: newMessage });
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    // Deletar mensagens
    deleteMessages: async (req, res) => {
        try {
            await messagesService.deleteMessages(req.body.messageIds, req.userId, req.body.target, req.traceId);
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default messagesControle;
