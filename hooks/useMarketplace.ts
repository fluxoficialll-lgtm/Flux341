
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketplaceService } from '../ServiçosFrontend/ServiçoDeMarketplace/marketplaceService.js';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';
import { MarketplaceItem } from '../types';

export const useMarketplace = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [allItems, setAllItems] = useState<MarketplaceItem[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const loadItems = useCallback(() => {
        const email = authService.getCurrentUserEmail() || undefined;
        const items = marketplaceService.getRecommendedItems(email);
        setAllItems(items || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const email = authService.getCurrentUserEmail() || undefined;
        setCurrentUserEmail(email);
        loadItems();
        marketplaceService.fetchItems().catch(err => console.warn("Marketplace sync failed", err));
        const unsubscribe = servicoDeSimulacao.subscribe('marketplace', () => { loadItems(); });
        return () => unsubscribe();
    }, [loadItems]);

    const filteredProducts = useMemo(() => {
        if (!allItems) return [];
        let result = [...allItems];
        
        if (activeCategory !== 'Todos') {
            if (activeCategory === 'Destaque') result = result.filter(p => p && p.isAd);
            else result = result.filter(p => p && p.category === activeCategory);
        }
        
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => p && (
                (p.title && p.title.toLowerCase().includes(term)) || 
                (p.location && p.location.toLowerCase().includes(term))
            ));
        }
        return result;
    }, [allItems, activeCategory, searchTerm]);

    const handleProductClick = (item: MarketplaceItem) => {
        if (!item) return;
        if (currentUserEmail) marketplaceService.trackView(item, currentUserEmail);
        
        if (item.isAd && item.ctaLink) {
            if (item.ctaLink.startsWith('http')) window.open(item.ctaLink, '_blank');
            else navigate(item.ctaLink);
        } else { 
            navigate(`/marketplace/product/${item.id}`); 
        }
    };

    return {
        activeCategory,
        setActiveCategory,
        searchTerm,
        setSearchTerm,
        isMenuOpen,
        setIsMenuOpen,
        isLoading,
        filteredProducts,
        handleProductClick
    };
};
