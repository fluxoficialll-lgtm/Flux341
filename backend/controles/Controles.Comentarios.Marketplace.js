
// Funções de controle para Comentários do Marketplace

// @desc    Criar um novo comentário em um item do marketplace
const createComment = (req, res) => {
    // O ID do item estará em req.params.itemId
    res.status(201).json({ message: `Rota para criar comentário no item do marketplace com ID ${req.params.itemId} funcionando!` });
};

// @desc    Obter todos os comentários de um item do marketplace
const getAllComments = (req, res) => {
    res.status(200).json({ message: `Rota para obter todos os comentários do item do marketplace com ID ${req.params.itemId} funcionando!` });
};


export default {
    createComment,
    getAllComments
};
