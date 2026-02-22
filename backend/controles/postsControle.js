
import { postRepositorio } from '../GerenciadoresDeDados/post.repositorio.js';
import { interactionRepositorio } from '../GerenciadoresDeDados/interaction.repositorio.js';
import { LogDeOperacoes } from '../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const postsControle = {
    // Listar Posts (Feed) com Paginação
    listPosts: async (req, res) => {
        const { limit, cursor } = req.query;
        LogDeOperacoes.log('TENTATIVA_LISTAR_POSTS', { limit: Number(limit) || 50, fromCursor: cursor }, req.traceId);

        try {
            const posts = await postRepositorio.list(Number(limit) || 50, cursor);
            
            let nextCursor = null;
            if (posts.length > 0) {
                nextCursor = posts[posts.length - 1].createdAt.toISOString();
            }

            res.json({ data: posts, nextCursor });
        } catch (e) {
            LogDeOperacoes.error('FALHA_LISTAR_POSTS', { error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Criar Post
    createPost: async (req, res) => {
        const { id, authorId } = req.body;
        LogDeOperacoes.log('TENTATIVA_CRIACAO_POST', { postId: id, authorId }, req.traceId);

        try {
            if (!id || !authorId) {
                LogDeOperacoes.warn('FALHA_CRIACAO_POST_DADOS_INVALIDOS', { postId: id, authorId }, req.traceId);
                return res.status(400).json({ error: "ID e authorId são obrigatórios" });
            }
            await postRepositorio.create(req.body);
            LogDeOperacoes.log('SUCESSO_CRIACAO_POST', { postId: id, authorId }, req.traceId);
            res.status(201).json({ success: true });
        } catch (e) {
            LogDeOperacoes.error('FALHA_CRIACAO_POST', { postId: id, authorId, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Interagir (Like / Unlike) com um Post
    interactWithPost: async (req, res) => {
        const { id } = req.params;
        const { type, userId, action } = req.body; // action pode ser 'remove' para unlike
        LogDeOperacoes.log('TENTATIVA_INTERACAO_POST', { postId: id, userId, type, action }, req.traceId);

        try {
            if (!userId || !type) {
                LogDeOperacoes.warn('FALHA_INTERACAO_POST_DADOS_INVALIDOS', { postId: id, userId, type }, req.traceId);
                return res.status(400).json({ error: "userId e type são obrigatórios" });
            }
            
            let success = false;
            if (action === 'remove' && type === 'like') {
                success = await interactionRepositorio.removeInteraction(id, userId, type);
            } else if (type === 'like') {
                success = await interactionRepositorio.recordUniqueInteraction(id, userId, type);
            }
            
            LogDeOperacoes.log('SUCESSO_INTERACAO_POST', { postId: id, userId, type, action, processed: success }, req.traceId);
            res.json({ success, message: success ? "Interação processada" : "Interação ignorada (duplicada ou inexistente)" });
        } catch (e) {
            LogDeOperacoes.error('FALHA_INTERACAO_POST', { postId: id, userId, type, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Adicionar Comentário
    addComment: async (req, res) => {
        const { id } = req.params;
        const { comment } = req.body;
        LogDeOperacoes.log('TENTATIVA_ADICIONAR_COMENTARIO', { postId: id, authorId: comment?.authorId }, req.traceId);

        try {
            if (!comment || !comment.authorId) {
                LogDeOperacoes.warn('FALHA_COMENTARIO_DADOS_INVALIDOS', { postId: id }, req.traceId);
                return res.status(400).json({ error: "Objeto de comentário com authorId é obrigatório" });
            }
            
            const newComment = await postRepositorio.addComment(id, comment);
            LogDeOperacoes.log('SUCESSO_ADICIONAR_COMENTARIO', { postId: id, commentId: newComment.id, authorId: newComment.authorId }, req.traceId);
            res.status(201).json({ success: true, comment: newComment });
        } catch (e) {
            LogDeOperacoes.error('FALHA_ADICIONAR_COMENTARIO', { postId: id, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    },

    // Deletar Post
    deletePost: async (req, res) => {
        const { id } = req.params;
        const initiatedBy = req.user?.id || 'unknown';
        LogDeOperacoes.log('TENTATIVA_DELETAR_POST', { postId: id, initiatedBy }, req.traceId);

        try {
            await postRepositorio.delete(id);
            LogDeOperacoes.log('SUCESSO_DELETAR_POST', { postId: id, initiatedBy }, req.traceId);
            res.json({ success: true });
        } catch (e) {
            LogDeOperacoes.error('FALHA_DELETAR_POST', { postId: id, initiatedBy, error: e }, req.traceId);
            res.status(500).json({ error: e.message });
        }
    }
};

export default postsControle;
