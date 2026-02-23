
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';

export const useForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [stage, setStage] = useState<'email' | 'code'>('email');
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [btnText, setBtnText] = useState('Enviar E-mail');
    const [btnColorClass, setBtnColorClass] = useState('bg-[#00c2ff]');
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleEmailSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!email) {
            setError("O e-mail não pode estar vazio.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authService.sendVerificationCode(email, 'reset');
            setStage('code');
            setTimer(30); // Start 30-second timer
        } catch (err: any) {
            setError(err.message || 'Falha ao enviar o código.');
            setBtnText(err.message || 'Erro');
            setBtnColorClass('bg-red-500');
            setTimeout(() => {
                setBtnText('Enviar E-mail');
                setBtnColorClass('bg-[#00c2ff]');
            }, 2000);
        } finally {
            setLoading(false);
        }
    }, [email]);

    const handleVerifyCode = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            setError("O código deve ter 6 dígitos.");
            setLoading(false);
            return;
        }
        try {
            await authService.verifyCode(email, fullCode, true);
            localStorage.setItem('reset_email', email);
            navigate('/reset-password');
        } catch (err: any) {
            setError(err.message || 'Código inválido ou expirado.');
        } finally {
            setLoading(false);
        }
    }, [email, code, navigate]);

    const handleInput = (index: number, value: string) => {
        if (/\D/.test(value)) return; // Only allow digits
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5 && inputsRef.current[index + 1]) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0 && inputsRef.current[index - 1]) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length) {
            const newCode = Array(6).fill('');
            paste.split('').forEach((char, i) => {
                newCode[i] = char;
            });
            setCode(newCode);
            const lastFullInput = Math.min(paste.length, 6) - 1;
            inputsRef.current[lastFullInput]?.focus();
        }
    };
    
    const goBackToEmail = () => {
      setStage('email');
      setError('');
      setCode(Array(6).fill(''));
    }

    return {
        email, setEmail,
        code, setCode,
        stage,
        timer,
        loading,
        error,
        btnText,
        btnColorClass,
        inputsRef,
        handleEmailSubmit,
        handleVerifyCode,
        handleInput,
        handleKeyDown,
        handlePaste,
        goBackToEmail,
    };
};
