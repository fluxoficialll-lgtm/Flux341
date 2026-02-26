
import React from 'react';
import { useGroupSalesPlatform } from '../../../hooks/HooksComponentes/useGroupSalesPlatform';
import { useModal } from '../../../Componentes/ComponenteDeInterfaceDeUsuario/ModalSystem';
import { PlatformStatusCard } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/sales-platform/PlatformStatusCard';
import { PlatformStructureEditor } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/sales-platform/PlatformStructureEditor';
import { PlatformInfoBox } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/sales-platform/PlatformInfoBox';
import { FolderOptionsModal } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/sales-platform/FolderOptionsModal';
import { ModalDeOpcoesDoCanal } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/ComponentesDeCanalDeGrupo/ModalDeOpcoesDoCanal';
import { Channel, SalesFolder, SalesSection } from '../../../types';

export const GroupSalesPlatformPage: React.FC = () => {
    const {
        group, loading, form, optionsModal, handleSave, handleBack,
        handleToggleStatus, handleOpenOptions, handleCloseOptions,
        handleUpdateChannelProperties, handleUpdateFolderProperties,
        handleAddFolderInside, handleAddChannelInside
    } = useGroupSalesPlatform();
    
    const { showPrompt } = useModal();

    if (loading || !group) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    const handleAddFolderWithPrompt = async () => {
        const name = await showPrompt('Nome da Pasta', 'Ex: Material Complementar');
        if (name) {
            handleAddFolderInside(name);
        }
    };

    const handleAddChannelWithPrompt = async () => {
        const name = await showPrompt('Nome do Canal de Chat', 'Ex: Suporte VIP');
        if (name) {
            handleAddChannelInside(name);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
                <button onClick={handleBack} className="mr-4 text-white text-xl">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold">Configuração do Modo Hub</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-5 max-w-[600px] mx-auto w-full pb-32 no-scrollbar">
                <div className="flex flex-col gap-6">
                    <PlatformStatusCard 
                        enabled={form.isSalesPlatformEnabled} 
                        onToggle={handleToggleStatus} 
                    />

                    {form.isSalesPlatformEnabled && (
                        <PlatformStructureEditor 
                            sections={form.salesPlatformSections}
                            onSectionsChange={form.setSalesPlatformSections}
                            onOptions={handleOpenOptions}
                        />
                    )}

                    <div className="mt-2">
                        <PlatformInfoBox />
                    </div>
                </div>

                <button 
                    className="btn-save-fixed" 
                    onClick={handleSave}
                >
                    Salvar Estrutura do Hub
                </button>
            </main>

            {optionsModal.isOpen && optionsModal.type === 'channel' && (
                <ModalDeOpcoesDoCanal 
                    isOpen={optionsModal.isOpen}
                    onClose={handleCloseOptions}
                    title={(optionsModal.target as Channel).name}
                    type="channel"
                    target={optionsModal.target as Channel}
                    onUpdateChannel={handleUpdateChannelProperties}
                />
            )}

            {optionsModal.isOpen && (optionsModal.type === 'folder' || optionsModal.type === 'section') && (
                <FolderOptionsModal 
                    isOpen={optionsModal.isOpen}
                    onClose={handleCloseOptions}
                    title={(optionsModal.target as any).name || (optionsModal.target as any).title}
                    type={optionsModal.type as any}
                    target={optionsModal.target as any}
                    onUpdateFolder={handleUpdateFolderProperties}
                    onAddFolderInside={handleAddFolderWithPrompt}
                    onAddChannelInside={handleAddChannelWithPrompt}
                />
            )}
            
            <div className="text-center opacity-10 text-[8px] uppercase font-black tracking-[3px] mb-8">
                Flux Hub Engine v4.3
            </div>
        </div>
    );
};
