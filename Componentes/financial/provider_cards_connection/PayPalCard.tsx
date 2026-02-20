
import React, { useState } from 'react';
import { Group } from '../../../types';

interface PayPalCardProps {
    group: Group | null;
    activeProviderId: string | null;
    onCredentialsSubmit: (providerId: string, credentials: any) => Promise<void>;
    onDisconnect: (providerId: string) => Promise<void>;
    onSelectProvider: (providerId: string) => Promise<void>;
}

export const PayPalCard: React.FC<PayPalCardProps> = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [clientId, setClientId] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const config = group?.paymentConfig?.paypal;
    const isConnected = !!config?.isConnected;
    const isActive = activeProviderId === 'paypal';

    const handleToggleForm = () => setIsFormVisible(!isFormVisible);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onCredentialsSubmit('paypal', { clientId, secretKey });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Falha ao salvar credenciais do PayPal", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDisconnect = async () => {
        if (window.confirm("Tem certeza que deseja desconectar o PayPal?")) {
            await onDisconnect('paypal');
        }
    };

    return (
        <div className={`provider-card ${isActive ? 'active-card' : ''}`}>
            <div className="provider-header">
                <div className="provider-title">
                    <i className="fa-brands fa-paypal"></i>
                    <span>PayPal</span>
                </div>
                <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                    <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
                    <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
                </div>
            </div>

            <div className="provider-actions flex flex-col gap-3">
                {!isConnected ? (
                    <button onClick={handleToggleForm} className="action-button primary">
                        CONECTAR
                    </button>
                ) : (
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white/60">Selecionar</span>
                            <div onClick={() => onSelectProvider('paypal')} className={`select-switch ${isActive ? 'selected' : ''}`}>
                                <div className="select-switch-handle"></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleToggleForm} className="action-button">
                                {isFormVisible ? 'CANCELAR' : 'ATUALIZAR'}
                            </button>
                            <button onClick={handleDisconnect} className="action-button danger">
                                DESCONECTAR
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="credentials-form animate-fade-in">
                    <div className="form-group">
                        <label htmlFor="paypal-clientid">Client ID</label>
                        <input id="paypal-clientid" type="text" value={clientId} onChange={e => setClientId(e.target.value)} placeholder='AY...' />
                    </div>
                     <div className="form-group">
                        <label htmlFor="paypal-secretkey">Secret Key</label>
                        <input id="paypal-secretkey" type="password" value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder='••••••••' />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="form-button save" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Chaves'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
