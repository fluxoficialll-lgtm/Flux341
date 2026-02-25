
import React, { useState, useRef } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { ContainerFeed } from '../Componentes/ComponentesDeFeed/Container.Feed';
import { AvatarPreviewModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/AvatarPreviewModal';
import { Footer } from '../Componentes/layout/Footer';
import { VisitorHeader } from '../Componentes/ComponentesDeUserProfile/Componentes/VisitorHeader';
import { VisitorInfoCard } from '../Componentes/ComponentesDeUserProfile/Componentes/VisitorInfoCard';
import { VisitorBlockedState, VisitorPrivateState } from '../Componentes/ComponentesDeUserProfile/Componentes/VisitorStates';
import { ProfileTabNav } from '../Componentes/ComponentesDeProfile/Componentes/ProfileTabNav';
import { ProfileReelsGrid } from '../Componentes/ComponentesDeProfile/Componentes/tabs/ProfileReelsGrid';
import { ProfileProductsGrid } from '../Componentes/ComponentesDeProfile/Componentes/tabs/ProfileProductsGrid';

export const UserProfile: React.FC = () => {
  const {
    isLoading, isMe, isBlocked, isPrivate, isFollowLoading, userData, userPosts, userProducts,
    activeTab, setActiveTab, relationStatus, canMessage, isContentVisible, targetUserEmail,
    handleFollowClick, handleToggleBlock, handleLike, handleVote, navigate, handleMessageClick
  } = useUserProfile();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (isLoading || !userData) {
    return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i></div>;
  }

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
      <style>{`
          main { flex-grow: 1; overflow-y: auto; padding-top: 80px; padding-bottom: 100px; scroll-behavior: smooth; }
          .post-list { padding: 0 10px; display: flex; flex-direction: column; }
          .no-content { text-align: center; color: #666; padding: 40px 0; font-size: 14px; width: 100%; }
      `}</style>

      <VisitorHeader 
        onBack={() => navigate(-1)}
        onLogoClick={() => scrollRef.current?.scrollTo({top: 0, behavior: 'smooth'})}
        isMe={isMe}
        isBlocked={isBlocked}
        onToggleBlock={handleToggleBlock}
        onReport={() => alert('Denunciar usuário')}
        username={userData.username}
      />

      <main ref={scrollRef} className="no-scrollbar">
        <div style={{width:'100%', maxWidth:'500px', margin:'0 auto'}}>
          {isBlocked ? (
            <VisitorBlockedState />
          ) : (
            <>
              <VisitorInfoCard 
                avatar={userData.avatar}
                nickname={userData.nickname}
                username={userData.username}
                bio={userData.bio}
                stats={userData.stats}
                isMe={isMe}
                isBlocked={isBlocked}
                relationStatus={relationStatus}
                isFollowLoading={isFollowLoading}
                canMessage={canMessage}
                onFollowClick={handleFollowClick}
                onMessageClick={handleMessageClick}
                onAvatarClick={() => setIsPreviewOpen(true)}
              />

              {isContentVisible ? (
                <div className="animate-fade-in">
                  <ProfileTabNav 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    hasProducts={userProducts.length > 0}
                  />
                  <div className="tab-content px-2 pb-10">
                    {activeTab === 'posts' && (
                        <div className="post-list px-3">
                            {userPosts.filter(p => p.type !== 'video' && p.type !== 'photo').length > 0 ? 
                                userPosts.filter(p => p.type !== 'video' && p.type !== 'photo').map(post => (
                                    <ContainerFeed key={post.id} post={post} onLike={handleLike} onDelete={()=>{}} onUserClick={() => {}} onCommentClick={(id)=>navigate(`/post/${id}`)} onShare={() => {}} onVote={handleVote} onCtaClick={(l) => l?.startsWith('http') ? window.open(l,'_blank') : navigate(l||'')} />
                                )) : <div className="no-content">Nenhum post.</div>}
                        </div>
                    )}
                    {activeTab === 'products' && <ProfileProductsGrid products={userProducts} onProductClick={(id) => navigate(`/marketplace/product/${id}`)} />}
                    {activeTab === 'fotos' && (
                        <div className="post-list px-3">
                            {userPosts.filter(p => p.type === 'photo').length > 0 ? 
                                userPosts.filter(p => p.type === 'photo').map(post => (
                                    <ContainerFeed key={post.id} post={post} onLike={handleLike} onDelete={()=>{}} onUserClick={() => {}} onCommentClick={(id)=>navigate(`/post/${id}`)} onShare={() => {}} onVote={handleVote} onCtaClick={(l) => l?.startsWith('http') ? window.open(l,'_blank') : navigate(l||'')} />
                                )) : <div className="no-content">Nenhuma foto.</div>}
                        </div>
                    )}
                    {activeTab === 'reels' && <ProfileReelsGrid reels={userPosts.filter(p => p.type === 'video')} onReelClick={(post) => navigate(`/reels/${post.id}`, { state: { authorId: targetUserEmail } })} onDelete={() => {}} />}
                  </div>
                </div>
              ) : (
                <VisitorPrivateState />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      <AvatarPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        imageSrc={userData?.avatar || ''} 
        username={userData?.nickname || ''} 
      />
    </div>
  );
};
