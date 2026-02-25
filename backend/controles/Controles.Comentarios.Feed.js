
// Funções de controle para Comentários do Feed

// @desc    Criar um novo comentário em um post
const createComment = (req, res) => {
    // O ID do post estará em req.params.postId, pois a rota é aninhada
    res.status(201).json({ message: `Rota para criar comentário no post com ID ${req.params.postId} funcionando!` });
};

// @desc    Obter todos os comentários de um post
const getAllComments = (req, res) => {
    res.status(200).json({ message: `Rota para obter todos os comentários do post com ID ${req.params.postId} funcionando!` });
};


export default {
    createComment,
    getAllComments
};
