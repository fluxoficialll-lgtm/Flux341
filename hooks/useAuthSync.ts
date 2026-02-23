
import { useEffect } from 'react';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService.js';
import { ServicoDeSincronizacaoDeSessao } from '../ServiçosFrontend/ServiçoDeSincronização/ServicoDeSincronizacaoDeSessao.js';
import { SyncState } from '../ServiçosFrontend/ServiçoDeSincronização/EstadoDeSincronizacao.js';
import { socketService } from '../ServiçosFrontend/ServiçoDeSoquete/ServiçoDeSoquete.js';
import { RealtimePaymentHandler } from '../ServiçosFrontend/ServiçoDeTempoReal/Notificações/ManipuladorDePagamentoEmTempoReal.js';

export const useAuthSync = () => {
  useEffect(() => {
    const email = authService.getCurrentUserEmail();
    
    // 1. Serviços de tempo real apenas se logado
    if (email) {
        socketService.connect();
        RealtimePaymentHandler.init();
    }

    // 2. Sempre tenta a inicialização para liberar a hidratação (mesmo para guests)
    const initializeSync = async () => {
        if (email && SyncState.shouldDoFullSync()) {
            await ServicoDeSincronizacaoDeSessao.performFullSync();
            SyncState.recordFullSync(); // Marca que a sincronização foi feita
        } else {
            // performBackgroundSync disparará os workers que marcam como ready
            await ServicoDeSincronizacaoDeSessao.performBackgroundSync();
        }
    };

    initializeSync();

    // 3. Batimento cardíaco e Sync Periódico
    const heartbeatInterval = setInterval(() => {
      if (authService.getCurrentUserEmail()) {
        authService.updateHeartbeat();
      }
    }, 60000);

    const backgroundSyncInterval = setInterval(() => {
      if (authService.getCurrentUserEmail()) {
        ServicoDeSincronizacaoDeSessao.performBackgroundSync();
      }
    }, 300000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(backgroundSyncInterval);
      socketService.disconnect();
    };
  }, []);
};
