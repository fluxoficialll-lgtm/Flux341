
import { pool } from '../database/pool.js';
import { gerarId, ID_PREFIX } from '../ServiçosBackEnd/idService.js';

const toItemObject = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        sellerId: row.seller_id,
        name: row.name,
        description: row.description,
        priceInCents: parseInt(row.price_in_cents, 10),
        category: row.category,
        condition: row.condition,
        status: row.status,
        images: row.images,
        location: row.location,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
};

export const marketplaceRepositorio = {

    async create(itemData) {
        const { sellerId, name, description, priceInCents, category, condition, images, location } = itemData;
        // CORREÇÃO: O repositório deve ser sempre responsável por gerar o ID.
        const id = gerarId(ID_PREFIX.ITEM_DO_MARKETPLACE);
        const query = `
            INSERT INTO marketplace_items (id, seller_id, name, description, price_in_cents, category, condition, images, location, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'available')
            RETURNING *;
        `;
        const values = [id, sellerId, name, description, priceInCents, category, condition, images, location];
        const res = await pool.query(query, values);
        return toItemObject(res.rows[0]);
    },

    async findById(id) {
        const res = await pool.query('SELECT * FROM marketplace_items WHERE id = $1', [id]);
        return toItemObject(res.rows[0]);
    },

    async list({ category, status = 'available', limit = 50, offset = 0 }) {
        let query = 'SELECT * FROM marketplace_items WHERE status = $1';
        const params = [status];
        
        if (category) {
            query += ` AND category = $${params.length + 1}`;
            params.push(category);
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const res = await pool.query(query, params);
        return res.rows.map(toItemObject);
    },
    
    async update(id, updates) {
        const fields = Object.keys(updates).map((key, i) => 
            `"${key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)}" = $${i + 1}`
        ).join(', ');

        const query = `UPDATE marketplace_items SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${Object.keys(updates).length + 1} RETURNING *`;
        const values = [...Object.values(updates), id];
        
        const res = await pool.query(query, values);
        return toItemObject(res.rows[0]);
    },

    async delete(id) {
        // Soft delete pode ser uma opção melhor, mas por enquanto, fazemos a exclusão física
        await pool.query('DELETE FROM marketplace_items WHERE id = $1', [id]);
    }
};