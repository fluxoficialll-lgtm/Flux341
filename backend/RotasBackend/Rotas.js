
import express from 'express';
import RotasCriaçãoContas from './RotasCriaçãoContas.js';
import RotasDeUsuarios from './RotasDeUsuarios.js';
import RotasGrupos from './RotasGrupos.js';
import RotasPostagens from './RotasPostagens.js';

const router = express.Router();

// Agrupa as rotas importadas dos módulos sob seus respectivos prefixos

// Rotas de Autenticação (ex: /api/auth/register)
router.use('/auth', RotasCriaçãoContas);

// Rotas de Usuários (ex: /api/users/search)
router.use('/users', RotasDeUsuarios);

// Rotas de Grupos (ex: /api/groups)
router.use('/groups', RotasGrupos);

// Rotas de Postagens (ex: /api/posts)
router.use('/posts', RotasPostagens);

export default router;
