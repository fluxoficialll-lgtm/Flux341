
import React from 'react';
import { useGroupSalesPlatformView } from '../../hooks/useGroupSalesPlatformView';
import { OwnerControls } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/OwnerControls';
import { PlatformGroupCard } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/PlatformGroupCard';
import { LoadingScreen } from '../../Componentes/LoadingScreen';
import { SalesPlatformEmptyState } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/SalesPlatformEmptyState';
import { SalesPlatformSection } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/SalesPlatformSection';

export const GroupSalesPlatformView: React.FC = () => {
    const {
        group,
        canManage,
        loading,
        handleFolderClick,
        handleChannelClick,
        handleBack
    } = useGroupSalesPlatformView();

    if (loading || !group) {
        return <LoadingScreen text="Carregando Hub..." />;
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <style>{`
                .platform-header {
                    height: 75px;
                    padding: 0 24px;
                    display: flex;
                    align-items: center;
                    background: #0c0f14;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    position: sticky;
                    top: 0;
                    z-index: 40;
                }
                
                .main-scroll-area {
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
            `}</style>

            <header className="platform-header">
                <button onClick={handleBack} className="text-[#00c2ff] text-xl p-2 -ml-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="ml-2 flex flex-col">
                    <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[3px]">Hub da Comunidade</span>
                </div>
            </header>

            {canManage && <OwnerControls group={group} />}

            <main className="main-scroll-area p-5 pb-32">
                <div className="max-w-[600px] mx-auto w-full">
                    
                    <div className="mb-12">
                        <PlatformGroupCard group={group} />
                    </div>

                    {(group.salesPlatformSections || []).map(section => (
                        <SalesPlatformSection 
                            key={section.id} 
                            section={section} 
                            onFolderClick={handleFolderClick} 
                            onChannelClick={handleChannelClick} 
                        />
                    ))}

                    {(!group.salesPlatformSections || group.salesPlatformSections.length === 0) && (
                        <SalesPlatformEmptyState />
                    )}

                    <div className="mt-20 text-center opacity-10">
                        <div className="text-[9px] uppercase font-black tracking-[5px] mb-2">Flux Hub Engine v4.3</div>
                        <div className="w-10 h-1 bg-white mx-auto rounded-full"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};
