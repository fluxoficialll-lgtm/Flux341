
// Funções de controle para o Marketplace

// @desc    Criar um novo item
const createItem = (req, res) => {
    res.status(201).json({ message: "Rota para criar item no marketplace funcionando!" });
};

// @desc    Obter todos os itens
const getAllItems = (req, res) => {
    res.status(200).json({ message: "Rota para obter todos os itens do marketplace funcionando!" });
};

// @desc    Obter um item específico
const getItemById = (req, res) => {
    res.status(200).json({ message: `Rota para obter o item com ID ${req.params.itemId} funcionando!` });
};

// @desc    Atualizar um item
const updateItem = (req, res) => {
    res.status(200).json({ message: `Rota para atualizar o item com ID ${req.params.itemId} funcionando!` });
};

// @desc    Deletar um item
const deleteItem = (req, res) => {
    res.status(200).json({ message: `Rota para deletar o item com ID ${req.params.itemId} funcionando!` });
};


export default {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
};
