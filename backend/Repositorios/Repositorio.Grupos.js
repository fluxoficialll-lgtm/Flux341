
// backend/Repositorios/Repositorio.Grupos.js

/**
 * Implementa o Padrão Repository para a entidade Grupo.
 * Abstrai a fonte de dados, importando e reexportando as consultas específicas
 * da camada de acesso a dados (`GestãoDeDados`).
 */

import {
    createGroupQuery,
    getAllGroupsQuery,
    getGroupsByUserIdQuery
} from '../database/GestãoDeDados/ConsultasDeGrupo.js';

/**
 * Repositório para a entidade Grupo.
 * Fornece uma interface consistente para a camada de serviço interagir
 * com os dados de grupos.
 */
const RepositorioGrupos = {
    /**
     * Atalho para a consulta de criação de grupo.
     */
    criar: createGroupQuery,

    /**
     * Atalho para a consulta que busca todos os grupos (públicos).
     */
    buscarTodos: getAllGroupsQuery,

    /**
     * Atalho para a consulta que busca os grupos de um usuário específico.
     */
    buscarPorUsuario: getGroupsByUserIdQuery,

    // Futuros métodos como `buscarPorId`, `adicionarMembro`, etc., seguirão o mesmo padrão.
};

export default RepositorioGrupos;
