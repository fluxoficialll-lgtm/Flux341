
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { NotificationSettings as INotificationSettings } from '../types';
import { useModal } from '../Componentes/ModalSystem';

const defaultSettings: INotificationSettings = {
    pauseAll: false,
    likes: true,
    comments: true,
    followers: true,
    mentions: true,
    messages: true,
    groups: true,
    marketplace: true,
    emailUpdates: true,
    emailDigest: true
};

export const useNotificationSettings = () => {
    const navigate = useNavigate();
    const { showAlert } = useModal();
    
    const [settings, setSettings] = useState<INotificationSettings>(defaultSettings);
    const [isSyncing, setIsSyncing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user && user.notificationSettings) {
            // Merge saved settings with defaults to ensure all keys are present
            setSettings({ ...defaultSettings, ...user.notificationSettings });
        }
        setInitialLoading(false);
    }, []);

    const toggleSetting = useCallback(async (key: keyof INotificationSettings) => {
        const originalSettings = settings;
        const newSettings = { ...settings, [key]: !settings[key] };
        
        // Optimistic UI update
        setSettings(newSettings);
        setIsSyncing(true);

        try {
            await authService.updateNotificationSettings(newSettings);
            // Success! The sync is complete.
            setIsSyncing(false);
        } catch (error) {
            console.error("Failed to sync notification settings:", error);
            setIsSyncing(false);
            // Revert on error
            setSettings(originalSettings);
            showAlert("Erro de Sincronização", "Não foi possível salvar suas preferências. Por favor, tente novamente.");
        }
    }, [settings, showAlert]);

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/settings');
        }
    };

    return {
        settings,
        isSyncing,
        initialLoading,
        toggleSetting,
        handleBack
    };
};
