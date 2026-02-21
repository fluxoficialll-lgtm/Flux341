
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../ServiçosDoFrontend/ServiçosDeAutenticacao/authService';
import { trackingService } from '../ServiçosDoFrontend/trackingService';

export const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [showEmailForm, setShowEmailForm] = useState(false);

    // State para login com email
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Efeito para capturar parâmetros de URL (afiliados, etc.)
    useEffect(() => {
        trackingService.captureUrlParams();
    }, [location]);

    // Função de redirecionamento centralizada
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

    // Efeito para verificar se o usuário já está logado ao carregar a página
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user && authService.isAuthenticated()) {
            handleRedirect(user);
        } else {
            setLoading(false);
        }
    }, [handleRedirect]);

    // Manipulador para o sucesso do login com Google
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

    // Manipulador para o login com email e senha
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
