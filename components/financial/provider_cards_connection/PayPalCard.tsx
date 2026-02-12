
import React, { useState, useRef, useEffect } from 'react';
import { ProviderSettingsModal } from '../ProviderSettingsModal';

export const PayPalCard = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isConnected = group?.paymentConfig?.paypal?.isConnected;

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
        id: 'paypal',
        name: 'PayPal',
        icon: 'fa-brands fa-paypal',
        credentials: [
            { id: 'credentials', label: 'Credenciais', type: 'text' },
            { id: 'secretKey', label: 'Chave Secreta', type: 'password' },
        ]
    };

    return (
        <div className="provider-card">
            <div className="provider-icon"><i className="fa-brands fa-paypal"></i></div>
            <div className="provider-name">PayPal</div>
            {activeProviderId === 'paypal' && <div className="active-indicator">Ativo</div>}

            <div className="options-button" onClick={() => setMenuOpen(!menuOpen)}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>

            {menuOpen && (
                <div className="options-menu" ref={menuRef}>
                    <button onClick={() => { setIsModalOpen(true); setMenuOpen(false); }}>
                        {isConnected ? 'Atualizar Credenciais' : 'Preencher Credenciais'}
                    </button>
                    {isConnected && (
                        <button onClick={() => { onSelectProvider('paypal'); setMenuOpen(false); }}>
                            Escolher esse provedor
                        </button>
                    )}
                    {isConnected && (
                        <button className="disconnect" onClick={() => { onDisconnect('paypal'); setMenuOpen(false); }}>
                            Desconectar
                        </button>
                    )}
                </div>
            )}

            {isModalOpen && (
                <ProviderSettingsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(credentials) => onCredentialsSubmit('paypal', credentials)}
                    provider={providerData}
                    existingConfig={group?.paymentConfig?.paypal}
                />
            )}
        </div>
    );
};
