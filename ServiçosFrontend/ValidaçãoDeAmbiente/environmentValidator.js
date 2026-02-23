
/**
 * Valida se as variáveis de ambiente essenciais para o frontend estão definidas.
 * A aplicação Vite expõe variáveis de ambiente através do objeto `import.meta.env`.
 *
 * @throws {Error} Lança um erro se uma variável obrigatória não estiver definida.
 */
export const validateEnvironment = () => {
    // Adicione aqui as variáveis de ambiente OBRIGATÓRIAS para a sua aplicação.
    // Exemplo: VITE_API_BASE_URL, VITE_FIREBASE_API_KEY, etc.
    const requiredEnvVars = [
        'VITE_API_URL',
        // 'VITE_ANALYTICS_KEY', // Descomente e adicione as suas chaves
    ];

    const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(
            `Erro Crítico de Configuração: As seguintes variáveis de ambiente obrigatórias não foram definidas: ${missingVars.join(', ')}. ` +
            'Verifique seu arquivo .env e a configuração do Vite.'
        );
    }

    // Você pode adicionar validações mais complexas aqui se necessário.
    // Por exemplo, verificar se a URL da API é uma URL válida.

    console.log('Validação do ambiente concluída com sucesso.');
};
