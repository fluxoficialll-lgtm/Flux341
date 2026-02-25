
import express from 'express';

// Importando as novas rotas de autenticação e usuário
import rotasAutenticacao from './Rotas.Autenticacao.js';
import rotasUsuario from './Rotas.Usuario.js';

// Importando as rotas de publicação modulares
import RotasFeed from './Rotas.Publicacao.Feed.js';
import RotasMarketplace from './Rotas.Publicacao.Marketplace.js';
import RotasCampanha from './Rotas.Publicacao.Campanha.js';
import RotasGrupos from './Rotas.Publicacao.Grupos.js';
import RotasReels from './Rotas.Publicacao.Reels.js';

// Importando as rotas dos provedores de pagamento
import rotasSyncPay from './Rotas.Provedor.SyncPay.js';
import rotasPayPal from './Rotas.Provedor.PayPal.js';
import rotasStripe from './Rotas.Provedor.Stripe.js';


const router = express.Router();

// Agrupa as rotas importadas dos módulos sob seus respectivos prefixos

// Rotas de Autenticação (ex: /api/auth/register, /api/auth/login)
router.use('/auth', rotasAutenticacao);

// Rotas de Usuários (ex: /api/users/:userId)
router.use('/users', rotasUsuario);

// ---- Novas Rotas de Publicação ----
router.use('/posts', RotasFeed);
router.use('/marketplace', RotasMarketplace);
router.use('/campaigns', RotasCampanha);
router.use('/groups', RotasGrupos);
router.use('/reels', RotasReels);

// ---- Rotas dos Provedores de Pagamento ----
router.use('/syncpay', rotasSyncPay);
router.use('/paypal', rotasPayPal);
router.use('/stripe', rotasStripe);


export default router;
