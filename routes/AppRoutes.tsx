
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff]"></i>
  </div>
);

// Componentes de Página
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../pages/Register').then(m => ({ default: m.Register })));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('../pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Banned = lazy(() => import('../pages/Banned').then(m => ({ default: m.Banned })));
const Feed = lazy(() => import('../pages/Feed').then(m => ({ default: m.Feed })));
const PostDetails = lazy(() => import('../pages/PostDetails').then(m => ({ default: m.PostDetails })));
const CreatePost = lazy(() => import('../pages/CreatePost').then(m => ({ default: m.CreatePost })));
const CreatePoll = lazy(() => import('../pages/CreatePoll').then(m => ({ default: m.CreatePoll })));
const Reels = lazy(() => import('../pages/Reels').then(m => ({ default: m.Reels })));
const CreateReel = lazy(() => import('../pages/CreateReel').then(m => ({ default: m.CreateReel })));
const ReelsSearch = lazy(() => import('../pages/ReelsSearch').then(m => ({ default: m.ReelsSearch })));
const FeedSearch = lazy(() => import('../pages/FeedSearch').then(m => ({ default: m.FeedSearch })));
const Groups = lazy(() => import('../pages/Groups').then(m => ({ default: m.Groups })));
const GroupChat = lazy(() => import('../pages/GroupChat').then(m => ({ default: m.GroupChat })));
const GroupLanding = lazy(() => import('../pages/GroupLanding').then(m => ({ default: m.GroupLanding })));
const CreateGroup = lazy(() => import('../pages/CreateGroup').then(m => ({ default: m.CreateGroup })));
const CreateVipGroup = lazy(() => import('../pages/CreateVipGroup').then(m => ({ default: m.CreateVipGroup })));
const CreatePublicGroup = lazy(() => import('../pages/CreatePublicGroup').then(m => ({ default: m.CreatePublicGroup })));
const CreatePrivateGroup = lazy(() => import('../pages/CreatePrivateGroup').then(m => ({ default: m.CreatePrivateGroup })));
const EditGroup = lazy(() => import('../pages/EditGroup').then(m => ({ default: m.EditGroup })));
const VipGroupSales = lazy(() => import('../pages/VipGroupSales').then(m => ({ default: m.VipGroupSales })));
const GroupSettings = lazy(() => import('../pages/GroupSettings').then(m => ({ default: m.GroupSettings })));
const SuccessBridge = lazy(() => import('../pages/SuccessBridge').then(m => ({ default: m.SuccessBridge })));
const GroupInfoPage = lazy(() => import('../pages/groups/settings/GroupInfoPage').then(m => ({ default: m.GroupInfoPage })));
const GroupAccessPage = lazy(() => import('../pages/groups/settings/GroupAccessPage').then(m => ({ default: m.GroupAccessPage })));
const GroupModerationPage = lazy(() => import('../pages/groups/settings/GroupModerationPage').then(m => ({ default: m.GroupModerationPage })));
const GroupMembersPage = lazy(() => import('../pages/groups/settings/GroupMembersPage').then(m => ({ default: m.GroupMembersPage })));
const GroupVipPage = lazy(() => import('../pages/groups/settings/GroupVipPage').then(m => ({ default: m.GroupVipPage })));
const GroupStatisticsPage = lazy(() => import('../pages/groups/settings/GroupStatisticsPage').then(m => ({ default: m.GroupStatisticsPage })));
const GroupAuditLogs = lazy(() => import('../pages/groups/settings/GroupAuditLogs').then(m => ({ default: m.GroupAuditLogs })));
const GroupChannelsPage = lazy(() => import('../pages/groups/settings/GroupChannelsPage').then(m => ({ default: m.GroupChannelsPage })));
const GroupSchedule = lazy(() => import('../pages/groups/settings/GroupSchedule').then(m => ({ default: m.GroupSchedule })));
const GroupSalesPlatformPage = lazy(() => import('../pages/groups/settings/GroupSalesPlatformPage').then(m => ({ default: m.GroupSalesPlatformPage })));
const GroupSalesPlatformView = lazy(() => import('../pages/groups/GroupSalesPlatformView').then(m => ({ default: m.GroupSalesPlatformView })));
const SalesFolderContentPage = lazy(() => import('../pages/groups/SalesFolderContentPage').then(m => ({ default: m.SalesFolderContentPage })));
const GroupRolesPage = lazy(() => import('../pages/groups/settings/GroupRolesPage').then(m => ({ default: m.GroupRolesPage })));
const GroupChannelsList = lazy(() => import('../pages/groups/GroupChannelsList').then(m => ({ default: m.GroupChannelsList })));
const GroupCheckoutConfigPage = lazy(() => import('../pages/groups/settings/GroupCheckoutConfigPage').then(m => ({ default: m.GroupCheckoutConfigPage })));
const GroupLimits = lazy(() => import('../pages/LimitAndControl').then(m => ({ default: m.LimitAndControl })));
const ManageGroupLinks = lazy(() => import('../pages/ManageGroupLinks').then(m => ({ default: m.ManageGroupLinks })));
const GroupRevenue = lazy(() => import('../pages/GroupRevenue').then(m => ({ default: m.GroupRevenue })));
const VipSalesHistory = lazy(() => import('../pages/VipSalesHistory').then(m => ({ default: m.VipSalesHistory })));
const Marketplace = lazy(() => import('../pages/Marketplace').then(m => ({ default: m.Marketplace })));
const ProductDetails = lazy(() => import('../pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const CreateMarketplaceItem = lazy(() => import('../pages/CreateMarketplaceItem').then(m => ({ default: m.CreateMarketplaceItem })));
const MyStore = lazy(() => import('../pages/MyStore').then(m => ({ default: m.MyStore })));
const AdPlacementSelector = lazy(() => import('../pages/AdPlacementSelector').then(m => ({ default: m.AdPlacementSelector })));
const CampaignPerformance = lazy(() => import('../pages/CampaignPerformance').then(m => ({ default: m.CampaignPerformance })));
const AdCampaignTypeSelector = lazy(() => import('../pages/AdCampaignTypeSelector').then(m => ({ default: m.AdCampaignTypeSelector })));
const AdContentSelector = lazy(() => import('../pages/AdContentSelector').then(m => ({ default: m.AdContentSelector })));
const Profile = lazy(() => import('../pages/Profile').then(m => ({ default: m.Profile })));
const UserProfile = lazy(() => import('../pages/UserProfile').then(m => ({ default: m.UserProfile })));
const CompleteProfile = lazy(() => import('../pages/CompleteProfile').then(m => ({ default: m.CompleteProfile })));
const EditProfile = lazy(() => import('../pages/EditProfile').then(m => ({ default: m.EditProfile })));
const GlobalSearch = lazy(() => import('../pages/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const Leaderboard = lazy(() => import('../pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const TopGroups = lazy(() => import('../pages/TopGroups').then(m => ({ default: m.TopGroups })));
const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));
const Notifications = lazy(() => import('../pages/Notifications').then(m => ({ default: m.Notifications })));
const Messages = lazy(() => import('../pages/Messages').then(m => ({ default: m.Messages })));
const FinancialPanel = lazy(() => import('../pages/FinancialPanel').then(m => ({ default: m.FinancialPanel })));
const ProviderConfig = lazy(() => import('../pages/ProviderConfig').then(m => ({ default: m.ProviderConfig })));
const TransactionHistoryPage = lazy(() => import('../pages/TransactionHistoryPage').then(m => ({ default: m.TransactionHistoryPage })));
const SecurityLogin = lazy(() => import('../pages/SecurityLogin').then(m => ({ default: m.SecurityLogin })));
const BlockedUsers = lazy(() => import('../pages/BlockedUsers').then(m => ({ default: m.BlockedUsers })));
const NotificationSettings = lazy(() => import('../pages/NotificationSettings').then(m => ({ default: m.NotificationSettings })));
const LanguageSettings = lazy(() => import('../pages/LanguageSettings').then(m => ({ default: m.LanguageSettings })));
const TermsAndPrivacy = lazy(() => import('../pages/TermsAndPrivacy').then(m => ({ default: m.TermsAndPrivacy })));
const HelpSupport = lazy(() => import('../pages/HelpSupport').then(m => ({ default: m.HelpSupport })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Rotas de Autenticação */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/banned" element={<Banned />} />

        {/* Rotas do Feed */}
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
        <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/create-poll" element={<ProtectedRoute><CreatePoll /></ProtectedRoute>} />
        <Route path="/reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />
        <Route path="/reels/:id" element={<ProtectedRoute><Reels /></ProtectedRoute>} />
        <Route path="/reels-search" element={<ProtectedRoute><ReelsSearch /></ProtectedRoute>} />
        <Route path="/feed-search" element={<ProtectedRoute><FeedSearch /></ProtectedRoute>} />
        <Route path="/create-reel" element={<ProtectedRoute><CreateReel /></ProtectedRoute>} />

        {/* Rotas de Grupos */}
        <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
        <Route path="/group-chat/:id" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />
        <Route path="/group-chat/:id/:channelId" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />
        <Route path="/group/:id/channels" element={<ProtectedRoute><GroupChannelsList /></ProtectedRoute>} />
        <Route path="/group-landing/:id" element={<GroupLanding />} />
        <Route path="/vip-group-sales/:id" element={<VipGroupSales />} />
        <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
        <Route path="/create-group/vip" element={<ProtectedRoute><CreateVipGroup /></ProtectedRoute>} />
        <Route path="/create-group/public" element={<ProtectedRoute><CreatePublicGroup /></ProtectedRoute>} />
        <Route path="/create-group/private" element={<ProtectedRoute><CreatePrivateGroup /></ProtectedRoute>} />
        <Route path="/edit-group/:id" element={<ProtectedRoute><EditGroup /></ProtectedRoute>} />
        <Route path="/payment-success-bridge/:id" element={<ProtectedRoute><SuccessBridge /></ProtectedRoute>} />
        <Route path="/group-settings/:id" element={<ProtectedRoute><GroupSettings /></ProtectedRoute>} />
        <Route path="/group-settings/:id/info" element={<ProtectedRoute><GroupInfoPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/access" element={<ProtectedRoute><GroupAccessPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/moderation" element={<ProtectedRoute><GroupModerationPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/members" element={<ProtectedRoute><GroupMembersPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/roles" element={<ProtectedRoute><GroupRolesPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/vip" element={<ProtectedRoute><GroupVipPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/stats" element={<ProtectedRoute><GroupStatisticsPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/audit" element={<ProtectedRoute><GroupAuditLogs /></ProtectedRoute>} />
        <Route path="/group-settings/:id/channels" element={<ProtectedRoute><GroupChannelsPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/schedule" element={<ProtectedRoute><GroupSchedule /></ProtectedRoute>} />
        <Route path="/group-settings/:id/sales-platform" element={<ProtectedRoute><GroupSalesPlatformPage /></ProtectedRoute>} />
        <Route path="/group-settings/:id/checkout-config" element={<ProtectedRoute><GroupCheckoutConfigPage /></ProtectedRoute>} />
        <Route path="/group-platform/:id" element={<ProtectedRoute><GroupSalesPlatformView /></ProtectedRoute>} />
        <Route path="/group-folder/:groupId/:folderId" element={<ProtectedRoute><SalesFolderContentPage /></ProtectedRoute>} />
        <Route path="/group-limits/:id" element={<ProtectedRoute><GroupLimits /></ProtectedRoute>} />
        <Route path="/group-links/:id" element={<ProtectedRoute><ManageGroupLinks /></ProtectedRoute>} />
        <Route path="/group-revenue/:id" element={<ProtectedRoute><GroupRevenue /></ProtectedRoute>} />
        <Route path="/vip-sales-history/:id" element={<ProtectedRoute><VipSalesHistory /></ProtectedRoute>} />

        {/* Rotas do Marketplace */}
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/marketplace/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/create-marketplace-item" element={<ProtectedRoute><CreateMarketplaceItem /></ProtectedRoute>} />
        <Route path="/my-store" element={<ProtectedRoute><MyStore /></ProtectedRoute>} />
        <Route path="/ad-placement-selector" element={<ProtectedRoute><AdPlacementSelector /></ProtectedRoute>} />
        <Route path="/campaign-performance/:id" element={<ProtectedRoute><CampaignPerformance /></ProtectedRoute>} />
        <Route path="/ad-type-selector" element={<ProtectedRoute><AdCampaignTypeSelector /></ProtectedRoute>} />
        <Route path="/ad-content-selector" element={<ProtectedRoute><AdContentSelector /></ProtectedRoute>} />

        {/* Rotas de Perfil */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/user/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/global-search" element={<ProtectedRoute><GlobalSearch /></ProtectedRoute>} />
        <Route path="/rank" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/top-groups" element={<ProtectedRoute><TopGroups /></ProtectedRoute>} />
        <Route path="/top-groups/:category" element={<ProtectedRoute><TopGroups /></ProtectedRoute>} />

        {/* Rotas de Configurações */}
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/settings/security" element={<ProtectedRoute><SecurityLogin /></ProtectedRoute>} />
        <Route path="/settings/blocked-users" element={<ProtectedRoute><BlockedUsers /></ProtectedRoute>} />
        <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
        <Route path="/settings/language" element={<ProtectedRoute><LanguageSettings /></ProtectedRoute>} />
        <Route path="/settings/terms" element={<ProtectedRoute><TermsAndPrivacy /></ProtectedRoute>} />
        <Route path="/settings/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />

        {/* Rotas Financeiras */}
        <Route path="/financial" element={<ProtectedRoute><FinancialPanel /></ProtectedRoute>} />
        <Route path="/financial/providers" element={<ProtectedRoute><ProviderConfig /></ProtectedRoute>} />
        <Route path="/financial/transactions" element={<ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>} />
        
        {/* Rotas de Notificações e Mensagens */}
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        
        {/* Fallback global */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
