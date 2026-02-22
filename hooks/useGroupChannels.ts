
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../ServiçosDoFrontend/groupService';
import { authService } from '../ServiçosDoFrontend/ServiçosDeAutenticacao/authService';
import { Group } from '../types';

export const useGroupChannels = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (id) {
            const foundGroup = groupService.getGroupById(id);
            if (foundGroup) {
                setGroup(foundGroup);
                const currentUserId = authService.getCurrentUserId();
                const isUserAdmin = foundGroup.creatorId === currentUserId || foundGroup.adminIds?.includes(currentUserId || '');
                setIsAdmin(!!isUserAdmin);
            } else {
                navigate('/groups');
            }
            setLoading(false);
        }
    }, [id, navigate]);

    const handleChannelClick = useCallback((channelId: string) => {
        if(id) {
            navigate(`/group-chat/${id}/${channelId}`);
        }
    }, [id, navigate]);

    const handleBack = useCallback(() => {
        navigate('/groups');
    }, [navigate]);

    return {
        group,
        loading,
        isAdmin,
        handleChannelClick,
        handleBack
    };
};
