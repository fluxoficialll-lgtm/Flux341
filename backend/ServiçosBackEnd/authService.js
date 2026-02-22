
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepositorio } from '../GerenciadoresDeDados/auth.repositorio.js';
import { gerarId } from './FabricaDeIDS.js';

export const authService = {
  /**
   * @description Registra um novo usuário, cuidando da lógica de negócio.
   * @param {object} userData - Dados do usuário (name, username, email, password, googleId).
   * @returns {object} - Contém o token e o ID do novo usuário.
   */
  async registerUser({ name, username, email, password, googleId }) {
    if (await authRepositorio.findByEmail(email)) {
      throw { status: 409, message: 'O e-mail fornecido já está em uso.' };
    }
    if (await authRepositorio.findByUsername(username)) {
      throw { status: 409, message: 'O nome de usuário já está em uso.' };
    }

    const novoUsuarioId = gerarId();
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const newUser = { id: novoUsuarioId, name, username, email, passwordHash, googleId };
    await authRepositorio.create(newUser);

    const token = jwt.sign({ userId: novoUsuarioId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, userId: novoUsuarioId };
  },

  /**
   * @description Realiza o login de um usuário.
   * @param {string} email - O e-mail do usuário.
   * @param {string} password - A senha do usuário.
   * @returns {object} - Contém o token e o ID do usuário.
   */
  async loginUser(email, password) {
    const user = await authRepositorio.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw { status: 401, message: 'Credenciais inválidas.' };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw { status: 401, message: 'Credenciais inválidas.' };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, userId: user.id };
  },

  /**
   * @description Autentica um usuário com o Google, criando-o se necessário.
   * @param {object} googleData - Dados do Google (googleId, email, name).
   * @returns {object} - Contém o token e o ID do usuário.
   */
  async loginWithGoogle({ googleId, email, name }) {
    let user = await authRepositorio.findByGoogleId(googleId);

    if (!user) {
      user = await authRepositorio.findByEmail(email);
      if (user) {
        user.googleId = googleId;
        await authRepositorio.update(user);
      } else {
        const novoUsuarioId = gerarId();
        const username = email.split('@')[0];
        
        const newUser = { id: novoUsuarioId, googleId, email, name, username, passwordHash: null };
        user = await authRepositorio.create(newUser);
      }
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, userId: user.id };
  }
};
