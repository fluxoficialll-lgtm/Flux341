
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { db } from '@/database';
import { SecuritySettings as ISecuritySettings, UserSession } from '../types';

export const useSecurityLogin = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<ISecuritySettings>({ saveLoginInfo: true });
  
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<UserSession[]>([]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.securitySettings) {
        setSettings(user.securitySettings);
    }
    
    // Initial load of sessions
    setSessions(authService.getUserSessions());

    // Subscribe to DB changes for real-time session updates
    const unsubscribe = db.subscribe('users', () => {
        setSessions(authService.getUserSessions());
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const toggleSetting = useCallback((key: keyof ISecuritySettings) => {
    setSettings(prevSettings => {
        const newSettings = { ...prevSettings, [key]: !prevSettings[key] };
        authService.updateSecuritySettings(newSettings);
        return newSettings;
    });
  }, []);

  const handleChangePassword = useCallback(async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccessMsg('');

      if (newPassword.length < 6) {
          setError("A nova senha deve ter pelo menos 6 caracteres.");
          return;
      }
      if (newPassword !== confirmPassword) {
          setError("As novas senhas não coincidem.");
          return;
      }

      setLoading(true);
      try {
          await authService.changePassword(currentPassword, newPassword);
          setSuccessMsg("Senha alterada com sucesso!");
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
      } catch (err: any) {
          setError(err.message || "Erro ao alterar senha.");
      } finally {
          setLoading(false);
      }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleRevokeOthers = useCallback(async () => {
      if(window.confirm("Deseja desconectar todos os outros dispositivos?")) {
          await authService.revokeOtherSessions();
          // State update is handled by the real-time subscription
      }
  }, []);

  const formatDate = (timestamp: number) => {
      return new Date(timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate('/settings');
      }
  };

  return {
      settings,
      toggleSetting,
      currentPassword, setCurrentPassword,
      newPassword, setNewPassword,
      confirmPassword, setConfirmPassword,
      error, successMsg,
      loading,
      handleChangePassword,
      sessions,
      handleRevokeOthers,
      formatDate,
      handleBack
  };
};
