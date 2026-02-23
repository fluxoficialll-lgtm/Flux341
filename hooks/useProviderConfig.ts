
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { paypalService } from '../ServiçosFrontend/ServiçosDeProvedores/paypalService';
import { stripeService } from '../ServiçosFrontend/ServiçosDeProvedores/stripeService';
import { syncPayService } from '../ServiçosFrontend/ServiçosDeProvedores/syncPayService';
import { Group } from '../types';

export const useProviderConfig = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [activeProviderId, setActiveProviderId] = useState<string | null>(null);

    const updateGroupState = useCallback(() => {
        if (groupId) {
            const updatedGroup = groupService.getGroupById(groupId);
            setGroup(updatedGroup ?? null);
            setActiveProviderId(updatedGroup?.activePaymentProvider || null);
        }
    }, [groupId]);

    useEffect(() => {
        updateGroupState();
    }, [updateGroupState]);

    const handleCredentialsSubmit = useCallback(async (providerId: string, credentials: any) => {
        if (!groupId) return;

        const serviceMap: { [key: string]: () => Promise<any> } = {
            paypal: () => paypalService.authenticate(credentials.credentials, credentials.secretKey),
            stripe: () => stripeService.authenticate(credentials.secretKey),
            syncpay: () => syncPayService.authenticate(credentials.publicKey, credentials.privateKey),
        };

        try {
            await serviceMap[providerId]();
            const config = { isConnected: true, ...credentials };
            await groupService.updateGroupPaymentConfig(groupId, { [providerId]: config });

            const currentGroup = groupService.getGroupById(groupId);
            if (!currentGroup?.activePaymentProvider) {
                await groupService.updateGroup({ ...currentGroup, id: groupId, activePaymentProvider: providerId });
            }

            updateGroupState();
        } catch (error) {
            console.error(`Falha ao conectar ${providerId}:`, error);
            throw error;
        }
    }, [groupId, updateGroupState]);

    const handleDisconnect = useCallback(async (providerId: string) => {
        if (!groupId) return;

        try {
            await groupService.updateGroupPaymentConfig(groupId, { [providerId]: { isConnected: false } });

            if (activeProviderId === providerId) {
                const currentGroup = groupService.getGroupById(groupId);
                await groupService.updateGroup({ ...currentGroup, id: groupId, activePaymentProvider: null });
            }

            updateGroupState();
        } catch (error) {
            console.error(`Falha ao desconectar ${providerId}:`, error);
            throw error;
        }
    }, [groupId, activeProviderId, updateGroupState]);

    const handleSelectProvider = useCallback(async (providerId: string) => {
        const currentGroup = groupService.getGroupById(groupId);
        if (!groupId || !currentGroup?.paymentConfig?.[providerId]?.isConnected) return;
        await groupService.updateGroup({ ...currentGroup, id: groupId, activePaymentProvider: providerId });
        updateGroupState();
    }, [groupId, updateGroupState]);

    return {
        group,
        activeProviderId,
        handleCredentialsSubmit,
        handleDisconnect,
        handleSelectProvider
    };
};
