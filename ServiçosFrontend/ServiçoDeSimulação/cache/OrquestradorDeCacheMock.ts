
import { sqlite } from './engine';
import { USE_MOCKS, MOCK_USERS, MOCK_POSTS, MOCK_GROUPS, MOCK_CHATS, MOCK_NOTIFICATIONS, MOCK_PRODUCTS, MOCK_CAMPAIGNS } from '../dados/DadosSimulados.js';

export const initializeCache = () => {
    // Apenas preenche se estiver em desenvolvimento e o cache estiver vazio
    if (USE_MOCKS) {
        console.log("MODO DEV: A verificar o preenchimento de dados de simulação...");

        const users = sqlite.getTableData('users');
        if (users.length === 0) {
            console.log("MODO DEV: A preencher a tabela 'users' com dados de simulação.");
            sqlite.saveTableData('users', Object.values(MOCK_USERS));
        }

        const posts = sqlite.getTableData('posts');
        if (posts.length === 0) {
            console.log("MODO DEV: A preencher a tabela 'posts' com dados de simulação.");
            sqlite.saveTableData('posts', MOCK_POSTS);
        }

        const groups = sqlite.getTableData('groups');
        if (groups.length === 0) {
            console.log("MODO DEV: A preencher a tabela 'groups' com dados de simulação.");
            sqlite.saveTableData('groups', MOCK_GROUPS);
        }

        const chats = sqlite.getTableData('chats');
        if (chats.length === 0) {
            console.log("MODO DEV: A preencher a tabela 'chats' com dados de simulação.");
            sqlite.saveTableData('chats', MOCK_CHATS);
        }
        
        const notifications = sqlite.getTableData('notifications');
        if (notifications.length === 0) {
            console.log("MODO DEV: A preencher a tabela 'notifications' com dados de simulação.");
            sqlite.saveTableData('notifications', MOCK_NOTIFICATIONS);
        }

        const marketplace = sqlite.getTableData('marketplace');
        if (marketplace.length === 0) {
            console.log("MODO DEV: A preencher a tabela 'marketplace' com dados de simulação.");
            sqlite.saveTableData('marketplace', MOCK_PRODUCTS);
        }

        const ads = sqlite.getTableData('ads');
        if (ads.length === 0) {
            console.log("MODO DEV: A preencher a tabela 'ads' com dados de simulação.");
            sqlite.saveTableData('ads', MOCK_CAMPAIGNS);
        }
    }
};
