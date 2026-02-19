
import React, { lazy } from 'react';
import { ProtectedRoute } from '../../Componentes/auth/ProtectedRoute';

const Chat = lazy(() => import('../../pages/Chat').then(m => ({ default: m.Chat })));
const GlobalSearch = lazy(() => import('../../pages/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const Leaderboard = lazy(() => import('../../pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const LocationSelector = lazy(() => import('../../pages/LocationSelector').then(m => ({ default: m.LocationSelector })));
const Maintenance = lazy(() => import('../../pages/Maintenance').then(m => ({ default: m.Maintenance })));
const TopGroups = lazy(() => import('../../pages/TopGroups').then(m => ({ default: m.TopGroups })));
const TopGroupsPrivate = lazy(() => import('../../pages/TopGroupsPrivate').then(m => ({ default: m.TopGroupsPrivate })));
const TopGroupsPublic = lazy(() => import('../../pages/TopGroupsPublic').then(m => ({ default: m.TopGroupsPublic })));
const TopGroupsVip = lazy(() => import('../../pages/TopGroupsVip').then(m => ({ default: m.TopGroupsVip })));

export const miscRoutes = [
  { path: '/chat/:id', element: <ProtectedRoute><Chat /></ProtectedRoute> },
  { path: '/global-search', element: <ProtectedRoute><GlobalSearch /></ProtectedRoute> },
  { path: '/leaderboard', element: <ProtectedRoute><Leaderboard /></ProtectedRoute> },
  { path: '/location-selector', element: <ProtectedRoute><LocationSelector /></ProtectedRoute> },
  { path: '/maintenance', element: <Maintenance /> },
  { path: '/top-groups', element: <ProtectedRoute><TopGroups /></ProtectedRoute> },
  { path: '/top-groups/private', element: <ProtectedRoute><TopGroupsPrivate /></ProtectedRoute> },
  { path: '/top-groups/public', element: <ProtectedRoute><TopGroupsPublic /></ProtectedRoute> },
  { path: '/top-groups/vip', element: <ProtectedRoute><TopGroupsVip /></ProtectedRoute> }
];
