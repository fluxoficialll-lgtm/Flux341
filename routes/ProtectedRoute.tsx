
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Verificando Credenciais...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return element;
};
