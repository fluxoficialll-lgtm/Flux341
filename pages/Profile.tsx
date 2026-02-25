
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/ModalSystem';
import { FollowListModal } from '../Componentes/ComponentesDeProfile/FollowListModal';
import { ContainerFeed } from '../Componentes/ComponentesDeFeed/Container.Feed';
import { Footer } from '../Componentes/layout/Footer';
import { AvatarPreviewModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/AvatarPreviewModal';
import { ProfileHeader } from '../Componentes/ComponentesDeProfile/Componentes/ProfileHeader';
import { ProfileInfoCard } from '../Componentes/ComponentesDeProfile/Componentes/ProfileInfoCard';
import { ProfileTabNav } from '../Componentes/ComponentesDeProfile/Componentes/ProfileTabNav';
import { ProfileReelsGrid } from '../Componentes/ComponentesDeProfile/Componentes/tabs/ProfileReelsGrid';
import { ProfileProductsGrid } from '../Componentes/ComponentesDeProfile/Componentes/tabs/ProfileProductsGrid';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { showConfirm } = useModal();
    const {
        scrollRef,
        user,
        activeTab,
        setActiveTab,
        myPosts,
        myProducts,
        followersCount,
        followingCount,
        followListType,
        followListData,
        isPreviewOpen,
        setIsPreviewOpen,
        loading,
        error,
        deletePost,
        handleLike,
        handleShowFollowList,
        closeFollowList,
        navigateToUserProfile,
        handleShare,
        handleUserClick,
        handleVote,
        handleCtaClick
    } = useProfile();

    const onDeletePost = (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deletePost(postId, () => 
            showConfirm("Excluir Post", "Tem certeza que deseja excluir este post permanentemente?", "Excluir", "Cancelar")
        );
    };

    if (loading) {
        return <div className="loading-screen">Carregando perfil...</div>;
    }

    if (error) {
        return <div className="error-screen">{error}</div>;
    }

    const handleNickname = user?.profile?.nickname || user?.profile?.name || "Usuário";
    const handleUsername = user?.profile?.name ? `@${user.profile.name}` : "@usuario";
    const displayBio = user?.profile?.bio || "Sem biografia definida.";
    const displayAvatar = user?.profile?.photoUrl;
    const displayWebsite = user?.profile?.website;

    return (
        <div className="profile-page h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <style>{`
                main { flex-grow: 1; overflow-y: auto; padding-top: 80px; padding-bottom: 100px; scroll-behavior: smooth; }
                .no-content { text-align: center; color: #666; padding: 30px 0; font-size: 14px; width: 100%; }
            `}</style>

            <ProfileHeader onHomeClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} />

            <main className="flex-grow w-full overflow-y-auto no-scrollbar" ref={scrollRef}>
                <div style={{width:'100%', maxWidth:'500px', margin:'0 auto', paddingTop:'10px', paddingBottom: '100px'}}>
                    <ProfileInfoCard 
                        avatar={displayAvatar}
                        nickname={handleNickname}
                        username={handleUsername}
                        bio={displayBio}
                        website={displayWebsite}
                        stats={{
                            posts: myPosts.length,
                            followers: followersCount,
                            following: followingCount
                        }}
                        onAvatarClick={() => setIsPreviewOpen(true)}
                        onFollowersClick={() => handleShowFollowList('followers')}
                        onFollowingClick={() => handleShowFollowList('following')}
                        onEditClick={() => navigate('/edit-profile')}
                        onShareClick={() => alert('Compartilhar')}
                    />

                    <div className="profile-tabs-container">
                        <ProfileTabNav 
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            hasProducts={myProducts.length > 0}
                        />
                        <div className="tab-content">
                            {activeTab === 'posts' && (
                                <div className="post-list animate-fade-in px-3">
                                    {myPosts.filter(p => p.type === 'text' || p.type === 'poll').length > 0 ? 
                                        myPosts.filter(p => p.type === 'text' || p.type === 'poll').map(post => (
                                            <ContainerFeed 
                                                key={post.id} 
                                                post={post} 
                                                currentUserId={user?.id} 
                                                onLike={handleLike} 
                                                onDelete={(e, id) => onDeletePost(id, e)} 
                                                onUserClick={handleUserClick} 
                                                onCommentClick={(id) => navigate(`/post/${id}`)} 
                                                onShare={handleShare} 
                                                onVote={handleVote} 
                                                onCtaClick={handleCtaClick} 
                                            />
                                        )) : <div className="no-content">Sem posts.</div>}
                                </div>
                            )}

                            {activeTab === 'products' && (
                                <ProfileProductsGrid 
                                    products={myProducts}
                                    onProductClick={(id) => navigate(`/marketplace/product/${id}`)}
                                />
                            )}

                            {activeTab === 'fotos' && (
                                <div className="post-list animate-fade-in px-3">
                                    {myPosts.filter(p => p.type === 'photo').length > 0 ? 
                                        myPosts.filter(p => p.type === 'photo').map(post => (
                                            <ContainerFeed 
                                                key={post.id} 
                                                post={post} 
                                                currentUserId={user?.id} 
                                                onLike={handleLike} 
                                                onDelete={(e, id) => onDeletePost(id, e)} 
                                                onUserClick={handleUserClick} 
                                                onCommentClick={(id) => navigate(`/post/${id}`)} 
                                                onShare={handleShare} 
                                                onVote={handleVote} 
                                                onCtaClick={handleCtaClick} 
                                            />
                                        )) : <div className="no-content">Sem fotos.</div>}
                                </div>
                            )}

                            {activeTab === 'reels' && (
                                <ProfileReelsGrid 
                                    reels={myPosts.filter(p => p.type === 'video')}
                                    onReelClick={(post) => navigate(`/reels/${post.id}`, { state: { authorId: post.authorId } })}
                                    onDelete={(postId) => deletePost(postId, () => showConfirm("Excluir Reel", "Tem certeza que deseja excluir este reel?", "Excluir", "Cancelar"))}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <FollowListModal 
                type={followListType} 
                data={followListData} 
                onClose={closeFollowList} 
                onUserClick={navigateToUserProfile} 
            />
            
            <AvatarPreviewModal 
                isOpen={isPreviewOpen} 
                onClose={() => setIsPreviewOpen(false)} 
                imageSrc={displayAvatar || ''} 
                username={handleNickname || ''} 
            />
        </div>
    );
};
