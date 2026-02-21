
import { pool } from '../database/pool.js';
import { gerarId, ID_PREFIX } from '../ServiçosBackEnd/idService.js';

// Mapeia uma linha do banco de dados para um objeto de post mais limpo
const toPostObject = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        authorId: row.author_id,
        parentPostId: row.parent_post_id,
        content: row.content,
        mediaUrl: row.media_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

// Mapeia uma linha para um objeto de comentário
const toCommentObject = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        postId: row.post_id,
        authorId: row.author_id,
        content: row.content,
        createdAt: row.created_at,
    };
};

export const postRepositorio = {
    /**
     * Lista posts com paginação baseada em cursor (timestamp).
     * @param {number} limit - O número máximo de posts a serem retornados.
     * @param {string} cursor - O timestamp do último post da página anterior.
     * @returns {Promise<object[]>} Uma lista de posts.
     */
    async list(limit = 50, cursor = null) {
        let query = 'SELECT * FROM posts';
        const params = [];

        if (cursor) {
            query += ' WHERE created_at < $1';
            params.push(new Date(cursor));
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
        params.push(limit);

        const res = await pool.query(query, params);
        return res.rows.map(toPostObject);
    },

    /**
     * Cria um novo post.
     * @param {object} postData - Os dados do post.
     * @returns {Promise<object>} O post recém-criado.
     */
    async create(postData) {
        const { authorId, parentPostId, content, mediaUrl } = postData;
        // CORREÇÃO: Gerar o ID do post dentro do repositório.
        const newPostId = gerarId(ID_PREFIX.POST);

        const query = 'INSERT INTO posts (id, author_id, parent_post_id, content, media_url) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const res = await pool.query(query, [newPostId, authorId, parentPostId, content, mediaUrl]);
        return toPostObject(res.rows[0]);
    },

    /**
     * Deleta um post pelo seu ID.
     * @param {string} postId - O ID do post a ser deletado.
     */
    async delete(postId) {
        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    },

    /**
     * Adiciona um comentário a um post.
     * @param {string} postId - O ID do post a ser comentado.
     * @param {object} commentData - Os dados do comentário.
     * @returns {Promise<object>} O comentário recém-criado.
     */
    async addComment(postId, commentData) {
        const { authorId, content } = commentData;
        const commentId = gerarId(ID_PREFIX.COMENTARIO);

        const query = 'INSERT INTO comments (id, post_id, author_id, content) VALUES ($1, $2, $3, $4) RETURNING *';
        const res = await pool.query(query, [commentId, postId, authorId, content]);
        return toCommentObject(res.rows[0]);
    }
};