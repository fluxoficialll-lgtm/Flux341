
import { useCallback } from 'react';
import { NotificationItem } from '../types';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService.js';
import { useNavigate } from 'react-router-dom';

interface NotificationHandlerProps {
    notif: NotificationItem & { displayName?: string };
    onFollowToggle: (id: number, username: string) => void;
    onPendingAction: (action: 'accept' | 'reject', notification: any) => void;
}

export const useNotificationHandler = ({
    notif,
    onFollowToggle,
    onPendingAction,
}: NotificationHandlerProps) => {
    const navigate = useNavigate();

    const handleCardClick = useCallback(() => {
        if (notif.type !== 'pending') {
            const path = notif.relatedPostId 
                ? `/post/${notif.relatedPostId}`
                : `/user/${notif.username.replace('@','')}`;
            navigate(path);
        }
    }, [notif, navigate]);

    const handleFollow = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onFollowToggle(notif.id, notif.username);
    }, [notif, onFollowToggle]);

    const handleAccept = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onPendingAction('accept', notif);
    }, [notif, onPendingAction]);

    const handleReject = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onPendingAction('reject', notif);
    }, [notif, onPendingAction]);

    const formattedTime = postService.formatRelativeTime(notif.timestamp);

    return {
        handleCardClick,
        handleFollow,
        handleAccept,
        handleReject,
        formattedTime,
    };
};
