
import { conversationRepositorio } from '../GerenciadoresDeDados/conversation.repositorio.js';
import { messageRepositorio } from '../GerenciadoresDeDados/message.repositorio.js';
import { LogDeOperacoes } from './ServiçosDeLogsSofisticados/LogDeOperacoes.js';

export const messagesService = {
    /**
     * Lists all conversations for a specific user.
     */
    listConversations: async (userId, traceId) => {
        LogDeOperacoes.log('TENTATIVA_LISTAR_CONVERSAS', { userId }, traceId);
        try {
            const conversations = await conversationRepositorio.listForUser(userId);
            return conversations;
        } catch (e) {
            LogDeOperacoes.error('FALHA_LISTAR_CONVERSAS', { userId, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Retrieves messages from a specific conversation.
     */
    getMessages: async (conversationId, userId, { limit, offset }, traceId) => {
        LogDeOperacoes.log('TENTATIVA_BUSCAR_MENSAGENS', { userId, conversationId }, traceId);
        try {
            const messages = await messageRepositorio.findByConversationId(conversationId, userId, limit, offset);
            return messages;
        } catch (e) {
            LogDeOperacoes.error('FALHA_BUSCAR_MENSAGENS', { userId, conversationId, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Sends a message.
     */
    sendMessage: async ({ senderId, conversationId, content, isGroup, recipientId, groupId }, io, traceId) => {
        LogDeOperacoes.log('TENTATIVA_ENVIAR_MENSAGEM', { senderId, conversationId, isGroup, recipientId }, traceId);
        try {
            let convId = conversationId;

            if (!isGroup && !convId) {
                if (!recipientId) throw new Error('recipientId é obrigatório para novas DMs.');
                const conversation = await conversationRepositorio.findOrCreatePrivateConversation(senderId, recipientId);
                convId = conversation.id;
            }

            if (isGroup && !convId) {
                if (!groupId) throw new Error('groupId é obrigatório para mensagens de grupo.');
                const conversation = await conversationRepositorio.findByGroupId(groupId);
                if (!conversation) throw new Error('Conversa de grupo não encontrada.');
                convId = conversation.id;
            }

            const newMessage = await messageRepositorio.create(senderId, convId, content);

            if (io) {
                io.to(convId).emit('new_message', { conversationId: convId, message: newMessage });
            }

            LogDeOperacoes.log('SUCESSO_ENVIAR_MENSAGEM', { senderId, conversationId: convId }, traceId);
            return newMessage;

        } catch (e) {
            LogDeOperacoes.error('FALHA_ENVIAR_MENSAGEM', { senderId, error: e }, traceId);
            throw e;
        }
    },

    /**
     * Deletes messages for a user.
     */
    deleteMessages: async (messageIds, userId, target, traceId) => {
        LogDeOperacoes.log('TENTATIVA_DELETAR_MENSAGENS', { userId, count: messageIds.length, target }, traceId);
        try {
            await messageRepositorio.deleteMessages(messageIds, userId, target === 'all');
            return { success: true };
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_MENSAGENS', { userId, error: e }, traceId);
            throw e;
        }
    }
};
