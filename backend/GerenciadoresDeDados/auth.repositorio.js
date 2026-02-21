
import { pool } from '../database/pool.js';
import { gerarId, ID_PREFIX } from '../ServiçosBackEnd/idService.js'; // Importar o gerador de ID

// Mapeia uma linha do banco de dados para um objeto de usuário mais limpo
const toUserObject = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        username: row.handle,
        email: row.email,
        passwordHash: row.password_hash,
        googleId: row.google_id,
        profilePictureUrl: row.profile_picture_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const authRepositorio = {
    /**
     * Encontra um usuário pelo seu e-mail.
     * @param {string} email - O e-mail do usuário.
     * @returns {Promise<object|null>} O objeto do usuário ou null se não for encontrado.
     */
    async findByEmail(email) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return toUserObject(res.rows[0]);
    },

    /**
     * Encontra um usuário pelo seu Google ID.
     * @param {string} googleId - O ID do Google do usuário.
     * @returns {Promise<object|null>} O objeto do usuário ou null se não for encontrado.
     */
    async findByGoogleId(googleId) {
        const res = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        return toUserObject(res.rows[0]);
    },

    /**
     * Encontra um usuário pelo seu nome de usuário (handle).
     * @param {string} username - O nome de usuário.
     * @returns {Promise<object|null>} O objeto do usuário ou null se não for encontrado.
     */
    async findByUsername(username) {
        const res = await pool.query('SELECT * FROM users WHERE handle = $1', [username]);
        return toUserObject(res.rows[0]);
    },

    /**
     * Cria um novo usuário focado na autenticação.
     * @param {object} user - O objeto do usuário a ser criado.
     * @returns {Promise<object>} O usuário recém-criado.
     */
    async create(user) {
        const { name, username, email, passwordHash, googleId } = user;
        // CORREÇÃO: Gerar o UUID para o novo usuário aqui, dentro do repositório.
        const newUserId = gerarId(ID_PREFIX.USUARIO);
        
        const res = await pool.query(
            'INSERT INTO users (id, name, handle, email, password_hash, google_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [newUserId, name, username, email, passwordHash, googleId]
        );
        return toUserObject(res.rows[0]);
    },

    /**
     * Atualiza o google_id de um usuário para vincular contas.
     * @param {object} user - O objeto do usuário com o google_id para adicionar.
     * @returns {Promise<object|null>} O usuário atualizado.
     */
    async update(user) {
        const { id, googleId } = user;
        const res = await pool.query(
            'UPDATE users SET google_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [googleId, id]
        );
        return toUserObject(res.rows[0]);
    }
};