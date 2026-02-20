
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../ServiçosDoFrontend/groupService';
import { paypalService } from '../ServiçosDoFrontend/ServiçosDeProvedores/paypalService';
import { stripeService } from '../ServiçosDoFrontend/ServiçosDeProvedores/stripeService';
import { syncPayService } from '../ServiçosDoFrontend/ServiçosDeProvedores/syncPayService';
import { Group } from '../types';
import { SyncPayCard } from '../Componentes/financial/provider_cards_connection/SyncPayCard';
import { StripeCard } from '../Componentes/financial/provider_cards_connection/StripeCard';
import { PayPalCard } from '../Componentes/financial/provider_cards_connection/PayPalCard';
import '../Componentes/financial/provider_cards_connection/ProviderCard.css';

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
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <header className="flex items-center justify-between p-4 bg-[#0c0f14] fixed w-full z-10 border-b border-white/10 top-0 h-[65px]">
                <button onClick={handleBack} aria-label="Voltar"><i className="fa-solid fa-arrow-left"></i></button>
                <h1 className="text-[20px] font-semibold">Provedores de Pagamento</h1>
                <div style={{width: '24px'}}></div>
            </header>
            <main className="pt-[80px] pb-[40px] w-full max-w-[600px] mx-auto px-5 flex flex-col gap-4">
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
