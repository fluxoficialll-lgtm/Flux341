
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemConfiguracao } from './ItemConfiguracao';
import { authService } from '../../ServiçosFrontend/ServiçoDeAutenticação/authService.js';
import { ModalDeSelecaoDeIdioma, IDIOMAS } from './ModalDeSelecaoDeIdioma';
import { preferenceService } from '../../ServiçosFrontend/ServiçoDePreferências/preferenceService.js';

export const SessaoGeral: React.FC = () => {
    const navigate = useNavigate();
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    
    const user = authService.getCurrentUser();
    // State to hold the current language, so the UI can update without a page reload
    const [currentLangId, setCurrentLangId] = useState(user?.language || localStorage.getItem('app_language') || 'pt');

    const currentLangLabel = IDIOMAS.find(l => l.id === currentLangId)?.label || 'Português';

    const handleLanguageSelect = async (langId: string) => {
        if (user?.email) {
            await preferenceService.updateLanguage(user.email, langId);
            setCurrentLangId(langId); // Update local state to reflect the change immediately
            // Optionally, you might want to force a reload or use a more sophisticated state management to update the whole app
            // For now, we just update the label in this component.
        }
        setIsLanguageModalOpen(false); // Close the modal after selection
    };

    return (
        <>
            <div className="settings-group">
                <h2>Geral</h2>
                <ItemConfiguracao 
                    icon="fa-bell" 
                    label="Configurações de Notificação" 
                    onClick={() => navigate('/notification-settings')} 
                />
                <ItemConfiguracao 
                    icon="fa-language" 
                    label="Idioma" 
                    onClick={() => setIsLanguageModalOpen(true)} 
                    rightElement={
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">{currentLangLabel}</span>
                            <i className="fas fa-chevron-right text-gray-600 text-xs"></i>
                        </div>
                    }
                />
                <ItemConfiguracao 
                    icon="fa-file-alt" 
                    label="Termos e Privacidade" 
                    onClick={() => navigate('/terms')} 
                />
                <ItemConfiguracao 
                    icon="fa-headset" 
                    label="Ajuda e Suporte" 
                    onClick={() => navigate('/help')} 
                />
            </div>

            <ModalDeSelecaoDeIdioma
                isOpen={isLanguageModalOpen}
                onClose={() => setIsLanguageModalOpen(false)}
                currentLanguage={currentLangId}
                onSelect={handleLanguageSelect}
            />
        </>
    );
};
