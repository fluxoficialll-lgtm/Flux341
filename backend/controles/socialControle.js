
import { socialService } from '../ServiçosBackEnd/socialService.js';

const socialControle = {
    createReport: async (req, res) => {
        try {
            const result = await socialService.createReport(req.userId, req.body, req.traceId);
            res.status(202).json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    followUser: async (req, res) => {
        try {
            const result = await socialService.followUser(req.userId, req.body.followingId, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    unfollowUser: async (req, res) => {
        try {
            const result = await socialService.unfollowUser(req.userId, req.body.followingId, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(e.statusCode || 500).json({ error: e.message });
        }
    },

    getFollowing: async (req, res) => {
        try {
            const result = await socialService.getFollowing(req.userId, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    getFollowers: async (req, res) => {
        try {
            const result = await socialService.getFollowers(req.params.userId, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    getTopCreators: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 10;
            const result = await socialService.getTopCreators(limit, req.traceId);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
};

export default socialControle;
