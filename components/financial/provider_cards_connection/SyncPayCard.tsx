
import React, { useState, useRef, useEffect } from 'react';
import { ProviderSettingsModal } from '../ProviderSettingsModal';

export const SyncPayCard = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isConnected = group?.paymentConfig?.syncpay?.isConnected;

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
        id: 'syncpay',
        name: 'SyncPay',
        icon: 'fa-bolt',
        credentials: [
            { id: 'publicKey', label: 'Chave Pública', type: 'text' },
            { id: 'privateKey', label: 'Chave Privada', type: 'password' },
        ]
    };

    return (
        <div className="provider-card">
            <div className="provider-icon"><i className="fa-solid fa-bolt"></i></div>
            <div className="provider-name">SyncPay</div>
            {activeProviderId === 'syncpay' && <div className="active-indicator">Ativo</div>}
            
            <div className="options-button" onClick={() => setMenuOpen(!menuOpen)}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>

            {menuOpen && (
                <div className="options-menu" ref={menuRef}>
                    <button onClick={() => { setIsModalOpen(true); setMenuOpen(false); }}>
                        {isConnected ? 'Atualizar Credenciais' : 'Preencher Credenciais'}
                    </button>
                    {isConnected && (
                        <button onClick={() => { onSelectProvider('syncpay'); setMenuOpen(false); }}>
                            Escolher esse provedor
                        </button>
                    )}
                    {isConnected && (
                        <button className="disconnect" onClick={() => { onDisconnect('syncpay'); setMenuOpen(false); }}>
                            Desconectar
                        </button>
                    )}
                </div>
            )}

            {isModalOpen && (
                <ProviderSettingsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(credentials) => onCredentialsSubmit('syncpay', credentials)}
                    provider={providerData}
                    existingConfig={group?.paymentConfig?.syncpay}
                />
            )}
        </div>
    );
};
