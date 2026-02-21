
import { pool } from '../database/pool.js';
import { gerarId, ID_PREFIX } from '../ServiçosBackEnd/idService.js';

const toCampaignObject = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        ownerId: row.owner_id,
        name: row.name,
        status: row.status,
        totalBudget: parseInt(row.total_budget, 10),
        remainingBudget: parseInt(row.remaining_budget, 10),
        creatives: row.creatives,
        targeting: row.targeting,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        startDate: row.start_date,
        endDate: row.end_date
    };
};

export const adCampaignRepositorio = {
    async create(campaignData) {
        const { ownerId, name, totalBudget, creatives, targeting, startDate, endDate, status } = campaignData;
        const id = gerarId(ID_PREFIX.CAMPANHA_DE_ANUNCIO);
        const budgetInCents = totalBudget * 100; // Calcular centavos uma vez

        const query = `
            INSERT INTO ad_campaigns 
                (id, owner_id, name, total_budget, remaining_budget, creatives, targeting, start_date, end_date, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) -- Use 10 distinct placeholders
            RETURNING *
        `;
        
        // Fornecer 10 valores, um para cada coluna
        const values = [id, ownerId, name, budgetInCents, budgetInCents, creatives, targeting, startDate, endDate, status || 'draft'];
        
        const res = await pool.query(query, values);
        return toCampaignObject(res.rows[0]);
    },

    async findById(id) {
        const res = await pool.query('SELECT * FROM ad_campaigns WHERE id = $1', [id]);
        return toCampaignObject(res.rows[0]);
    },

    async findByOwner(ownerId) {
        const res = await pool.query('SELECT * FROM ad_campaigns WHERE owner_id = $1 ORDER BY created_at DESC', [ownerId]);
        return res.rows.map(toCampaignObject);
    },

    async update(id, updates) {
        const fields = Object.keys(updates).map(k => {
            if (k === 'totalBudget' || k === 'remainingBudget') return `${k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)} = ${updates[k] * 100}`;
            return `${k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)} = $${Object.keys(updates).indexOf(k) + 1}`;
        }).join(', ');

        const query = `UPDATE ad_campaigns SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${Object.keys(updates).length + 1} RETURNING *`;
        const values = [...Object.values(updates), id];
        
        const res = await pool.query(query, values.filter(v => typeof v !== 'number' || !isNaN(v))); // filter out budget values handled manually
        return toCampaignObject(res.rows[0]);
    },

    async addBudget(id, amount) {
        const query = `
            UPDATE ad_campaigns 
            SET total_budget = total_budget + $1, remaining_budget = remaining_budget + $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 RETURNING *
        `;
        const res = await pool.query(query, [amount * 100, id]);
        return toCampaignObject(res.rows[0]);
    },

    async delete(id) {
        await pool.query('DELETE FROM ad_campaigns WHERE id = $1', [id]);
    }
};