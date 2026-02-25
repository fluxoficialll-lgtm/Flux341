
import { query } from '../pool.js';

/**
 * Insere um novo usuário no banco de dados.
 * @param {object} userData - Dados do usuário.
 * @param {string} userData.id - O ID único do usuário (ULID).
 * @param {string} userData.name - O nome do usuário.
 * @param {string} userData.handle - O handle do usuário.
 * @param {string} userData.email - O email do usuário.
 * @param {string} userData.password_hash - O hash da senha do usuário.
 * @returns {Promise<object>} O usuário recém-criado.
 */
export const createUserQuery = async ({ id, name, handle, email, password_hash }) => {
    const sql = `
        INSERT INTO users (id, name, handle, email, password_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, handle, email, created_at;
    `;
    const values = [id, name, handle, email, password_hash];
    
    try {
        const { rows } = await query(sql, values);
        return rows[0];
    } catch (error) {
        // Propaga o erro para ser tratado no controller
        throw error;
    }
};
