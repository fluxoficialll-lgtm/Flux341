import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { rastreadorDeEventos } from '../../ServiçosFrontend/ServiçoDeTelemetria/RastreadorDeEventos';

/**
 * Componente de Ordem Superior para Rastreamento Global de Visualizações de Página.
 * Otimizado para React Router v6.
 */
export const GlobalTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // O evento é disparado toda vez que o objeto `location` muda.
    rastreadorDeEventos.trackPageView(location.pathname + location.search);

  // Adicionado `location` como dependência para rastrear cada mudança de rota.
  }, [location]);

  // Correção: Vite utiliza `import.meta.env.MODE` em vez de `process.env.NODE_ENV`
  // para acessar variáveis de ambiente no lado do cliente.
  // A variável `NODE_ENV` não é exposta ao navegador por padrão no Vite para evitar vazamento de informações sensíveis.
  const isDevelopmentMode = import.meta.env.MODE === 'development';

  useEffect(() => {
    const handleDevInfo = (event: KeyboardEvent) => {
      if (isDevelopmentMode && event.ctrlKey && event.key === 'i') {
        console.log("===== [DEV INFO] =====");
        console.log("Current Route:", location.pathname);
        console.log("Modo da Aplicação:", import.meta.env.MODE);
        console.log("Configuração do Vite:", import.meta.env);
        console.log("======================");
      }
    };

    window.addEventListener('keydown', handleDevInfo);
    return () => window.removeEventListener('keydown', handleDevInfo);
  }, [location, isDevelopmentMode]);

  // Este componente não renderiza nada na DOM.
  return null; 
};
