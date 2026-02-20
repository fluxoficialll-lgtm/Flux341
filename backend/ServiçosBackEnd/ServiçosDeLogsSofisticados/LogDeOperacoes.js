
/**
 * @file LogDeOperacoes.js
 * @description Logger Estruturado e Configurável para Produção.
 * @version 2.0.0
 * 
 * Inspirado em loggers de produção como Pino e Winston, este módulo fornece:
 * - **Logs em JSON Estruturado:** Saída padronizada para fácil parsing por serviços como Elastic, Datadog, etc.
 * - **Nível de Log Configurável:** Controlado pela variável de ambiente LOG_LEVEL (debug, info, warn, error).
 * - **Suporte a Trace ID:** Permite a correlação de logs através de uma única requisição.
 * - **Serialização de Erros:** Captura automática de stack trace para depuração eficaz.
 * - **Performance:** Evita processamento desnecessário verificando o nível de log antes de construir a mensagem.
 */

const levels = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    silent: Infinity, // Nível especial para desativar todos os logs
};

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const configuredLevel = levels[LOG_LEVEL.toLowerCase()] || levels.info;
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Função central que escreve o log formatado em JSON.
 * @private
 */
const writeLog = (levelName, contexto, data, traceId) => {
    const level = levels[levelName];
    // Valida se o log deve ser escrito com base no nível configurado
    if (level < configuredLevel) {
        return;
    }

    const logObject = {
        level: levelName,
        timestamp: new Date().toISOString(),
        contexto,
        traceId,
    };

    // Serialização de Erro: Se um objeto de erro for passado, extrai informações cruciais.
    if (data && data.error instanceof Error) {
        logObject.error = {
            message: data.error.message,
            stack: data.error.stack,
            name: data.error.name,
        };
        // Remove o objeto de erro original para evitar redundância.
        delete data.error;
    }

    logObject.data = data;

    // Converte o objeto de log em uma string JSON.
    const output = JSON.stringify(logObject);

    // Direciona a saída para o stream correto (stdout para info, stderr para erros).
    switch (levelName) {
        case 'error':
            console.error(output);
            break;
        case 'warn':
            console.warn(output);
            break;
        default:
            console.log(output);
            break;
    }
};

export const LogDeOperacoes = {
    /**
     * Registra uma mensagem de depuração, útil para desenvolvimento.
     * @param {string} contexto - Identificador da operação.
     * @param {object} [data={}] - Dados contextuais.
     * @param {string|null} [traceId=null] - ID de rastreamento da requisição.
     */
    debug: (contexto, data = {}, traceId = null) => {
        writeLog('debug', contexto, data, traceId);
    },

    /**
     * Registra uma mensagem informativa padrão (ex: sucesso de operação).
     * @param {string} contexto - Identificador da operação.
     * @param {object} [data={}] - Dados contextuais.
     * @param {string|null} [traceId=null] - ID de rastreamento da requisição.
     */
    log: (contexto, data = {}, traceId = null) => {
        writeLog('info', contexto, data, traceId);
    },

    /**
     * Registra um aviso para eventos que não são erros, mas merecem atenção.
     * @param {string} contexto - Identificador da operação.
     * @param {object} [data={}] - Dados contextuais.
     * @param {string|null} [traceId=null] - ID de rastreamento da requisição.
     */
    warn: (contexto, data = {}, traceId = null) => {
        writeLog('warn', contexto, data, traceId);
    },

    /**
     * Registra um erro. Captura e formata automaticamente objetos Error.
     * @param {string} contexto - Identificador da operação onde o erro ocorreu.
     * @param {object} [data={}] - Dados contextuais. Passe um objeto de erro como { error: e }.
     * @param {string|null} [traceId=null] - ID de rastreamento da requisição.
     */
    error: (contexto, data = {}, traceId = null) => {
        writeLog('error', contexto, data, traceId);
    },
};
