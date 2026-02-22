
import React from 'react';

export const SalesPlatformEmptyState: React.FC = () => {
    return (
        <div className="text-center py-20 opacity-30 border-2 border-dashed border-white/5 rounded-[40px] mt-4">
            <i className="fa-solid fa-store-slash text-3xl text-gray-600 mb-4"></i>
            <p className="font-black uppercase tracking-widest text-[11px]">Nenhum conteúdo disponível.</p>
        </div>
    );
};
