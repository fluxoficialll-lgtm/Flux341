
import ServicosDeUsuarios from '../ServicosBackend/ServicosUsuarios.BK.js';

const criarUsuario = async (req, res) => {
    const { email, password, referredBy } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    try {
        const newUser = await ServicosDeUsuarios.criarNovoUsuario({ email, password });

        if (referredBy) {
            console.log(`Usuário ${newUser.email} foi referido por ${referredBy}`);
        }

        res.status(201).json({
            message: "Usuário criado com sucesso!",
            user: newUser
        });

    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ message: "Este e-mail já está em uso." });
        }
        
        console.error("Erro no controller ao criar usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor ao criar usuário." });
    }
};

const usuariosControle = {
    criarUsuario,
    searchUsers: (req, res) => res.status(501).send("Not Implemented"),
    getUserForUpdate: (req, res) => res.status(501).send("Not Implemented"),
    updateUser: (req, res) => res.status(501).send("Not Implemented"),
};

export default usuariosControle;
