
export const identificarAmbiente = () => {
    if (process.env.VERCEL) {
        return 'vercel';
    }
    if (process.env.RENDER) {
        return 'render';
    }
    if (process.env.FIREBASE_CONFIG) {
        return 'firebase';
    }
    // Adicione outras verificações de ambiente aqui, se necessário

    // Se nenhuma plataforma em nuvem for detectada, assuma o ambiente local
    return 'local';
};
