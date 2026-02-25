
// Funções de controle para Usuários

// @desc    Atualizar perfil do usuário
const updateUserProfile = (req, res) => {
    res.status(200).json({ message: `Rota para atualizar perfil do usuário com ID ${req.params.userId} funcionando!` });
};


export default {
    updateUserProfile
};
