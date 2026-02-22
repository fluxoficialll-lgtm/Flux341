
import express from 'express';
import messagesControle from '../controles/messagesControle.js';

const router = express.Router();

// Listar todas as conversas de um usuário
router.get('/', messagesControle.listConversations);

// Buscar mensagens de uma conversa específica
router.get('/:conversationId', messagesControle.getMessages);

// Enviar uma mensagem
router.post('/send', messagesControle.sendMessage);

// Deletar mensagens
router.delete('/messages', messagesControle.deleteMessages);

export default router;
