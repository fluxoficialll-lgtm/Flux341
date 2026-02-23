
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { syncPayService } from '../ServiçosFrontend/ServiçosDeProvedores/syncPayService.js';
import { AffiliateStats, CurrencyCode } from '../types';

export const useFinancialPanel = () => {
  const navigate = useNavigate();
  
  const [selectedFilter, setSelectedFilter] = useState('Disponível');
  const [activeProviderName, setActiveProviderName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [preferredProvider, setPreferredProvider] = useState<string>('syncpay');
  
  const [currencyStats, setCurrencyStats] = useState<Record<CurrencyCode, { total: number; own: number; affiliate: number }>>({
      BRL: { total: 0, own: 0, affiliate: 0 },
      USD: { total: 0, own: 0, affiliate: 0 },
      EUR: { total: 0, own: 0, affiliate: 0 }
  });

  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [walletBalances, setWalletBalances] = useState({ BRL: 0, USD: 0, EUR: 0 });
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats | null>(null);

  const [pixelId, setPixelId] = useState('');
  const [pixelToken, setPixelToken] = useState('');
  const [isSavingMarketing, setIsSavingMarketing] = useState(false);
  const [isCopyingLink, setIsCopyingLink] = useState(false);

  const filters = ['Disponível', 'Hoje', 'Ontem', '7d', '30d', '180d'];

  const calculateRevenue = useCallback(() => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const oneDay = 24 * 60 * 60 * 1000;

      const getFilterTimestamp = (filter: string) => {
          switch(filter) {
              case 'Hoje': return startOfDay;
              case 'Ontem': return startOfDay - oneDay;
              case '7d': return now.getTime() - (7 * oneDay);
              case '30d': return now.getTime() - (30 * oneDay);
              case '180d': return now.getTime() - (180 * oneDay);
              default: return 0;
          }
      };

      const tsFilter = getFilterTimestamp(selectedFilter);
      const isAvailableMode = selectedFilter === 'Disponível';

      const newStats: Record<CurrencyCode, { total: number; own: number; affiliate: number }> = {
          BRL: { total: 0, own: 0, affiliate: 0 },
          USD: { total: 0, own: 0, affiliate: 0 },
          EUR: { total: 0, own: 0, affiliate: 0 }
      };

      if (isAvailableMode) {
          newStats.BRL.total = walletBalances.BRL || 0;
          newStats.USD.total = walletBalances.USD || 0;
          newStats.EUR.total = walletBalances.EUR || 0;
          newStats.BRL.affiliate = affiliateStats?.totalEarned || 0;
          newStats.BRL.own = Math.max(0, newStats.BRL.total - newStats.BRL.affiliate);
      } else {
          if (Array.isArray(allTransactions)) {
              allTransactions.forEach(tx => {
                  const status = (tx.status || '').toLowerCase();
                  if (!['paid', 'completed', 'approved', 'settled'].includes(status)) return;
                  const txDate = new Date(tx.created_at || tx.createdAt || tx.date_created || 0).getTime();
                  const isMatch = selectedFilter === 'Ontem' ? (txDate >= tsFilter && txDate < startOfDay) : (txDate >= tsFilter);
                  if (isMatch) {
                      const currency = (tx.currency || 'BRL').toUpperCase() as CurrencyCode;
                      if (newStats[currency]) {
                          newStats[currency].own += parseFloat(tx.amount || 0);
                          newStats[currency].total += parseFloat(tx.amount || 0);
                      }
                  }
              });
          }
          affiliateStats?.recentSales?.forEach(sale => {
              const sDate = sale.timestamp;
              const isMatch = selectedFilter === 'Ontem' ? (sDate >= tsFilter && sDate < startOfDay) : (sDate >= tsFilter);
              if (isMatch) {
                  const currency = 'BRL'; 
                  newStats[currency].affiliate += sale.commission;
                  newStats[currency].total += sale.commission;
              }
          });
      }
      setCurrencyStats(newStats);
  }, [selectedFilter, allTransactions, walletBalances, affiliateStats]);

  const loadData = async () => {
      setLoading(true);
      const user = authService.getCurrentUser();
      const pref = localStorage.getItem('flux_preferred_provider') || 'syncpay';
      setPreferredProvider(pref);

      if (user) {
          const isSyncConnected = user.paymentConfigs?.syncpay?.isConnected || user.paymentConfig?.providerId === 'syncpay';
          const isStripeConnected = user.paymentConfigs?.stripe?.isConnected;
          const isPaypalConnected = user.paymentConfigs?.paypal?.isConnected;

          let resolvedName = '';
          if (pref === 'syncpay' && isSyncConnected) resolvedName = 'SyncPay';
          else if (pref === 'stripe' && isStripeConnected) resolvedName = 'Stripe';
          else if (pref === 'paypal' && isPaypalConnected) resolvedName = 'PayPal';
          else {
              if (isSyncConnected) resolvedName = 'SyncPay';
              else if (isStripeConnected) resolvedName = 'Stripe';
              else if (isPaypalConnected) resolvedName = 'PayPal';
          }

          setActiveProviderName(resolvedName);

          const hasAnyConnected = isSyncConnected || isStripeConnected || isPaypalConnected;

          if (hasAnyConnected) {
              try {
                  const balance = await syncPayService.getBalance(user.email);
                  if (pref === 'syncpay') setWalletBalances({ BRL: balance, USD: 0, EUR: 0 });
                  else setWalletBalances({ BRL: balance, USD: balance / 5.0, EUR: balance / 5.4 });
                  const transactions = await syncPayService.getTransactions(user.email);
                  setAllTransactions(Array.isArray(transactions) ? transactions : []);
                  const affStats = await syncPayService.getAffiliateStats(user.email);
                  setAffiliateStats(affStats);
              } catch (e) { console.error("Erro dados financeiros", e); }
          }
      }
      setLoading(false);
  };

  useEffect(() => { 
      loadData();
      const handleStorageChange = () => loadData();
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => { calculateRevenue(); }, [calculateRevenue]);

  const handleBack = () => navigate('/settings');
  
  return {
    selectedFilter, setSelectedFilter, activeProviderName, loading, preferredProvider, currencyStats,
    affiliateStats, pixelId, setPixelId, pixelToken, setPixelToken, isSavingMarketing, 
    isCopyingLink, filters, loadData, handleBack, navigate
  };
};
