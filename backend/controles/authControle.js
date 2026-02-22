
import { authService } from '../ServiçosBackEnd/authService.js';

const authControle = {
  /**
   * @description Ponto de entrada da API para registrar um novo usuário.
   */
  register: async (req, res) => {
    try {
      const { token, userId } = await authService.registerUser(req.body);
      res.status(201).json({
        message: 'Usuário registrado com sucesso!',
        token,
        userId
      });
    } catch (error) {
      console.error('Erro no controlador de registro:', error);
      // Usa o status do erro lançado pelo serviço, ou 500 como padrão
      const statusCode = error.status || 500;
      const message = error.message || 'Ocorreu um erro inesperado durante o registro.';
      res.status(statusCode).json({ message });
    }
  },

  /**
   * @description Ponto de entrada da API para fazer o login do usuário.
   */
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const { token, userId } = await authService.loginUser(email, password);
      res.status(200).json({ message: 'Login bem-sucedido!', token, userId });
    } catch (error) {
      console.error('Erro no controlador de login:', error);
      const statusCode = error.status || 500;
      const message = error.message || 'Ocorreu um erro inesperado durante o login.';
      res.status(statusCode).json({ message });
    }
  },

  /**
   * @description Ponto de entrada da API para autenticar um usuário com o Google.
   */
  loginComGoogle: async (req, res) => {
    try {
      const { token, userId } = await authService.loginWithGoogle(req.body);
      res.status(200).json({ message: 'Autenticação com Google bem-sucedida!', token, userId });
    } catch (error) {
      console.error('Erro no controlador de autenticação com Google:', error);
      const statusCode = error.status || 500;
      const message = error.message || 'Ocorreu um erro inesperado durante a autenticação com o Google.';
      res.status(statusCode).json({ message });
    }
  }
};

export default authControle;
