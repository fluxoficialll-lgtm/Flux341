
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';

export const useBanned = () => {
    const navigate = useNavigate();
    const [reason, setReason] = useState('Violação das diretrizes da comunidade.');
    const user = authService.getCurrentUser();

    useEffect(() => {
        if (user && user.isBanned) {
            setReason(user.banReason || 'Violação das diretrizes da comunidade.');
        } else if (user && !user.isBanned) {
            navigate('/feed', { replace: true });
        } else if (!user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/', { replace: true });
    };

    return { reason, handleLogout };
};
