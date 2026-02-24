
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// A interface original estava incompleta, faltando `referredSellers`.
interface AffiliateStats {
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  conversionRate: number;
  referredSellers: any[]; // Adicionando a propriedade que faltava.
}

interface CurrencyStats {
  balance: number;
  revenue: number;
  sales: number;
}


/**
 * Hook (placeholder) para gerenciar a lógica do Painel Financeiro.
 * Este hook fornece dados e funções mockadas para permitir que o componente
 * FinancialPanel seja renderizado sem erros.
 */
export const useFinancialPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  
  const [selectedFilter, setSelectedFilter] = useState<string>('7d');

  const [pixelId, setPixelId] = useState<string>(' '); // Inicializado com espaço para teste
  const [pixelToken, setPixelToken] = useState<string>(' '); // Inicializado com espaço para teste

  // Dados mockados, agora com a estrutura correta para affiliateStats.
  const currencyStats = { brl: { balance: 1234.56, revenue: 789.01, sales: 50 }, usd: { balance: 234.56, revenue: 123.45, sales: 10 } };
  const affiliateStats: AffiliateStats = {
      totalCommissions: 567.89,
      pendingCommissions: 123.45,
      paidCommissions: 444.44,
      conversionRate: 0.05,
      referredSellers: [ // Inicializando com um array vazio para evitar o erro.
          // { id: '1', name: 'Vendedor 1', earnings: 100 },
          // { id: '2', name: 'Vendedor 2', earnings: 150 },
      ]
  };
  const filters = [
    { label: 'Hoje', value: '1d' },
    { label: '7 dias', value: '7d' },
    { label: '30 dias', value: '30d' },
  ];

  const loadData = useCallback(() => {
    setLoading(true);
    console.log('Buscando dados financeiros (mock)... com filtro:', selectedFilter);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selectedFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBack = () => navigate(-1);

  return {
    selectedFilter,
    setSelectedFilter,
    activeProviderName: 'syncpay', 
    loading,
    preferredProvider: 'syncpay',
    currencyStats,
    affiliateStats,
    pixelId,
    setPixelId,
    pixelToken,
    setPixelToken,
    isSavingMarketing: false,
    isCopyingLink: false,
    filters,
    loadData,
    handleBack,
    navigate,
  };
};
