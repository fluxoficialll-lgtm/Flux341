
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// Corrigido o caminho para importar o authService do factory, garantindo que o mock seja usado.
import { authService } from '../../ServiçosFrontend/ServiçoDeSimulação/serviceFactory';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rotas. Ele verifica se o usuário está autenticado.
 * Se não estiver, redireciona para a página de login.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // [CORREÇÃO]
  // O método `getCurrentUser` não era ideal para o mock. 
  // O método `isAuthenticated` é mais direto e compatível com ambos os serviços (real e mock),
  // pois ele simplesmente verifica se existe um estado de autenticação válido (ex: no sessionStorage).
  const isUserAuthenticated = authService.isAuthenticated();

  if (!isUserAuthenticated) {
    // Salva a rota atual para que possamos redirecionar o usuário de volta para ela após o login.
    if (location.pathname !== '/' && !location.pathname.includes('login')) {
      sessionStorage.setItem('redirect_after_login', location.pathname + location.search);
    }
    
    // Redireciona para a página de login, passando a localização atual.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /*
    Opcional: Se precisarmos de dados do usuário, podemos buscá-los aqui.
    No entanto, para a lógica de proteção de rota, `isAuthenticated` é suficiente.
    const user = authService.getCurrentUser();
    if (user && user.isBanned) {
        return <Navigate to="/banned" replace />;
    }
  */

  return <>{children}</>;
};
