
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';

export const useSettings = () => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [isAdultContent, setIsAdultContent] = useState(() => localStorage.getItem('settings_18_plus') === 'true');

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user?.profile) {
            setIsPrivate(user.profile.isPrivate);
        }
    }, []);

    const togglePrivacy = useCallback(async () => {
        const newState = !isPrivate;
        setIsPrivate(newState);
        const user = authService.getCurrentUser();
        if (user && user.email && user.profile) {
            try {
                await authService.completeProfile(user.email, { ...user.profile, isPrivate: newState });
                return newState;
            } catch (e) {
                console.error(e);
                // Revert state on failure
                setIsPrivate(!newState);
                return !newState;
            }
        }
        return isPrivate;
    }, [isPrivate]);

    const toggleAdultContent = useCallback(() => {
        const newState = !isAdultContent;
        setIsAdultContent(newState);
        localStorage.setItem('settings_18_plus', String(newState));
    }, [isAdultContent]);

    const logout = () => {
        authService.logout();
    };

    return {
        isPrivate,
        isAdultContent,
        togglePrivacy,
        toggleAdultContent,
        logout
    };
};
