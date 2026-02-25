
// Funções de controle para o provedor Stripe

const createAccountLink = (req, res) => {
    res.status(200).json({ message: "Rota para criar link de conta Stripe funcionando!", url: "https://stripe.com" });
};

const getAccountDetails = (req, res) => {
    res.status(200).json({ message: "Rota para buscar detalhes de conta Stripe funcionando!" });
};

const disconnectAccount = (req, res) => {
    res.status(200).json({ message: "Rota para desconectar conta Stripe funcionando!" });
};

const createPaymentIntent = (req, res) => {
    res.status(201).json({ message: "Rota para criar intenção de pagamento Stripe funcionando!" });
};

const checkSessionStatus = (req, res) => {
    res.status(200).json({ message: `Rota para verificar status da sessão ${req.params.sessionId} do Stripe funcionando!` });
};

export default {
    createAccountLink,
    getAccountDetails,
    disconnectAccount,
    createPaymentIntent,
    checkSessionStatus
};
