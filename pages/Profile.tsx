import React from 'react';

import { ProfileHeader } from '../Componentes/Componentes.Perfil.Proprio/ProfileHeader';
import { ProfileInfoCard } from '../Componentes/Componentes.Perfil.Proprio/ProfileInfoCard';
import { ProfileTabNav } from '../Componentes/Componentes.Perfil.Proprio/ProfileTabNav';
import { ProfileReelsGrid } from '../Componentes/Componentes.Perfil.Proprio/tabs/ProfileReelsGrid';
import { ProfileProductsGrid } from '../Componentes/Componentes.Perfil.Proprio/tabs/ProfileProductsGrid';
import { ContainerFeed } from '../Componentes/ComponentesDeFeed/Container.Feed';
import { Footer } from '../Componentes/layout/Footer';
import { FollowListModal } from '../Componentes/Componentes.Perfil.Proprio/FollowListModal';
import { AvatarPreviewModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/AvatarPreviewModal';

export const Profile = () => {
    const activeTab = 'posts';

    const mockPosts = [
        { id: '1', type: 'text' },
        { id: '2', type: 'photo' },
        { id: '3', type: 'video' }
    ];

    const mockProducts = [{ id: '1' }, { id: '2' }];

    return (
        <div className="profile-page h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">

            <style>{`
                main { flex-grow: 1; overflow-y: auto; padding-top: 80px; padding-bottom: 100px; }
                .no-content { text-align: center; color: #666; padding: 30px 0; font-size: 14px; width: 100%; }
            `}</style>

            <ProfileHeader />

            <main className="flex-grow w-full overflow-y-auto no-scrollbar">
                <div style={{width:'100%', maxWidth:'500px', margin:'0 auto', paddingTop:'10px', paddingBottom: '100px'}}>

                    <ProfileInfoCard />

                    <div className="profile-tabs-container">
                        <ProfileTabNav 
                            activeTab={activeTab}
                            setActiveTab={() => {}}
                            hasProducts={true}
                        />

                        <div className="tab-content">

                            {activeTab === 'posts' && (
                                <div className="post-list animate-fade-in px-3">
                                    {mockPosts.length > 0 ? 
                                        mockPosts.map(post => (
                                            <ContainerFeed key={post.id} post={post} />
                                        )) : <div className="no-content">Sem posts.</div>}
                                </div>
                            )}

                            {activeTab === 'products' && (
                                <ProfileProductsGrid 
                                    products={mockProducts}
                                />
                            )}

                            {activeTab === 'fotos' && (
                                <div className="post-list animate-fade-in px-3">
                                    {mockPosts.length > 0 ? 
                                        mockPosts.map(post => (
                                            <ContainerFeed key={post.id} post={post} />
                                        )) : <div className="no-content">Sem fotos.</div>}
                                </div>
                            )}

                            {activeTab === 'reels' && (
                                <ProfileReelsGrid 
                                    reels={mockPosts}
                                />
                            )}

                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <FollowListModal />

            <AvatarPreviewModal 
                isOpen={false}
                imageSrc=""
                username="Usuário"
            />
        </div>
    );
};