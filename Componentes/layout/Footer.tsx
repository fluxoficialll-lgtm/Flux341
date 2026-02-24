
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { servicoDeSimulacao } from '../../ServiçosFrontend/ServiçoDeSimulação';

interface FooterProps {
    visible?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ visible = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const [unreadMsgs, setUnreadMsgs] = useState(0);

    const updateCounts = useCallback(async () => {
        const { notificationService } = await import('../../ServiçosFrontend/ServiçoDeNotificação/notificationService.js');
        const { chatService } = await import('../../ServiçosFrontend/ServiçoDeChat/chatService.js');
        const { authService } = await import('../../ServiçosFrontend/ServiçoDeAutenticação/authService.js');
        const { groupService } = await import('../../ServiçosFrontend/ServiçoDeGrupos/groupService.js');

        try {
            const notifCount = await notificationService.getUnreadCount();
            const msgCount = await chatService.getUnreadCount();
            // Adicione chamadas para outros serviços se necessário, por exemplo:
            // const authCount = await authService.getUnreadCount();
            // const groupCount = await groupService.getUnreadCount();

            setUnreadNotifs(notifCount);
            setUnreadMsgs(msgCount);
        } catch (error) {
            console.error("Erro ao atualizar contagens:", error);
        }
    }, []);

    useEffect(() => {
        updateCounts();
        
        const unsubNotif = servicoDeSimulacao.subscribe('notifications', updateCounts);
        const unsubChat = servicoDeSimulacao.subscribe('chats', updateCounts);
        
        return () => {
            unsubNotif();
            unsubChat();
        };
    }, [updateCounts]);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <footer className={`fixed bottom-0 left-0 w-full bg-[#0c0f14] flex justify-around py-3.5 rounded-t-2xl z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
            <button 
                onClick={() => navigate('/feed')} 
                className={`text-[22px] p-2 transition-all hover:text-white ${isActive('/feed') ? 'text-white' : 'text-[#00c2ff]'}`}
            >
                <i className="fa-solid fa-newspaper"></i>
            </button>
            
            <button 
                onClick={() => navigate('/messages')} 
                className={`text-[22px] p-2 relative transition-all hover:text-white ${isActive('/messages') ? 'text-white' : 'text-[#00c2ff]'}`}
            >
                <i className="fa-solid fa-comments"></i>
                {unreadMsgs > 0 && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ff4d4d] rounded-full border border-[#0c0f14]"></div>
                )}
            </button>
            
            <button 
                onClick={() => navigate('/notifications')} 
                className={`text-[22px] p-2 relative transition-all hover:text-white ${isActive('/notifications') ? 'text-white' : 'text-[#00c2ff]'}`}
            >
                <i className="fa-solid fa-bell"></i>
                {unreadNotifs > 0 && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ff4d4d] rounded-full border border-[#0c0f14]"></div>
                )}
            </button>
            
            <button 
                onClick={() => navigate('/profile')} 
                className={`text-[22px] p-2 transition-all hover:text-white ${isActive('/profile') ? 'text-white' : 'text-[#00c2ff]'}`}
            >
                <i className="fa-solid fa-user"></i>
            </button>
        </footer>
    );
};
