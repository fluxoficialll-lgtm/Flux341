
import React, { useState, useRef } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { ContainerFeed } from '../Componentes/ComponentesDeFeed/Container.Feed';
import { AvatarPreviewModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/AvatarPreviewModal';
import { Footer } from '../Componentes/layout/Footer';
import { VisitorHeader } from '../Componentes/ComponentesDeUserProfile/Componentes/VisitorHeader';
import { VisitorInfoCard } from '../Componentes/ComponentesDeUserProfile/Componentes/VisitorInfoCard';
import { VisitorBlockedState, VisitorPrivateState } from '../Componentes/ComponentesDeUserProfile/Componentes/VisitorStates';

export const UserProfile: React.FC = () => {
  const {
    isLoading, isMe, isBlocked, isPrivate, isFollowLoading, userData, userPosts, userProducts,
    relationStatus, canMessage, isContentVisible, targetUserEmail,
    handleFollowClick, handleToggleBlock, handleLike, handleVote, navigate, handleMessageClick
  } = useUserProfile();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('posts');

  if (isLoading || !userData) {
    return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i></div>;
  }

  const hasProducts = userProducts.length > 0;

  const renderTabs = () => {
    const tabs = ['posts', ...(hasProducts ? ['products'] : []), 'fotos', 'reels'];
    return (
      <div className="flex border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 capitalize text-sm py-3 text-center border-b-2 transition-all duration-300 ${activeTab === tab ? 'text-[#00c2ff] border-[#00c2ff]' : 'text-gray-400 border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

  const renderProducts = () => {
      if (userProducts.length === 0) return <div className="no-content">Nenhum produto.</div>;
      return (
          <div className="post-list px-3">
              {userProducts.map(product => (
                  <div key={product.id} className="bg-[#1a1d23] p-4 rounded-lg mb-3" onClick={() => navigate(`/marketplace/product/${product.id}`)}>
                      <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-2" />
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-gray-400">R$ {product.price}</p>
                  </div>
              ))}
          </div>
      );
  };

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
                  {renderTabs()}
                  <div className="tab-content px-2 pb-10">
                    {activeTab === 'posts' && (
                        <div className="post-list px-3">
                            {userPosts.filter(p => p.type !== 'video' && p.type !== 'photo').length > 0 ? 
                                userPosts.filter(p => p.type !== 'video' && p.type !== 'photo').map(post => (
                                    <ContainerFeed key={post.id} post={post} onLike={handleLike} onDelete={()=>{}} onUserClick={() => {}} onCommentClick={(id)=>navigate(`/post/${id}`)} onShare={() => {}} onVote={handleVote} onCtaClick={(l) => l?.startsWith('http') ? window.open(l,'_blank') : navigate(l||'')} />
                                )) : <div className="no-content">Nenhum post.</div>}
                        </div>
                    )}
                    {activeTab === 'products' && renderProducts()}
                    {activeTab === 'fotos' && (
                        <div className="post-list px-3">
                            {userPosts.filter(p => p.type === 'photo').length > 0 ? 
                                userPosts.filter(p => p.type === 'photo').map(post => (
                                    <ContainerFeed key={post.id} post={post} onLike={handleLike} onDelete={()=>{}} onUserClick={() => {}} onCommentClick={(id)=>navigate(`/post/${id}`)} onShare={() => {}} onVote={handleVote} onCtaClick={(l) => l?.startsWith('http') ? window.open(l,'_blank') : navigate(l||'')} />
                                )) : <div className="no-content">Nenhuma foto.</div>}
                        </div>
                    )}
                    {activeTab === 'reels' && (
                        <div className="post-list px-3">
                           {userPosts.filter(p => p.type === 'video').length > 0 ?
                                userPosts.filter(p => p.type === 'video').map(post => (
                                    <ContainerFeed key={post.id} post={post} onLike={handleLike} onDelete={()=>{}} onUserClick={() => {}} onCommentClick={(id)=>navigate(`/post/${id}`)} onShare={() => {}} onVote={handleVote} onCtaClick={(l) => l?.startsWith('http') ? window.open(l,'_blank') : navigate(l||'')} />
                                )) : <div className="no-content">Nenhum reel.</div>}
                        </div>
                    )}
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
