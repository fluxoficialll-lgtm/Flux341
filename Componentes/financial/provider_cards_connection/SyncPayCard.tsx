
import React, { useState } from 'react';
import { ProviderCredentialsModal } from '../ProviderCredentialsModal';

export const SyncPayCard = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isConnected = group?.paymentConfig?.syncpay?.isConnected;

    const handleCardClick = () => {
        if (isConnected) {
            onSelectProvider('syncpay');
        }
    };

    return (
        <>
            <div className={`provider-card ${isConnected ? 'clickable' : ''}`} onClick={handleCardClick}>
                <div className="provider-icon"><i className="fa-solid fa-bolt"></i></div>
                <div className="provider-name">SyncPay</div>
                {activeProviderId === 'syncpay' && <div className="active-indicator">Ativo</div>}
                
                <div className="options-button" onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>

            <ProviderCredentialsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                providerId="syncpay"
                providerName="SyncPay"
                onConnect={(credentials) => onCredentialsSubmit('syncpay', credentials)}
                onDisconnect={() => onDisconnect('syncpay')}
                existingConfig={group?.paymentConfig?.syncpay}
            />
        </>
    );
};
