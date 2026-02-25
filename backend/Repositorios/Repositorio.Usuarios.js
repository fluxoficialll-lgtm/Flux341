
// backend/Repositorios/Repositorio.Usuarios.js

/**
 * Este arquivo implementa o Padrão Repository para a entidade Usuário.
 * Ele serve como um intermediário entre a camada de serviço e a camada de acesso a dados,
 * importando as consultas específicas (Query Objects) e expondo-as de uma maneira 
 * consistente para o resto da aplicação.
 */

// Importa a consulta específica da camada de acesso a dados.
import {
    createUserQuery
} from '../database/GestãoDeDados/ConsultasDeUsuario.js';

/**
 * Repositório para a entidade Usuário.
 * Mapeia métodos de negócio para as consultas de dados específicas.
 */
const RepositorioUsuarios = {
    /**
     * Atalho para a consulta de criação de usuário.
     * A camada de serviço usará este método para criar um usuário,
     * sem precisar saber os detalhes de implementação da consulta SQL.
     */
    criar: createUserQuery,

    // Outros métodos do repositório podem ser adicionados aqui,
    // como `buscarPorId`, `atualizar`, etc., cada um importando
    // e reexportando a consulta correspondente.
};

export default RepositorioUsuarios;
