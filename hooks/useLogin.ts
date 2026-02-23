import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { trackingService } from '../ServiçosFrontend/ServiçoDeRastreamento/ServiçoDeRastreamento.js';

export const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true); // Começa como true
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [showEmailForm, setShowEmailForm] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        trackingService.captureUrlParams();
    }, [location]);

    const handleRedirect = useCallback((user: any, isNewUser: boolean = false) => {
        setProcessing(false);
        if (isNewUser || (user && !user.isProfileCompleted)) {
            navigate('/complete-profile', { replace: true });
            return;
        }
        const pendingRedirect = sessionStorage.getItem('redirect_after_login') || (location.state as any)?.from?.pathname;
        if (pendingRedirect && pendingRedirect !== '/' && !pendingRedirect.includes('login')) {
            sessionStorage.removeItem('redirect_after_login');
            navigate(pendingRedirect, { replace: true });
        } else {
            navigate('/feed', { replace: true });
        }
    }, [navigate, location]);

    // Efeito APENAS para o lado do cliente
    useEffect(() => {
        // Só executa no navegador
        if (typeof window !== 'undefined') {
            const user = authService.getCurrentUser();
            if (user && authService.isAuthenticated()) {
                handleRedirect(user);
            } else {
                setLoading(false); // Para de carregar se não estiver autenticado
            }
        }
    }, [handleRedirect]); // handleRedirect é estável

    const handleGoogleSuccess = useCallback(async (credentialResponse: any) => {
        setProcessing(true);
        setError('');
        try {
            if (!credentialResponse || !credentialResponse.credential) {
                throw new Error("Login com Google falhou.");
            }
            const referredBy = trackingService.getAffiliateRef() || undefined;
            const result = await authService.loginWithGoogle(credentialResponse.credential, referredBy);
            if (result && result.user) {
                const isNew = result.nextStep === '/complete-profile' || !result.user.isProfileCompleted;
                handleRedirect(result.user, isNew);
            }
        } catch (err: any) {
            setError(err.message || 'Falha ao autenticar com Google.');
            setProcessing(false);
        }
    }, [handleRedirect]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || processing) return;
        setProcessing(true);
        setError('');
        try {
            const result = await authService.login(email, password);
            if (result && result.user) {
                const isNew = result.nextStep === '/complete-profile' || !result.user.isProfileCompleted;
                handleRedirect(result.user, isNew);
            }
        } catch (err: any) {
            setError(err.message || 'Credenciais inválidas.');
            setProcessing(false);
        }
    };

    return {
        loading,
        processing,
        error,
        showEmailForm,
        setShowEmailForm,
        email,
        setEmail,
        password,
        setPassword,
        handleEmailLogin,
        handleGoogleSuccess,
    };
};