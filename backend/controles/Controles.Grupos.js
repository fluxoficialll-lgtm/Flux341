
// Funções de controle para Grupos

// @desc    Criar um novo grupo
const createGroup = (req, res) => {
    res.status(201).json({ message: "Rota para criar grupo funcionando!" });
};

// @desc    Obter todos os grupos
const getAllGroups = (req, res) => {
    res.status(200).json({ message: "Rota para obter todos os grupos funcionando!" });
};

// @desc    Obter um grupo específico
const getGroupById = (req, res) => {
    res.status(200).json({ message: `Rota para obter o grupo com ID ${req.params.groupId} funcionando!` });
};


export default {
    createGroup,
    getAllGroups,
    getGroupById
};
