
import { useEffect } from 'react';
import { authService } from '../ServiçosDoFrontend/ServiçosDeAutenticacao/authService';
import { AccountSyncService } from '../ServiçosDoFrontend/sync/AccountSyncService';
import { SyncState } from '../ServiçosDoFrontend/sync/SyncState';
import { socketService } from '../ServiçosDoFrontend/socketService';
import { RealtimePaymentHandler } from '../ServiçosDoFrontend/real/notifications/RealtimePaymentHandler';

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
            await AccountSyncService.performFullSync();
        } else {
            // performBackgroundSync disparará os workers que marcam como ready
            await AccountSyncService.performBackgroundSync();
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
        AccountSyncService.performBackgroundSync();
      }
    }, 300000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(backgroundSyncInterval);
      socketService.disconnect();
    };
  }, []);
};
