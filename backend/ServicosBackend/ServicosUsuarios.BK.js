
import bcrypt from 'bcrypt';
import { ulid } from 'ulid';
import RepositorioUsuarios from '../Repositorios/Repositorio.Usuarios.js';

const criarNovoUsuario = async ({ email, password }) => {
    const name = email.split('@')[0];
    const handle = name;
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const id = ulid();

    try {
        const newUser = await RepositorioUsuarios.criar({ 
            id, 
            name, 
            handle, 
            email, 
            password_hash 
        });

        return newUser;
    } catch (error) {
        throw error;
    }
};

const ServicosDeUsuarios = {
    criarNovoUsuario,
};

export default ServicosDeUsuarios;
