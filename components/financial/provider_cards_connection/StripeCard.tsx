
import React, { useState, useRef, useEffect } from 'react';
import { ProviderSettingsModal } from '../ProviderSettingsModal';

export const StripeCard = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isConnected = group?.paymentConfig?.stripe?.isConnected;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const providerData = {
        id: 'stripe',
        name: 'Stripe',
        icon: 'fa-brands fa-stripe',
        credentials: [
            { id: 'secretKey', label: 'Chave Secreta', type: 'password' },
        ]
    };

    return (
        <div className="provider-card">
            <div className="provider-icon"><i className="fa-brands fa-stripe"></i></div>
            <div className="provider-name">Stripe</div>
            {activeProviderId === 'stripe' && <div className="active-indicator">Ativo</div>}

            <div className="options-button" onClick={() => setMenuOpen(!menuOpen)}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>

            {menuOpen && (
                <div className="options-menu" ref={menuRef}>
                    <button onClick={() => { setIsModalOpen(true); setMenuOpen(false); }}>
                        {isConnected ? 'Atualizar Credenciais' : 'Preencher Credenciais'}
                    </button>
                    {isConnected && (
                        <button onClick={() => { onSelectProvider('stripe'); setMenuOpen(false); }}>
                            Escolher esse provedor
                        </button>
                    )}
                    {isConnected && (
                        <button className="disconnect" onClick={() => { onDisconnect('stripe'); setMenuOpen(false); }}>
                            Desconectar
                        </button>
                    )}
                </div>
            )}

            {isModalOpen && (
                <ProviderSettingsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(credentials) => onCredentialsSubmit('stripe', credentials)}
                    provider={providerData}
                    existingConfig={group?.paymentConfig?.stripe}
                />
            )}
        </div>
    );
};
