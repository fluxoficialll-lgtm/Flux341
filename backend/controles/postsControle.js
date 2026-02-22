
import { postsService } from '../ServiçosBackEnd/postsService.js';

const postsControle = {
    listPosts: async (req, res) => {
        try {
            const result = await postsService.listPosts(req.query, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    createPost: async (req, res) => {
        try {
            const result = await postsService.createPost(req.body, req.traceId);
            res.status(201).json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    interactWithPost: async (req, res) => {
        try {
            const result = await postsService.interactWithPost(req.params.id, req.body, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    addComment: async (req, res) => {
        try {
            const result = await postsService.addComment(req.params.id, req.body.comment, req.traceId);
            res.status(201).json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    deletePost: async (req, res) => {
        try {
            const result = await postsService.deletePost(req.params.id, req.user?.id, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default postsControle;
