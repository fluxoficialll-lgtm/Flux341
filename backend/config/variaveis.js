
// backend/config/variaveis.js

export const VARIAVEIS_BACKEND = {
    obrigatorias: [
        'DATABASE_URL',
        'JWT_SECRET',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
    ],
    comFallback: {
        'PORT': 3001,
        'CORS_ORIGIN': process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5173',
    },
    opcionais: [
        'STRIPE_SECRET_KEY',
    ],
};
