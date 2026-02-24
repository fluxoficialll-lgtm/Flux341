
import React, { useState } from 'react';
import { AffiliateStats } from '../../types';
import { PixelSettingsModal } from '../groups/PixelSettingsModal';
import { ReferredSellersModal } from './ReferredSellersModal';

interface AffiliateCardProps {
    affiliateStats: AffiliateStats | null | undefined;
    pixelId: string;
    setPixelId: (val: string) => void;
    pixelToken: string;
    setPixelToken: (val: string) => void;
    isSavingMarketing: boolean;
    onSaveMarketing: (data: { pixelId: string, pixelToken: string }) => void;
    onCopyAffiliateLink: () => void;
    isCopyingLink: boolean;
    onOpenTracking: () => void;
}

// Abordagem final: O componente agora se recusa a renderizar a seção problemática
// se os dados vitais não estiverem presentes.
export const AffiliateCard: React.FC<AffiliateCardProps> = ({
    affiliateStats,
    pixelId,
    setPixelId,
    pixelToken,
    setPixelToken,
    isSavingMarketing,
    onSaveMarketing,
    onCopyAffiliateLink,
    isCopyingLink,
    onOpenTracking
}) => {
    const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);
    const [isSellersModalOpen, setIsSellersModalOpen] = useState(false);

    const handleDismissSeller = (sellerId: string) => {
        alert(`Vendedor ${sellerId} dispensado.`);
    };

    // Se affiliateStats não existir, o componente simplesmente não renderiza as partes críticas.
    // Isso evita qualquer possibilidade de erro de `undefined.length`.
    if (!affiliateStats) {
        return (
            <div className="flux-card bg-white/5 border border-[#FFD700]/30 rounded-[20px] p-6 mb-5 shadow-2xl animate-fade-in">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] text-[#FFD700] font-bold uppercase tracking-wider">
                        <i className="fa-solid fa-users-rays mr-2"></i> Programa de Afiliados
                    </h3>
                    <div className="bg-gray-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">CARREGANDO...</div>
                </div>
                <div className="text-center text-gray-400 text-sm p-8">Carregando dados de afiliado...</div>
            </div>
        );
    }

    return (
        <div className="flux-card bg-white/5 border border-[#FFD700]/30 rounded-[20px] p-6 mb-5 shadow-2xl animate-fade-in" style={{ background: 'rgba(255, 215, 0, 0.03)' }}>
            <style>{`
                .add-pixel-btn { width: 100%; padding: 14px; background: rgba(255, 255, 255, 0.03); border: 1px dashed #FFD700; border-radius: 12px; color: #FFD700; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px; }
                .sellers-btn { width: 100%; padding: 14px; background: #1a1e26; border: 1px solid rgba(255, 215, 0, 0.2); border-radius: 12px; color: #fff; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; margin-top: 15px; transition: 0.3s; }
                .seller-count-tag { background: #FFD700; color: #000; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 900; }
            `}</style>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] text-[#FFD700] font-bold uppercase tracking-wider">
                    <i className="fa-solid fa-users-rays mr-2"></i> Programa de Afiliados
                </h3>
                <div className="bg-[#FFD700] text-black px-2 py-0.5 rounded text-[10px] font-black uppercase">Master</div>
            </div>

            <button className="w-full py-4 bg-[#FFD700] text-black border-none rounded-xl font-black cursor-pointer flex items-center justify-center gap-2" onClick={onCopyAffiliateLink}>
                <i className={`fa-solid ${isCopyingLink ? 'fa-check' : 'fa-link'}`}></i>
                {isCopyingLink ? 'LINK COPIADO!' : 'LINK DE RECRUTAMENTO'}
            </button>

            <button className="w-full py-3 mt-3 bg-transparent border border-dashed border-[#FFD700]/50 text-[#FFD700] rounded-xl font-bold text-[13px]" onClick={onOpenTracking}>
                <i className="fa-solid fa-bullseye"></i> GERAR LINK RASTREÁVEL (UTM)
            </button>

            <div className="marketing-section mt-5 pt-5 border-t border-[#FFD700]/20">
                <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1 tracking-widest text-center">
                    <i className="fa-solid fa-rocket mr-1"></i> Rastreamento de Recrutamento
                </label>
                <button className="add-pixel-btn" onClick={() => setIsPixelModalOpen(true)}>
                    <i className={`fa-solid ${pixelId ? 'fa-gear' : 'fa-plus-circle'}`}></i>
                    {pixelId ? 'CONFIGURAR PIXEL' : 'ADICIONAR PIXEL'}
                </button>
            </div>

            <button className="sellers-btn" onClick={() => setIsSellersModalOpen(true)}>
                <span className="flex items-center gap-2">
                    <i className="fa-solid fa-users text-[#FFD700]"></i>
                    Vendedores Indicados
                </span>
                <span className="seller-count-tag">
                    {affiliateStats.referredSellers.length}
                </span>
            </button>

            <p className="text-[10px] text-gray-500 text-center mt-4 px-4 italic">
                Acompanhe o desempenho de sua rede de vendedores e gerencie suas comissões ativas.
            </p>

            <PixelSettingsModal 
                isOpen={isPixelModalOpen}
                onClose={() => setIsPixelModalOpen(false)}
                initialData={{ pixelId, pixelToken }}
                onSave={(data) => {
                    setPixelId(data.pixelId);
                    setPixelToken(data.pixelToken);
                    onSaveMarketing(data);
                }}
            />

            <ReferredSellersModal 
                isOpen={isSellersModalOpen}
                onClose={() => setIsSellersModalOpen(false)}
                sellers={affiliateStats.referredSellers}
                onDismissSeller={handleDismissSeller}
            />
        </div>
    );
};
