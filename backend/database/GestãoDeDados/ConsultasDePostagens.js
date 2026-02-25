
import pool from '../pool.js';

const createPostQuery = async (postData) => {
    const { userId, content, mediaUrl } = postData;
    // Supondo que a tabela 'posts' tenha as colunas user_id, content, media_url
    const query = 'INSERT INTO posts (user_id, content, media_url) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, content, mediaUrl || null];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getPostsQuery = async () => {
    // Supondo uma busca simples que ordena pelos mais recentes
    const query = 'SELECT * FROM posts ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

export { createPostQuery, getPostsQuery };
