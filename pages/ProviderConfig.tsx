
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { paypalService } from '../services/paypalService';
import { stripeService } from '../services/stripeService';
import { syncPayService } from '../services/syncPayService';
import { Group } from '../types';
import { SyncPayCard } from '../components/financial/provider_cards_connection/SyncPayCard';
import { StripeCard } from '../components/financial/provider_cards_connection/StripeCard';
import { PayPalCard } from '../components/financial/provider_cards_connection/PayPalCard';

export const ProviderConfig: React.FC = () => {
    const navigate = useNavigate();
    const { groupId } = useParams<{ groupId: string }>();

    const [group, setGroup] = useState<Group | null>(null);
    const [activeProviderId, setActiveProviderId] = useState<string | null>(null);

    useEffect(() => {
        if (groupId) {
            const currentGroup = groupService.getGroupById(groupId);
            if (currentGroup) {
                setGroup(currentGroup);
                setActiveProviderId(currentGroup.activePaymentProvider || null);
            }
        }
    }, [groupId]);

    const updateGroupState = () => {
        if (groupId) {
            const updatedGroup = groupService.getGroupById(groupId);
            setGroup(updatedGroup ?? null);
            setActiveProviderId(updatedGroup?.activePaymentProvider || null);
        }
    };

    const handleCredentialsSubmit = async (providerId: string, credentials: any) => {
        if (!groupId) return;

        const serviceMap = {
            paypal: () => paypalService.authenticate(credentials.credentials, credentials.secretKey),
            stripe: () => stripeService.authenticate(credentials.secretKey),
            syncpay: () => syncPayService.authenticate(credentials.publicKey, credentials.privateKey),
        };

        try {
            await serviceMap[providerId]();
            const config = { isConnected: true, ...credentials };
            await groupService.updateGroupPaymentProviderConfig(groupId, providerId, config);

            const currentGroup = groupService.getGroupById(groupId);
            if (!currentGroup?.activePaymentProvider) {
                await groupService.updateGroup(groupId, { activePaymentProvider: providerId });
            }

            updateGroupState();
        } catch (error) {
            console.error(`Falha ao conectar ${providerId}:`, error);
            throw error;
        }
    };

    const handleDisconnect = async (providerId: string) => {
        if (!groupId) return;

        try {
            await groupService.updateGroupPaymentProviderConfig(groupId, providerId, { isConnected: false });

            if (activeProviderId === providerId) {
                await groupService.updateGroup(groupId, { activePaymentProvider: null });
            }

            updateGroupState();
        } catch (error) {
            console.error(`Falha ao desconectar ${providerId}:`, error);
            throw error;
        }
    };

    const handleSelectProvider = async (providerId: string) => {
        if (!groupId || !group?.paymentConfig?.[providerId]?.isConnected) return;
        await groupService.updateGroup(groupId, { activePaymentProvider: providerId });
        updateGroupState();
    };

    const handleBack = () => navigate(-1);

    return (
        <div className="provider-config-page">
            <header>
                <button onClick={handleBack}><i className="fa-solid fa-arrow-left"></i></button>
                <h1>Provedores de Pagamento</h1>
            </header>
            <main>
                <SyncPayCard
                    group={group}
                    activeProviderId={activeProviderId}
                    onCredentialsSubmit={handleCredentialsSubmit}
                    onDisconnect={handleDisconnect}
                    onSelectProvider={handleSelectProvider}
                />
                <StripeCard
                    group={group}
                    activeProviderId={activeProviderId}
                    onCredentialsSubmit={handleCredentialsSubmit}
                    onDisconnect={handleDisconnect}
                    onSelectProvider={handleSelectProvider}
                />
                <PayPalCard
                    group={group}
                    activeProviderId={activeProviderId}
                    onCredentialsSubmit={handleCredentialsSubmit}
                    onDisconnect={handleDisconnect}
                    onSelectProvider={handleSelectProvider}
                />
            </main>
        </div>
    );
};
