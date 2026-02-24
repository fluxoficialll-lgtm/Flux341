
import React from 'react';
import { useFinancialPanel } from '../hooks/useFinancialPanel';
import { BalanceCard } from '../Componentes/financial/BalanceCard';
import { AffiliateCard } from '../Componentes/financial/AffiliateCard';
import { GatewayCard } from '../Componentes/financial/GatewayCard';
import { CashFlowCard } from '../Componentes/financial/CashFlowCard';
import { TransactionsCard } from '../Componentes/financial/TransactionsCard';

// Componente de Esqueleto para simular o carregamento dos cards.
const SkeletonCard = ({ height = 'h-48' }) => (
    <div className={`flux-card bg-white/5 border border-white/10 rounded-[20px] p-6 mb-5 shadow-2xl animate-pulse ${height}`}>
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-gray-600 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
    </div>
);

export const FinancialPanel: React.FC = () => {
  const {
    selectedFilter, setSelectedFilter, activeProviderName, loading, preferredProvider, currencyStats,
    affiliateStats, pixelId, setPixelId, pixelToken, setPixelToken, isSavingMarketing, 
    isCopyingLink, filters, loadData, handleBack, navigate
  } = useFinancialPanel();

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-y-auto overflow-x-hidden">
      <header className="flex items-center justify-between p-4 bg-[#0c0f14] fixed w-full z-10 border-b border-white/10 top-0 h-[65px]">
        <button onClick={handleBack} aria-label="Voltar"><i className="fa-solid fa-arrow-left"></i></button>
        <h1 className="text-[20px] font-semibold">Painel Financeiro</h1>
        <div style={{width: '24px'}}></div>
      </header>
      <main className="pt-[80px] pb-[40px] w-full max-w-[600px] mx-auto px-5">
        {/* Se estiver carregando, mostra os esqueletos. Senão, mostra o conteúdo real. */}
        {loading ? (
          <>
            <SkeletonCard height="h-64" />
            <SkeletonCard height="h-40" />
            <SkeletonCard height="h-56" />
          </>
        ) : (
          <>
            <BalanceCard 
                stats={currencyStats}
                selectedFilter={selectedFilter}
                filters={filters || []}
                onFilterChange={setSelectedFilter}
                onRefresh={loadData}
                loading={loading}
                showCurrencySwitch={preferredProvider !== 'syncpay'}
            />
            
            <CashFlowCard />

            <TransactionsCard />

            {activeProviderName && 
              <AffiliateCard 
                affiliateStats={affiliateStats}
                pixelId={pixelId}
                setPixelId={setPixelId}
                pixelToken={pixelToken}
                setPixelToken={setPixelToken}
                isSavingMarketing={isSavingMarketing}
                onSaveMarketing={() => {}}
                onCopyAffiliateLink={() => {}}
                isCopyingLink={isCopyingLink}
                onOpenTracking={() => {}}
              />
            }
            <GatewayCard 
                activeProvider={activeProviderName}
                onManage={() => navigate('/financial/providers')}
            />
          </>
        )}
      </main>
    </div>
  );
};
