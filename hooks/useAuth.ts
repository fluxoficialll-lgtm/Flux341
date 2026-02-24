
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../ServiçosFrontend/ServiçoDeSimulação/FabricaDeServicos';

// Este evento customizado notificará o hook sobre mudanças de estado de autenticação.
const dispatchAuthChange = () => {
  window.dispatchEvent(new CustomEvent('authChange'));
};

// Modificando o authService para disparar o evento
const originalLogin = authService.login;
authService.login = async (...args) => {
  const result = await originalLogin.apply(authService, args);
  dispatchAuthChange();
  return result;
};

const originalLoginWithGoogle = authService.loginWithGoogle;
authService.loginWithGoogle = async (...args) => {
  const result = await originalLoginWithGoogle.apply(authService, args);
  dispatchAuthChange();
  return result;
};

const originalLogout = authService.logout;
authService.logout = (...args) => {
  originalLogout.apply(authService, args);
  dispatchAuthChange();
};

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  const verifyAuth = useCallback(async () => {
    setLoading(true);
    try {
      const isAuth = await authService.confirmAuthentication();
      const currentUser = isAuth ? authService.getCurrentUser() : null;
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth(); // Verificação inicial

    window.addEventListener('authChange', verifyAuth);

    return () => {
      window.removeEventListener('authChange', verifyAuth);
    };
  }, [verifyAuth]);

  return { user, loading };
};
