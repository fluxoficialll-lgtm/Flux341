
import React, { useState, useEffect } from 'react';

interface CredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    providerId: string | null;
    providerName: string;
    onConnect: (credentials: any) => Promise<void>;
    onDisconnect: () => Promise<void>;
    existingConfig: any;
}

export const ProviderCredentialsModal: React.FC<CredentialsModalProps> = ({ isOpen, onClose, providerId, providerName, onConnect, onDisconnect, existingConfig }) => {
    const [credentials, setCredentials] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (existingConfig) {
            setCredentials(existingConfig);
        } else {
            setCredentials({});
        }
    }, [existingConfig, isOpen]);

    const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await onConnect(credentials);
            onClose();
        } catch (err: any) {
            setError(err.message || "Falha ao salvar. Verifique suas credenciais.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDisconnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await onDisconnect();
            onClose();
        } catch (err: any) {
            setError(err.message || "Falha ao desconectar.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderFields = () => {
        switch (providerId) {
            case 'syncpay':
                return (
                    <>
                        <div className="input-group">
                            <label htmlFor="publicKey">Chave Pública</label>
                            <input type="text" id="publicKey" name="publicKey" value={credentials.publicKey || ''} onChange={handleCredentialChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="privateKey">Chave Privada</label>
                            <input type="password" id="privateKey" name="privateKey" value={credentials.privateKey || ''} onChange={handleCredentialChange} />
                        </div>
                    </>
                );
            case 'stripe':
                return (
                    <div className="input-group">
                        <label htmlFor="secretKey">Chave Secreta</label>
                        <input type="password" id="secretKey" name="secretKey" value={credentials.secretKey || ''} onChange={handleCredentialChange} />
                    </div>
                );
            case 'paypal':
                return (
                    <>
                        <div className="input-group">
                            <label htmlFor="credentials">Client ID</label>
                            <input type="text" id="credentials" name="credentials" value={credentials.credentials || ''} onChange={handleCredentialChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="secretKey">Chave Secreta</label>
                            <input type="password" id="secretKey" name="secretKey" value={credentials.secretKey || ''} onChange={handleCredentialChange} />
                        </div>
                    </>
                );
            default:
                return <p>Provedor não suportado.</p>;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>{existingConfig?.isConnected ? 'Atualizar' : 'Conectar'} {providerName}</h2>
                <form onSubmit={handleSubmit}>
                    {renderFields()}
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        {existingConfig?.isConnected && (
                            <button type="button" className="disconnect-button" onClick={handleDisconnect} disabled={isLoading}>
                                {isLoading ? 'Desconectando...' : 'Desconectar'}
                            </button>
                        )}
                        <button type="submit" className="connect-button" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Credenciais'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
