
import { sqlite } from './cache/engine';
import { initializeCache } from './cache/OrquestradorDeCacheMock';
import * as gestores from './gestores';

const CHAVE_ARMAZENAMENTO_ID_SESSAO = 'app_current_user_id';

class FachadaDeSimulacao {
    public users = gestores.userManager;
    public posts = gestores.postManager;
    public groups = gestores.groupManager;
    public chats = gestores.chatManager;
    public notifications = gestores.notificationManager;
    public relationships = gestores.relationshipManager;
    
    private fin = gestores.financialManager;
    public vipAccess = this.fin.vip;
    public marketplace = this.fin.marketplace;
    public ads = this.fin.ads;

    constructor() {
        initializeCache();
    }

    public subscribe = (table: any, cb: () => void) => sqlite.subscribe(table, cb);

    public auth = {
        currentUserId: () => localStorage.getItem(CHAVE_ARMAZENAMENTO_ID_SESSAO),
        setCurrentUserId: (id: string) => localStorage.setItem(CHAVE_ARMAZENAMENTO_ID_SESSAO, id),
        clearSession: () => {
            localStorage.removeItem(CHAVE_ARMAZENAMENTO_ID_SESSAO);
        }
    };
}

export const servicoDeSimulacao = new FachadaDeSimulacao();
