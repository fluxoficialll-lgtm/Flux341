
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Tipos para os dados do hook
interface CurrencyStats {
  balance: number;
  revenue: number;
  sales: number;
}

interface AffiliateStats {
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  conversionRate: number;
}

/**
 * Hook (placeholder) para gerenciar a lógica do Painel Financeiro.
 * Este hook fornece dados e funções mockadas para permitir que o componente
 * FinancialPanel seja renderizado sem erros, evitando o crash da aplicação
 * devido à ausência do arquivo original.
 */
export const useFinancialPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estado para os filtros
  const [selectedFilter, setSelectedFilter] = useState<string>('7d');

  // Estado para os campos de marketing
  const [pixelId, setPixelId] = useState<string>('');
  const [pixelToken, setPixelToken] = useState<string>('');

  // Dados mockados
  const currencyStats = { brl: { balance: 0, revenue: 0, sales: 0 }, usd: { balance: 0, revenue: 0, sales: 0 } };
  const affiliateStats = { totalCommissions: 0, pendingCommissions: 0, paidCommissions: 0, conversionRate: 0 };
  const filters = [
    { label: 'Hoje', value: '1d' },
    { label: '7 dias', value: '7d' },
    { label: '30 dias', value: '30d' },
  ];

  // Função mockada para carregar dados
  const loadData = useCallback(() => {
    setLoading(true);
    console.log('Buscando dados financeiros (mock)... com filtro:', selectedFilter);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selectedFilter]);

  // Carrega os dados na montagem e quando o filtro muda
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBack = () => navigate(-1);

  return {
    selectedFilter,
    setSelectedFilter,
    activeProviderName: 'syncpay', // Mocked
    loading,
    preferredProvider: 'syncpay', // Mocked
    currencyStats,
    affiliateStats,
    pixelId,
    setPixelId,
    pixelToken,
    setPixelToken,
    isSavingMarketing: false, // Mocked
    isCopyingLink: false, // Mocked
    filters,
    loadData,
    handleBack,
    navigate,
  };
};
