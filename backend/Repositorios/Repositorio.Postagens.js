
import { createPostQuery, getPostsQuery } from '../database/GestãoDeDados/ConsultasDePostagens.js';

const criar = (postData) => {
    return createPostQuery(postData);
};

const obter = () => {
    return getPostsQuery();
};

const RepositorioPostagens = {
    criar,
    obter,
};

export default RepositorioPostagens;
