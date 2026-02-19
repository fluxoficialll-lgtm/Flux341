
import React, { useState } from 'react';
import { ProviderCredentialsModal } from '../ProviderCredentialsModal';

export const PayPalCard = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isConnected = group?.paymentConfig?.paypal?.isConnected;

    const handleCardClick = () => {
        if (isConnected) {
            onSelectProvider('paypal');
        }
    };

    return (
        <>
            <div className={`provider-card ${isConnected ? 'clickable' : ''}`} onClick={handleCardClick}>
                <div className="provider-icon"><i className="fa-brands fa-paypal"></i></div>
                <div className="provider-name">PayPal</div>
                {activeProviderId === 'paypal' && <div className="active-indicator">Ativo</div>}
                
                <div className="options-button" onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>

            <ProviderCredentialsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                providerId="paypal"
                providerName="PayPal"
                onConnect={(credentials) => onCredentialsSubmit('paypal', credentials)}
                onDisconnect={() => onDisconnect('paypal')}
                existingConfig={group?.paymentConfig?.paypal}
            />
        </>
    );
};
