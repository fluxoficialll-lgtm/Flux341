
import { pool } from '../database/pool.js';
import { gerarId, ID_PREFIX } from '../ServiçosBackEnd/idService.js';

const toTransactionObject = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        userId: row.user_id,
        relatedEntityId: row.related_entity_id,
        relatedEntityType: row.related_entity_type,
        grossAmount: parseInt(row.gross_amount, 10),
        platformFee: parseInt(row.platform_fee, 10),
        providerFee: parseInt(row.provider_fee, 10),
        netAmount: parseInt(row.net_amount, 10),
        currency: row.currency,
        type: row.type,
        status: row.status,
        provider: row.provider,
        providerTransactionId: row.provider_transaction_id,
        metadata: row.metadata,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const financialRepositorio = {
    async recordTransaction(txData) {
        const {
            userId, relatedEntityId, relatedEntityType, 
            grossAmount, platformFee, providerFee, netAmount,
            currency, type, status, provider, providerTransactionId, metadata
        } = txData;

        // CORREÇÃO: Gerar um novo ID de transação (UUID) de forma explícita.
        // Isso garante que nunca usaremos um ID externo na chave primária.
        const newTransactionId = gerarId(ID_PREFIX.TRANSACAO);

        const query = `
            INSERT INTO transactions (
                id, user_id, related_entity_id, related_entity_type,
                gross_amount, platform_fee, provider_fee, net_amount,
                currency, type, status, provider, provider_transaction_id, metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (id) DO UPDATE SET
                status = EXCLUDED.status,
                metadata = transactions.metadata || EXCLUDED.metadata, -- Merge JSONB data
                updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;

        const values = [
            // CORREÇÃO: Passar o novo UUID gerado como o primeiro parâmetro.
            newTransactionId,
            userId, relatedEntityId, relatedEntityType,
            grossAmount, platformFee, providerFee, netAmount,
            currency, type, status, provider, 
            // Garantir que o ID do provedor vá para a coluna correta.
            providerTransactionId,
            metadata
        ];

        const res = await pool.query(query, values);
        return toTransactionObject(res.rows[0]);
    },

    async findById(id) {
        const res = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
        return toTransactionObject(res.rows[0]);
    },

    async findByProviderTransactionId(providerTxId) {
        const res = await pool.query('SELECT * FROM transactions WHERE provider_transaction_id = $1', [providerTxId]);
        return toTransactionObject(res.rows[0]);
    },
    
    async findByUser(userId, { limit = 50, offset = 0 } = {}) {
        const res = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', 
            [userId, limit, offset]
        );
        return res.rows.map(toTransactionObject);
    }
};
