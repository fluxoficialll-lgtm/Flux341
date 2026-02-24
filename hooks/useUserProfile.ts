
import { useState, useEffect } from 'react';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService.js';
import { UserProfile } from '../types';

interface UserProfileData {
    profile: UserProfile | null;
    isLoading: boolean;
}

export const useUserProfile = (username?: string, email?: string): UserProfileData => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            setIsLoading(false);
            return;
        }

        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                // Usando o serviço para buscar os dados do usuário
                const user = await authService.fetchUserByHandle(username, email);
                if (user) {
                    setProfile(user);
                }
            } catch (error) {
                console.error("Erro ao buscar perfil do usuário:", error);
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [username, email]);

    return { profile, isLoading };
};
