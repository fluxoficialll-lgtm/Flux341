
import React, { useState } from 'react';
import { Group } from '../../../types';

interface SyncPayCardProps {
    group: Group | null;
    activeProviderId: string | null;
    onCredentialsSubmit: (providerId: string, credentials: any) => Promise<void>;
    onDisconnect: (providerId: string) => Promise<void>;
    onSelectProvider: (providerId: string) => Promise<void>;
}

export const SyncPayCard: React.FC<SyncPayCardProps> = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const config = group?.paymentConfig?.syncpay;
    const isConnected = !!config?.isConnected;
    const isActive = activeProviderId === 'syncpay';

    const handleToggleForm = () => setIsFormVisible(!isFormVisible);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onCredentialsSubmit('syncpay', { publicKey, privateKey });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Falha ao salvar credenciais do SyncPay", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDisconnect = async () => {
        if (window.confirm("Tem certeza que deseja desconectar o SyncPay?")) {
            await onDisconnect('syncpay');
        }
    };

    return (
        <div className={`provider-card ${isActive ? 'active-card' : ''}`}>
            <div className="provider-header">
                <div className="provider-title">
                    <i className="fa-solid fa-bolt"></i>
                    <span>SyncPay</span>
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
                            <div onClick={() => onSelectProvider('syncpay')} className={`select-switch ${isActive ? 'selected' : ''}`}>
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
                        <label htmlFor="syncpay-publickey">Public Key</label>
                        <input id="syncpay-publickey" type="text" value={publicKey} onChange={e => setPublicKey(e.target.value)} placeholder='pk_live_...' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="syncpay-privatekey">Private Key</label>
                        <input id="syncpay-privatekey" type="password" value={privateKey} onChange={e => setPrivateKey(e.target.value)} placeholder='••••••••' />
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
