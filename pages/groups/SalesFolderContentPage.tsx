
import React from 'react';
import { useSalesFolderContent } from '../../hooks/useSalesFolderContent';

// Subcomponentes
import { FolderContentHeader } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/FolderContentHeader';
import { InfoproductCard } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/InfoproductCard';
import { EmptyFolderState } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/EmptyFolderState';
import { InfoproductPreviewModal } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/InfoproductPreviewModal';
import { AddFileSophisticatedButton } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/AddFileSophisticatedButton';
import { UploadProgressCard } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/UploadProgressCard';

export const SalesFolderContentPage: React.FC = () => {
    const {
        loading,
        folder,
        canUpload,
        allowDownload,
        isUploading,
        uploadProgress,
        uploadCurrentItem,
        uploadTotalItems,
        fileInputRef,
        handleFileUpload,
        triggerFileInput,
        previewIndex,
        handleOpenPreview,
        handleClosePreview,
        handleBack
    } = useSalesFolderContent();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff]"></i>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <FolderContentHeader 
                onBack={handleBack} 
                folderName={folder?.name} 
            />

            <main className="flex-1 p-5 overflow-y-auto no-scrollbar pb-32">
                <div className="grid gap-3 max-w-[600px] mx-auto w-full">
                    {folder?.items && folder.items.length > 0 ? (
                        folder.items.map((item, index) => (
                            <InfoproductCard 
                                key={item.id} 
                                item={item} 
                                globalAllowDownload={allowDownload}
                                onPreview={() => handleOpenPreview(index)}
                            />
                        ))
                    ) : (
                        <EmptyFolderState />
                    )}
                </div>
            </main>

            {canUpload && (
                <>
                    <UploadProgressCard 
                        progress={uploadProgress}
                        current={uploadCurrentItem}
                        total={uploadTotalItems}
                        isVisible={isUploading}
                    />
                    
                    <AddFileSophisticatedButton 
                        onClick={triggerFileInput}
                        isLoading={isUploading}
                    />
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFileUpload(e.target.files)} 
                        multiple
                        className="hidden" 
                    />
                </>
            )}

            <InfoproductPreviewModal 
                items={folder?.items || []}
                initialIndex={previewIndex}
                onClose={handleClosePreview}
            />

            <div className="text-center opacity-10 text-[8px] uppercase font-black tracking-[3px] mb-8">
                Flux Content Delivery v1.1
            </div>
        </div>
    );
};