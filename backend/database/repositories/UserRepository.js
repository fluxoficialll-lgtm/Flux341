
import { query } from '../pool.js';
// Importando o logger para obter visibilidade na camada de acesso ao banco de dados.
import { LogDeOperacoes } from '../../ServiçosBackEnd/ServiçosDeLogsSofisticados/LogDeOperacoes.js';

const toUuid = (val) => (val === "" || val === "undefined" || val === "null") ? null : val;

const mapRowToUser = (row) => {
    if (!row) return null;
    const metadata = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
    
    return {
        ...metadata,
        id: row.id,
        email: row.email,
        handle: row.handle,
        googleId: row.google_id,
        walletBalance: parseFloat(row.wallet_balance || 0),
        isBanned: row.is_banned,
        isProfileCompleted: row.is_profile_completed,
        trustScore: row.trust_score,
        strikes: row.strikes,
        referredById: row.referred_by_id,
        createdAt: row.created_at
    };
};

export const UserRepository = {
    async findByEmail(email) {
        if (!email) return null;
        const res = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
        // Logar quando um usuário não é encontrado pode ser útil para depurar problemas de lógica.
        if (!res.rows[0]) {
            LogDeOperacoes.log('DB_USER_FIND_BY_EMAIL_NOT_FOUND', { email });
        }
        return mapRowToUser(res.rows[0]);
    },

    async findByHandle(handle) {
        if (!handle) return null;
        const res = await query('SELECT * FROM users WHERE handle = $1', [handle.toLowerCase().trim()]);
        if (!res.rows[0]) {
            LogDeOperacoes.log('DB_USER_FIND_BY_HANDLE_NOT_FOUND', { handle });
        }
        return mapRowToUser(res.rows[0]);
    },

    async findById(id) {
        const uuid = toUuid(id);
        if (!uuid) return null;
        const res = await query('SELECT * FROM users WHERE id = $1', [uuid]);
        if (!res.rows[0]) {
            LogDeOperacoes.log('DB_USER_FIND_BY_ID_NOT_FOUND', { id: uuid });
        }
        return mapRowToUser(res.rows[0]);
    },

    async findByGoogleId(googleId) {
        if (!googleId) return null;
        const res = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        return mapRowToUser(res.rows[0]);
    },

    async create(user) {
        const { email, password, googleId, referredById, profile, ...otherData } = user;
        LogDeOperacoes.log('DB_USER_CREATE_ATTEMPT', { email, hasGoogleId: !!googleId });

        try {
            const handle = profile?.name?.toLowerCase().trim();
            const metadata = { ...otherData, profile };

            const res = await query(
                `INSERT INTO users (email, password, handle, google_id, referred_by_id, data, is_profile_completed) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [
                    email.toLowerCase().trim(), 
                    password, 
                    handle || null, 
                    googleId || null, 
                    toUuid(referredById), 
                    JSON.stringify(metadata),
                    !!user.isProfileCompleted
                ]
            );
            const newUserId = res.rows[0].id;
            LogDeOperacoes.log('DB_USER_CREATE_SUCCESS', { userId: newUserId, email });
            return newUserId;
        } catch (dbError) {
            LogDeOperacoes.error('DB_USER_CREATE_FAILURE', { email, error: dbError.message, stack: dbError.stack });
            throw dbError; // Relança o erro para a camada de serviço/rota tratar.
        }
    },

    async update(user) {
        const { id, handle, walletBalance, isBanned, strikes, trustScore, isProfileCompleted, ...metadata } = user;
        const uuid = toUuid(id);
        
        if (!uuid) {
            const errorMsg = 'Update failed: Invalid or missing user ID.';
            LogDeOperacoes.error('DB_USER_UPDATE_FAILURE', { reason: errorMsg, userAttempt: user });
            throw new Error(errorMsg);
        }

        LogDeOperacoes.log('DB_USER_UPDATE_ATTEMPT', { userId: uuid, fieldsToUpdate: Object.keys(user) });

        try {
            const sql = `
                UPDATE users SET 
                    handle = COALESCE($1, handle),
                    wallet_balance = COALESCE($2, wallet_balance),
                    is_banned = COALESCE($3, is_banned),
                    strikes = COALESCE($4, strikes),
                    trust_score = COALESCE($5, trust_score),
                    is_profile_completed = COALESCE($6, is_profile_completed),
                    data = data || $7::jsonb
                WHERE id = $8
            `;

            await query(sql, [
                handle || null,
                walletBalance !== undefined ? parseFloat(walletBalance) : null,
                isBanned !== undefined ? isBanned : null,
                strikes !== undefined ? parseInt(strikes) : null,
                trustScore !== undefined ? parseInt(trustScore) : null,
                isProfileCompleted !== undefined ? isProfileCompleted : null,
                JSON.stringify(metadata),
                uuid
            ]);

            LogDeOperacoes.log('DB_USER_UPDATE_SUCCESS', { userId: uuid });
            return true;
        } catch (dbError) {
            LogDeOperacoes.error('DB_USER_UPDATE_FAILURE', { userId: uuid, error: dbError.message, stack: dbError.stack });
            throw dbError; // Relança o erro.
        }
    },

    async getAll() {
        const res = await query('SELECT * FROM users ORDER BY created_at DESC LIMIT 1000');
        return res.rows.map(mapRowToUser);
    }
};
