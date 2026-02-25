
import RepositorioPostagens from '../Repositorios/Repositorio.Postagens.js';

const createPost = async (postData) => {
    // A lógica de negócio pode ser adicionada aqui antes de chamar o repositório
    // Ex: validações, enriquecimento de dados, etc.
    return RepositorioPostagens.criar(postData);
};

const getPosts = async () => {
    return RepositorioPostagens.obter();
};

const postagensServico = {
    createPost,
    getPosts,
};

export default postagensServico;
