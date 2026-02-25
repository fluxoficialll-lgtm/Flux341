
// backend/ServicosBackend/ServicosGrupos.BK.js

import RepositorioGrupos from '../Repositorios/Repositorio.Grupos.js';

/**
 * Orquestra a criação de um novo grupo.
 * A lógica de negócio específica do grupo fica aqui.
 * @param {object} dadosDoGrupo - Dados vindos do controller.
 * @param {string} dadosDoGrupo.nome - Nome do grupo.
 * @param {string} dadosDoGrupo.descricao - Descrição do grupo.
 * @param {boolean} dadosDoGrupo.is_private - Se o grupo é privado.
 * @param {string} dadosDoGrupo.creatorId - ID do usuário criador.
 * @returns {Promise<object>} O novo grupo criado.
 */
const criarNovoGrupo = async (dadosDoGrupo) => {
    try {
        // Delegação simples para a camada de Repositório.
        // Lógica de negócio mais complexa (ex: validações) poderia ser adicionada aqui.
        const novoGrupo = await RepositorioGrupos.criar(dadosDoGrupo);
        return novoGrupo;
    } catch (error) {
        // Propaga o erro para ser tratado pelo controller.
        throw error;
    }
};

/**
 * Orquestra a busca de todos os grupos públicos.
 */
const buscarTodosOsGrupos = async () => {
    try {
        return await RepositorioGrupos.buscarTodos();
    } catch (error) {
        throw error;
    }
};

/**
 * Orquestra a busca dos grupos de um usuário.
 * @param {string} userId - ID do usuário.
 */
const buscarGruposDoUsuario = async (userId) => {
    try {
        return await RepositorioGrupos.buscarPorUsuario(userId);
    } catch (error) {
        throw error;
    }
};


const ServicosGrupos = {
    criarNovoGrupo,
    buscarTodosOsGrupos,
    buscarGruposDoUsuario,
};

export default ServicosGrupos;
