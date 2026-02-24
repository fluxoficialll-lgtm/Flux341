
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../ServiçosFrontend/ServiçoDeNotificação/notificationService.js';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService.js';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService.js';
import { geoService } from '../ServiçosFrontend/ServiçoDeGeolocalizacao/geoService.js';
import { NotificationItem, Group, GeoData, PriceInfo } from '../types';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [geoData, setGeoData] = useState<GeoData | null>(null);
    const [displayPriceInfo, setDisplayPriceInfo] = useState<PriceInfo | null>(null);
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedNotifications = await notificationService.getNotifications();
            const notificationsWithDisplayNames = await Promise.all(
                fetchedNotifications.map(async (notif) => {
                    const user = await authService.fetchUserByHandle(notif.username);
                    return { ...notif, displayName: user?.profile?.nickname || user?.profile?.name || notif.username };
                })
            );
            setNotifications(notificationsWithDisplayNames);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            const token = authService.getToken();
            if (!token) { 
                navigate('/'); // Redireciona se não houver token
                return; 
            }
            
            await fetchNotifications();
            
            try {
                // CORREÇÃO: Passar o token e usar await
                const geoInfo = await geoService.getGeoInfo(token);
                setGeoData(geoInfo);
            } catch (error) {
                console.error("Erro ao buscar informações de geolocalização:", error);
            }
        };

        loadInitialData();
    }, [fetchNotifications, navigate]);

    const handleFollowToggle = useCallback(async (id: number, username: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isFollowing: !n.isFollowing } : n));
        try {
            await notificationService.toggleFollow(username);
        } catch (error) {
            console.error("Erro ao seguir/deixar de seguir:", error);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isFollowing: !n.isFollowing } : n));
        }
    }, []);

    const handlePendingAction = useCallback(async (action: 'accept' | 'reject', notification: any) => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
        try {
            await notificationService.handlePendingAction(action, notification);
        } catch (error) {
            console.error("Erro ao processar ação pendente:", error);
            setNotifications(prev => [notification, ...prev]);
        }
    }, []);

    const handleIgnoreExpiring = useCallback((groupId: string) => {
        notificationService.ignoreExpiringVip(groupId);
        setNotifications(prev => prev.filter(n => !(n.type === 'expiring_vip' && n.relatedGroupId === groupId)));
    }, []);

    const handlePayClick = useCallback(async (group: Group) => {
        setSelectedGroup(group);
        const price = group.prices?.monthly?.brl || 5;
        const priceInfo: PriceInfo = { BRL: { monthly: price, annual: price * 10 }, USD: { monthly: 5, annual: 50 } };
        setDisplayPriceInfo(priceInfo);
        setIsPaymentModalOpen(true);
    }, []);

    const filteredNotifications = useMemo(() => {
        return notifications.filter(notif => {
            if (filter === 'all') return true;
            if (filter === 'mentions') return notif.type === 'mention';
            if (filter === 'follow') return notif.type === 'follow';
            if (filter === 'likes') return notif.type === 'like';
            return false;
        });
    }, [notifications, filter]);

    return {
        notifications,
        isLoading,
        filter,
        setFilter,
        filteredNotifications,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        selectedGroup,
        geoData,
        displayPriceInfo,
        handleFollowToggle,
        handlePendingAction,
        handleIgnoreExpiring,
        handlePayClick,
        navigate,
    };
};
