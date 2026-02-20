
import React, { useState } from 'react';
import { Group } from '../../../types';

interface StripeCardProps {
    group: Group | null;
    activeProviderId: string | null;
    onCredentialsSubmit: (providerId: string, credentials: any) => Promise<void>;
    onDisconnect: (providerId: string) => Promise<void>;
    onSelectProvider: (providerId: string) => Promise<void>;
}

export const StripeCard: React.FC<StripeCardProps> = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [secretKey, setSecretKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const config = group?.paymentConfig?.stripe;
    const isConnected = !!config?.isConnected;
    const isActive = activeProviderId === 'stripe';

    const handleToggleForm = () => setIsFormVisible(!isFormVisible);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onCredentialsSubmit('stripe', { secretKey });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Falha ao salvar credenciais do Stripe", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDisconnect = async () => {
        if (window.confirm("Tem certeza que deseja desconectar o Stripe?")) {
            await onDisconnect('stripe');
        }
    };

    return (
        <div className={`provider-card ${isActive ? 'active-card' : ''}`}>
            <div className="provider-header">
                <div className="provider-title">
                    <i className="fa-brands fa-stripe"></i>
                    <span>Stripe</span>
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
                            <div onClick={() => onSelectProvider('stripe')} className={`select-switch ${isActive ? 'selected' : ''}`}>
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
                        <label htmlFor="stripe-secretkey">Secret Key</label>
                        <input id="stripe-secretkey" type="password" value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder='sk_live_...' />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="form-button save" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Chave'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
