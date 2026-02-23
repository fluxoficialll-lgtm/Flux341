
import express from 'express';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import groupsRoutes from './routes/groups.js';
import messagesRoutes from './routes/messages.js';
import paymentRoutes from './routes/payments.js';
import socialRoutes from './routes/social.js';
import eventRoutes from './routes/events.js';
import marketplaceRoutes from './routes/marketplace.js';
import postsRoutes from './routes/posts.js';
import adsRoutes from './routes/ads.js';
import screensRoutes from './routes/screens.js';
import moderationRoutes from './routes/moderation.js';
import trackingRoutes from './routes/tracking.js';
import rankingRoutes from './routes/ranking.js';
import profileRoutes from './routes/profile.js';
import analyticsRoutes from './routes/analytics.js'; // ADICIONADO
import auditoriaRoutes from './routes/auditoria.js'; // NOVO

// Gateway specific routes
import syncpayRoutes from './routes/gateways/syncpay.js';
import stripeRoutes from './routes/gateways/stripe.js';
import paypalRoutes from './routes/gateways/paypal.js';

const router = express.Router();

// Handshake Route (Batimento)
router.get('/ping', (req, res) => {
    res.send('pong');
});

// Rota para configuração de boot da aplicação (Plano de Controle)
router.get('/v1/config/boot', (req, res) => {
    res.json({
        maintenanceMode: false
        // Futuras flags de configuração podem ser adicionadas aqui
    });
});

// BFF / Screens Aggregator
router.use('/screens', screensRoutes);

// Register modular routers
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/messages', messagesRoutes);
router.use('/events', eventRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/posts', postsRoutes);
router.use('/ads', adsRoutes);
router.use('/moderation', moderationRoutes);
router.use('/tracking', trackingRoutes);
router.use('/ranking', rankingRoutes);
router.use('/profile', profileRoutes);
router.use('/analytics', analyticsRoutes); // ADICIONADO
router.use('/auditoria', auditoriaRoutes); // NOVO

// Mounting Gateways
router.use('/syncpay', syncpayRoutes);
router.use('/stripe', stripeRoutes);
router.use('/paypal', paypalRoutes);

// Mounting specific prefixes to maintain compatibility with frontend services
router.use('/', socialRoutes);
router.use('/', paymentRoutes);

export default router;
