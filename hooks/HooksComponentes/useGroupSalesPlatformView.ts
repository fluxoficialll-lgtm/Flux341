
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { authService } from '../../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Group } from '../../types';

export const useGroupSalesPlatformView = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [canManage, setCanManage] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            const foundGroup = groupService.getGroupById(id);
            if (foundGroup) {
                setGroup(foundGroup);
                const currentUserId = authService.getCurrentUserId();
                const hasPower = foundGroup.creatorId === currentUserId || foundGroup.adminIds?.includes(currentUserId || '');
                setCanManage(hasPower);
            } else {
                navigate('/groups');
            }
            setLoading(false);
        }
    }, [id, navigate]);

    const handleFolderClick = useCallback((folderId: string) => {
        if (group) {
            navigate(`/group-folder/${group.id}/${folderId}`);
        }
    }, [group, navigate]);

    const handleChannelClick = useCallback((channelId: string) => {
        if (group) {
            navigate(`/group-chat/${group.id}/${channelId}`);
        }
    }, [group, navigate]);

    const handleBack = useCallback(() => {
        navigate('/groups');
    }, [navigate]);

    return {
        group,
        canManage,
        loading,
        handleFolderClick,
        handleChannelClick,
        handleBack
    };
};
