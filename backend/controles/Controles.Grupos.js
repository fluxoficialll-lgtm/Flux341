
import ServicosGrupos from '../ServicosBackend/ServicosGrupos.BK.js';

const getGroups = async (req, res) => {
    try {
        const groups = await ServicosGrupos.buscarTodosOsGrupos();
        res.status(200).json(groups);
    } catch (error) {
        console.error("Erro no controller ao buscar grupos:", error);
        res.status(500).json({ message: "Erro interno do servidor ao buscar grupos." });
    }
};

const getUserGroups = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Autenticação necessária." });
    }

    try {
        const groups = await ServicosGrupos.buscarGruposDoUsuario(userId);
        res.status(200).json(groups);
    } catch (error) {
        console.error("Erro no controller ao buscar grupos do usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor ao buscar grupos do usuário." });
    }
};

const createGroup = async (req, res) => {
    const { name, description, is_private } = req.body;
    const creatorId = req.user?.id;

    if (!creatorId) {
        return res.status(401).json({ message: "Autenticação necessária." });
    }

    if (!name) {
        return res.status(400).json({ message: "O nome do grupo é obrigatório." });
    }

    try {
        const newGroup = await ServicosGrupos.criarNovoGrupo({ name, description, is_private, creatorId });
        res.status(201).json(newGroup);
    } catch (error) {
        console.error("Erro no controller ao criar grupo:", error);
        res.status(500).json({ message: "Erro interno do servidor ao criar grupo." });
    }
};

const gruposControle = {
    getGroups,
    getUserGroups,
    createGroup,
};

export default gruposControle;
