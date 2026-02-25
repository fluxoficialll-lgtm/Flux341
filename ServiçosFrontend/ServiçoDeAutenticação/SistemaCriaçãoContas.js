
import gestorDeRequisicoes from './GestorRequisicoesContas';

/**
 * Sistema para gerenciar operações de CRUD para contas de usuário.
 * Interage com o backend para criar, ler, atualizar e deletar dados de usuários.
 */
export const SistemaCriaçãoContas = {

    /**
     * Cria uma nova conta de usuário no sistema.
     * @param {object} dadosDoUsuario - Os dados para o novo usuário (ex: nome, email, senha).
     * @returns {Promise<any>} A resposta do backend, geralmente contendo os dados do usuário criado.
     */
    async criarConta(dadosDoUsuario) {
        // Envia os dados do novo usuário para o endpoint de registro no backend.
        return gestorDeRequisicoes.post('/auth/register', dadosDoUsuario);
    },

    /**
     * Obtém os dados de uma conta de usuário específica.
     * @param {string} usuarioId - O ID do usuário a ser recuperado.
     * @returns {Promise<any>} A resposta do backend com os dados do usuário.
     */
    async obterConta(usuarioId) {
        // Busca os dados de um usuário pelo seu ID.
        return gestorDeRequisicoes.get(`/users/${usuarioId}`);
    },

    /**
     * Atualiza os dados de uma conta de usuário existente.
     * @param {string} usuarioId - O ID do usuário a ser atualizado.
     * @param {object} dadosAtualizados - Um objeto com os campos a serem atualizados.
     * @returns {Promise<any>} A resposta do backend, geralmente confirmando a atualização.
     */
    async atualizarConta(usuarioId, dadosAtualizados) {
        // Envia os dados atualizados para o backend.
        return gestorDeRequisicoes.put(`/users/${usuarioId}`, dadosAtualizados);
    },

    /**
     * Deleta uma conta de usuário do sistema.
     * @param {string} usuarioId - O ID do usuário a ser deletado.
     * @returns {Promise<any>} A resposta do backend, confirmando a exclusão.
     */
    async deletarConta(usuarioId) {
        // Solicita ao backend a exclusão da conta do usuário.
        return gestorDeRequisicoes.delete(`/users/${usuarioId}`);
    }
};
