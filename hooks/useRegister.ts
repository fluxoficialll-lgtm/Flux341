
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SistemaCriaçãoContas } from '../ServiçosFrontend/ServiçoDeAutenticação/SistemaCriaçãoContas';
import { AuthError } from '../types';

export const useRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    // UI State
    const [errors, setErrors] = useState<{ email?: string, password?: string, confirm?: string, form?: string }>({});
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    
    // Referral State
    const [referredBy, setReferredBy] = useState<string | null>(null);

    // Effect for validation and extracting referral code
    useEffect(() => {
        // Extract referral from URL
        const params = new URLSearchParams(location.search);
        const ref = params.get('ref');
        if (ref) {
            setReferredBy(ref);
        }

        // --- Validation Logic ---
        const newErrors: any = {};
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (email && !emailRegex.test(email)) {
            newErrors.email = AuthError.INVALID_FORMAT;
        }
        if (password && password.length < 6) {
            newErrors.password = AuthError.PASSWORD_TOO_SHORT;
        }
        if (confirmPassword && password !== confirmPassword) {
            newErrors.confirm = AuthError.PASSWORDS_DONT_MATCH;
        }

        setErrors(newErrors);
        
        const allFilled = email && password && confirmPassword && termsAccepted;
        setIsValid(!!allFilled && Object.keys(newErrors).length === 0);

    }, [email, password, confirmPassword, termsAccepted, location]);

    // Submission handler
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setLoading(true);
        setErrors({}); // Clear previous form-level errors

        try {
            // CORREÇÃO: Chamar SistemaCriaçãoContas.criarConta com um objeto de dados do usuário
            await SistemaCriaçãoContas.criarConta({ email, password, referredBy: referredBy || undefined });
            
            // Após o sucesso, o usuário geralmente é redirecionado para verificar o e-mail ou fazer login
            navigate('/verify-email');

        } catch (err: any) {
            setErrors(prev => ({ ...prev, form: err.message || 'Ocorreu um erro no cadastro.' }));
        } finally {
            setLoading(false);
        }
    }, [isValid, email, password, referredBy, navigate]);

    return {
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        termsAccepted, setTermsAccepted,
        errors,
        loading,
        isValid,
        referredBy,
        handleSubmit,
    };
};
