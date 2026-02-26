
import React from 'react';
import { MarketplaceItem } from '../../types';

interface ProductCardProps {
    product: MarketplaceItem;
    onClick: (item: MarketplaceItem) => void;
}

// Função auxiliar para formatar o preço
const getPriceText = (prod: MarketplaceItem): string => {
    if (!prod) return '';
    try {
        const price = prod.price ?? 0;
        return price > 0 ? `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Grátis';
    } catch (e) {
        return 'Consulte';
    }
};

// Componente Card de Produto
export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const priceText = getPriceText(product);

    return (
        <div 
            className="bg-[#14181e] rounded-lg overflow-hidden shadow-lg transition-transform duration-200 transform hover:-translate-y-1 cursor-pointer flex flex-col h-full" 
            onClick={() => onClick(product)}
        >
            {/* Imagem do Produto */}
            <div className="relative w-full aspect-square">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                {product.isAd && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">DESTAQUE</div>
                )}
            </div>

            {/* Informações do Produto */}
            <div className="p-3 flex flex-col flex-grow">
                <h4 className="text-white font-semibold text-sm truncate flex-grow">{product.title}</h4>
                <p className="text-green-400 font-bold text-lg my-1">{priceText}</p>
                
                <div className="flex items-center text-gray-400 text-xs mt-1">
                    <i className="fa-solid fa-location-dot mr-1.5"></i>
                    <span className="truncate">{product.location}</span>
                </div>

                {product.soldCount !== undefined && product.soldCount > 0 && (
                     <p className="text-yellow-500 text-xs mt-1 font-medium">{product.soldCount} vendidos</p>
                )}
            </div>

            {/* Botão de Ação */}
            <div className="p-3 pt-0">
                <button className="w-full bg-[#00c2ff] text-black font-bold py-2 px-4 rounded-md text-sm transition-colors hover:bg-white">
                    Ver Produto
                </button>
            </div>
        </div>
    );
};
