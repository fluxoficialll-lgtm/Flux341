
// Funções de controle para o provedor SyncPay

const saveCredentials = (req, res) => {
    res.status(201).json({ message: "Rota para salvar credenciais do SyncPay funcionando!" });
};

const disconnectAccount = (req, res) => {
    res.status(200).json({ message: "Rota para desconectar conta do SyncPay funcionando!" });
};

const createPayment = (req, res) => {
    res.status(201).json({ message: "Rota para criar pagamento com SyncPay funcionando!" });
};

const checkTransactionStatus = (req, res) => {
    res.status(200).json({ message: "Rota para verificar status de transação do SyncPay funcionando!" });
};

export default {
    saveCredentials,
    disconnectAccount,
    createPayment,
    checkTransactionStatus
};
