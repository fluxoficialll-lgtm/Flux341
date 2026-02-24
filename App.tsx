
import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { ModalProvider } from './Componentes/ModalSystem';
import { GlobalTracker } from './Componentes/layout/GlobalTracker';
import { DeepLinkHandler } from './Componentes/layout/DeepLinkHandler';
import AppRoutes from './routes/AppRoutes';
import { useAuthSync } from './hooks/useAuthSync';
import { ControleDeSimulacao } from './ServiçosFrontend/ServiçoDeSimulação/ControleDeSimulacao.js';
import { ConfigControl } from './ServiçosFrontend/ServiçoDeGovernançaFlux/ConfigControl.js';
import { Maintenance } from './pages/Maintenance';
import MonitorDeErrosDeInterface from './Componentes/ComponentesDePrevençãoDeErros/MonitorDeErrosDeInterface.jsx';

const DemoModeBadge = () => {
    if (!ControleDeSimulacao.isMockMode()) return null;
    return (
        <div className="fixed bottom-24 left-4 z-[100] animate-fade-in pointer-events-none">
            <div className="flex items-center gap-2 bg-yellow-500/10 backdrop-blur-md border border-yellow-500/50 px-3 py-1.5 rounded-full shadow-lg">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Modo Simulação</span>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useAuthSync();

  useEffect(() => {
    if (import.meta.env.DEV) {
        console.log('🔵 [DIAGNÓSTICO 2/3] window.fetch em App.tsx:', window.fetch.toString());
    }

    const initializeApp = async () => {
      const bootTimeout = setTimeout(() => {
        if (!isReady) {
            console.warn("⏱️ [Boot] Timeout de segurança atingido. Forçando entrada...");
            setIsReady(true);
            setIsMaintenance(false);
        }
      }, 5000);

      try {
        const getParam = (key: string) => {
            const searchParams = new URLSearchParams(window.location.search);
            if (searchParams.has(key)) return searchParams.get(key);
            const hashPart = window.location.hash.split('?')[1];
            if (hashPart) {
                const hashParams = new URLSearchParams(hashPart);
                return hashParams.get(key);
            }
            return null;
        };

        const forceOpen = getParam('ignoreMaintenance') === 'true' || getParam('force') === 'true';

        const config = await ConfigControl.boot(); 
        
        const shouldShowMaintenance = config.maintenanceMode === true && !ControleDeSimulacao.isMockMode() && !forceOpen;
        
        setIsMaintenance(shouldShowMaintenance);
      } catch (e) {
        console.error("Erro crítico no boot do sistema:", e);
        setIsMaintenance(false); 
      } finally {
        clearTimeout(bootTimeout);
        setIsReady(true);
      }
    };
    
    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Iniciando Protocolos...
        </span>
      </div>
    );
  }

  if (isMaintenance) {
    return <Maintenance />;
  }

  return (
    <MonitorDeErrosDeInterface>
      <ModalProvider>
        <HashRouter>
          <GlobalTracker />
          <DeepLinkHandler />
          <DemoModeBadge />
          <AppRoutes />
        </HashRouter>
      </ModalProvider>
    </MonitorDeErrosDeInterface>
  );
};

export default App;
