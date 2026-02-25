
// Funções de controle para o provedor PayPal

const createAccountLink = (req, res) => {
    res.status(200).json({ message: "Rota para criar link de conta PayPal funcionando!", url: "https://www.paypal.com/br/home" });
};

const getAccountDetails = (req, res) => {
    res.status(200).json({ message: "Rota para buscar detalhes de conta PayPal funcionando!" });
};

const disconnectAccount = (req, res) => {
    res.status(200).json({ message: "Rota para desconectar conta PayPal funcionando!" });
};

const createOrder = (req, res) => {
    res.status(201).json({ message: "Rota para criar ordem de pagamento PayPal funcionando!" });
};

const checkOrderStatus = (req, res) => {
    res.status(200).json({ message: `Rota para verificar status da ordem ${req.params.orderId} do PayPal funcionando!` });
};

export default {
    createAccountLink,
    getAccountDetails,
    disconnectAccount,
    createOrder,
    checkOrderStatus
};
