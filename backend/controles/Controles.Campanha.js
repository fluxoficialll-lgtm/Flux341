
// Funções de controle para Campanhas

// @desc    Criar uma nova campanha
const createCampaign = (req, res) => {
    res.status(201).json({ message: "Rota para criar campanha funcionando!" });
};

// @desc    Obter todas as campanhas
const getAllCampaigns = (req, res) => {
    res.status(200).json({ message: "Rota para obter todas as campanhas funcionando!" });
};

// @desc    Obter uma campanha específica
const getCampaignById = (req, res) => {
    res.status(200).json({ message: `Rota para obter a campanha com ID ${req.params.campaignId} funcionando!` });
};


export default {
    createCampaign,
    getAllCampaigns,
    getCampaignById
};
