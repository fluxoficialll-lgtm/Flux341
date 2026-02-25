
// Funções de controle para o Feed

// @desc    Criar um novo post
const createPost = (req, res) => {
    res.status(201).json({ message: "Rota para criar post funcionando!" });
};

// @desc    Obter todos os posts
const getAllPosts = (req, res) => {
    res.status(200).json({ message: "Rota para obter todos os posts funcionando!" });
};

// @desc    Obter um post específico
const getPostById = (req, res) => {
    res.status(200).json({ message: `Rota para obter o post com ID ${req.params.postId} funcionando!` });
};

// @desc    Atualizar um post
const updatePost = (req, res) => {
    res.status(200).json({ message: `Rota para atualizar o post com ID ${req.params.postId} funcionando!` });
};

// @desc    Deletar um post
const deletePost = (req, res) => {
    res.status(200).json({ message: `Rota para deletar o post com ID ${req.params.postId} funcionando!` });
};


export default {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
