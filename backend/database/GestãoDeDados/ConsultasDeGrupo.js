
import { query } from '../pool.js';
import { ulid } from 'ulid';

/**
 * Cria um novo grupo e adiciona o criador como o primeiro membro.
 * @param {object} groupData - Dados do grupo.
 * @param {string} groupData.name - Nome do grupo.
 * @param {string} groupData.description - Descrição do grupo.
 * @param {boolean} groupData.is_private - Se o grupo é privado.
 * @param {string} groupData.creatorId - ID do usuário que está criando o grupo.
 * @returns {Promise<object>} O grupo recém-criado.
 */
export const createGroupQuery = async ({ name, description, is_private, creatorId }) => {
    const groupId = ulid();
    const client = await query.connect();

    try {
        await client.query('BEGIN');

        // 1. Inserir o novo grupo na tabela `groups`
        const groupInsertSql = `
            INSERT INTO groups (id, name, description, is_private, creator_id, members_count)
            VALUES ($1, $2, $3, $4, $5, 1)
            RETURNING *;
        `;
        const groupValues = [groupId, name, description, is_private, creatorId];
        const groupResult = await client.query(groupInsertSql, groupValues);
        const newGroup = groupResult.rows[0];

        // 2. Adicionar o criador como o primeiro membro na tabela `group_members`
        const memberInsertSql = `
            INSERT INTO group_members (group_id, user_id, role)
            VALUES ($1, $2, 'admin');
        `;
        await client.query(memberInsertSql, [groupId, creatorId]);

        await client.query('COMMIT');
        return newGroup;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Erro na transação de criação de grupo:", error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Busca todos os grupos públicos.
 * @returns {Promise<Array<object>>} Uma lista de grupos.
 */
export const getAllGroupsQuery = async () => {
    const sql = `SELECT id, name, description, members_count, created_at FROM groups WHERE is_private = false ORDER BY created_at DESC;`;
    try {
        const { rows } = await query(sql);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar todos os grupos:", error);
        throw error;
    }
};

/**
 * Busca os grupos dos quais um usuário específico é membro.
 * @param {string} userId - O ID do usuário.
 * @returns {Promise<Array<object>>} Uma lista de grupos do usuário.
 */
export const getGroupsByUserIdQuery = async (userId) => {
    const sql = `
        SELECT g.id, g.name, g.description, g.members_count, gm.role
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = $1
        ORDER BY g.name;
    `;
    try {
        const { rows } = await query(sql, [userId]);
        return rows;
    } catch (error) {
        console.error(`Erro ao buscar grupos para o usuário ${userId}:`, error);
        throw error;
    }
};
