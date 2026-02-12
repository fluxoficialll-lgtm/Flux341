
import React, { useState, useEffect } from 'react';

export const ProviderSettingsModal = ({ isOpen, onClose, onSave, provider, existingConfig }) => {
    const [credentials, setCredentials] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (existingConfig) {
            setCredentials(existingConfig);
        }
    }, [existingConfig]);

    const handleCredentialChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await onSave(credentials);
            onClose();
        } catch (err) {
            setError(err.message || "Falha ao salvar. Verifique suas credenciais.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>Configurar {provider.name}</h2>

                <form onSubmit={handleSubmit}>
                    {provider.credentials.map(cred => (
                        <div className="input-group" key={cred.id}>
                            <label htmlFor={cred.id}>{cred.label}</label>
                            <input
                                type={cred.type}
                                id={cred.id}
                                name={cred.id}
                                value={credentials[cred.id] || ''}
                                onChange={handleCredentialChange}
                                className="input-field"
                            />
                        </div>
                    ))}

                    {error && <p className="error-message">{error}</p>}

                    <div className="form-actions">
                        <button type="submit" className="connect-button" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
