
// Funções de controle para Autenticação

// @desc    Registrar um novo usuário
const registerUser = (req, res) => {
    res.status(201).json({ message: "Rota para registrar usuário funcionando!" });
};

// @desc    Autenticar um usuário
const loginUser = (req, res) => {
    res.status(200).json({ message: "Rota para login de usuário funcionando!" });
};


export default {
    registerUser,
    loginUser
};
