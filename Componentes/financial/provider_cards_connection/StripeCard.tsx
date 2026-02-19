
import React, { useState } from 'react';
import { ProviderCredentialsModal } from '../ProviderCredentialsModal';

export const StripeCard = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isConnected = group?.paymentConfig?.stripe?.isConnected;

    const handleCardClick = () => {
        if (isConnected) {
            onSelectProvider('stripe');
        }
    };

    return (
        <>
            <div className={`provider-card ${isConnected ? 'clickable' : ''}`} onClick={handleCardClick}>
                <div className="provider-icon"><i className="fa-brands fa-stripe"></i></div>
                <div className="provider-name">Stripe</div>
                {activeProviderId === 'stripe' && <div className="active-indicator">Ativo</div>}
                
                <div className="options-button" onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>

            <ProviderCredentialsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                providerId="stripe"
                providerName="Stripe"
                onConnect={(credentials) => onCredentialsSubmit('stripe', credentials)}
                onDisconnect={() => onDisconnect('stripe')}
                existingConfig={group?.paymentConfig?.stripe}
            />
        </>
    );
};
