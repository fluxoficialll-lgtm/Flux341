
import postagensServico from '../ServicosBackend/Servicos.Postagens.BK.js';

const createPost = async (req, res) => {
    try {
        const post = await postagensServico.createPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await postagensServico.getPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const postagensControle = {
    createPost,
    getPosts,
};

export default postagensControle;
