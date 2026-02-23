
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { notificationService } from '../ServiçosFrontend/ServiçoDeNotificação/notificationService.js';
import { relationshipService } from '../ServiçosFrontend/ServiçoDeRelacionamento/relationshipService.js';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { geoService, GeoData } from '../ServiçosFrontend/ServiçoDeGeolocalização/geoService.js';
import { currencyService, ConversionResult } from '../ServiçosFrontend/ServiçoDeMoeda/currencyService.js';
import { NotificationItem, Group, EnrichedNotificationItem } from '../types';
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';

export const useNotifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<EnrichedNotificationItem[]>([]);
    const [filter, setFilter] = useState<string>('all');

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [geoData, setGeoData] = useState<GeoData | null>(null);
    const [displayPriceInfo, setDisplayPriceInfo] = useState<ConversionResult | null>(null);

    useEffect(() => {
        const userEmail = authService.getCurrentUserEmail();
        if (!userEmail) {
            navigate('/');
            return;
        }

        const loadNotifications = () => {
            const rawData = notificationService.getNotifications();
            const enrichedData = rawData.map(n => {
                const user = authService.getUserByHandle(n.username);
                if (user) {
                    return {
                        ...n,
                        displayName: user.profile?.nickname || user.profile?.name || n.username,
                        username: n.username,
                        avatar: user.profile?.photoUrl || n.avatar
                    };
                }
                return { ...n, displayName: n.username };
            });
            setNotifications(enrichedData);
        };

        loadNotifications();
        notificationService.markAllAsRead();
        const unsubscribe = servicoDeSimulacao.subscribe('notifications', loadNotifications);
        return () => unsubscribe();
    }, [navigate]);

    const handleFollowToggle = useCallback(async (id: number, username: string) => {
        const isCurrentlyFollowing = relationshipService.isFollowing(username) === 'following';
        if (isCurrentlyFollowing) {
            await relationshipService.unfollowUser(username);
        } else {
            await relationshipService.followUser(username);
        }
        // We can optionally update the state optimistically or wait for the next data load
    }, []);

    const handlePendingAction = useCallback(async (action: 'accept' | 'reject', notification: EnrichedNotificationItem) => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
        try {
            if (notification.subtype === 'friend') {
                if (action === 'accept') {
                    await relationshipService.acceptFollowRequest(notification.username);
                } else {
                    await relationshipService.rejectFollowRequest(notification.username);
                }
            }
            notificationService.removeNotification(notification.id);
        } catch (error) {
            console.error("Error handling notification action:", error);
            // Maybe re-add the notification to the list if the action fails
        }
    }, []);

    const handleIgnoreExpiring = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        notificationService.removeNotification(id);
    }, []);

    const handlePayClick = useCallback(async (groupId: string) => {
        const foundGroup = groupService.getGroupById(groupId);
        if (!foundGroup) return;

        setSelectedGroup(foundGroup);

        const detectedGeo = await geoService.detectCountry();
        setGeoData(detectedGeo);

        const baseCurrency = foundGroup.currency || 'BRL';
        const basePrice = parseFloat(foundGroup.price || '0');
        const targetCurrency = detectedGeo.currency || 'BRL';

        const conversion = await currencyService.convert(basePrice, baseCurrency, targetCurrency);
        setDisplayPriceInfo(conversion);

        setIsPaymentModalOpen(true);
    }, []);

    const filteredNotifications = useMemo(() => notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'pending') {
            return n.type === 'pending' || n.type === 'expiring_vip';
        }
        return n.type === filter;
    }), [notifications, filter]);

    return {
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
        navigate // Pass navigate for simple navigation actions
    };
};
