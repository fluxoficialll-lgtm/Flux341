
import React, { lazy } from 'react';
import { ProtectedRoute } from '../../Componentes/ComponentesDeAuth/ProtectedRoute';

// Garante que todos os componentes lazy usem a sintaxe correta para importações nomeadas.
const FinancialPanel = lazy(() => import('../../pages/FinancialPanel').then(module => ({ default: module.FinancialPanel })));
const ProviderConfig = lazy(() => import('../../pages/ProviderConfig').then(module => ({ default: module.ProviderConfig })));
const TransactionHistoryPage = lazy(() => import('../../pages/TransactionHistoryPage').then(module => ({ default: module.TransactionHistoryPage })));

export const financialRoutes = [
  {
    path: '/financial',
    element: <ProtectedRoute><FinancialPanel /></ProtectedRoute>
  },
  {
    path: '/financial/providers',
    element: <ProtectedRoute><ProviderConfig /></ProtectedRoute>
  },
  {
    path: '/financial/transactions',
    element: <ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>
  }
];
