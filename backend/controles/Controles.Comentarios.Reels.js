
// Funções de controle para Comentários de Reels

// @desc    Criar um novo comentário em um Reel
const createComment = (req, res) => {
    // O ID do Reel estará em req.params.reelId
    res.status(201).json({ message: `Rota para criar comentário no Reel com ID ${req.params.reelId} funcionando!` });
};

// @desc    Obter todos os comentários de um Reel
const getAllComments = (req, res) => {
    res.status(200).json({ message: `Rota para obter todos os comentários do Reel com ID ${req.params.reelId} funcionando!` });
};


export default {
    createComment,
    getAllComments
};
