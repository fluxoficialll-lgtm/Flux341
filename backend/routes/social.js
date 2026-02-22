
import express from 'express';
import socialControle from '../controles/socialControle.js';

const router = express.Router();

// Endpoint para criar uma denúncia
router.post('/reports', socialControle.createReport);

// Seguir um usuário
router.post('/relationships/follow', socialControle.followUser);

// Deixar de seguir um usuário
router.post('/relationships/unfollow', socialControle.unfollowUser);

// Listar quem o usuário logado segue
router.get('/relationships/me/following', socialControle.getFollowing);

// Listar seguidores de um usuário
router.get('/relationships/:userId/followers', socialControle.getFollowers);

// Obter ranking de top criadores
router.get('/rankings/top-creators', socialControle.getTopCreators);

export default router;
