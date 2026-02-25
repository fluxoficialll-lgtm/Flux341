
// Funções de controle para Reels

// @desc    Criar um novo Reel
const createReel = (req, res) => {
    res.status(201).json({ message: "Rota para criar Reel funcionando!" });
};

// @desc    Obter todos os Reels
const getAllReels = (req, res) => {
    res.status(200).json({ message: "Rota para obter todos os Reels funcionando!" });
};

// @desc    Obter um Reel específico
const getReelById = (req, res) => {
    res.status(200).json({ message: `Rota para obter o Reel com ID ${req.params.reelId} funcionando!` });
};


export default {
    createReel,
    getAllReels,
    getReelById
};
