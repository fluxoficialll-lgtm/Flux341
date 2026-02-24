
import { MarketplaceItem } from '../../../types';

const createMockMarketplaceItem = (id: number, overrides: Partial<MarketplaceItem> = {}): MarketplaceItem => ({
    id: `item-${id}`,
    title: `Produto Incrível ${id}`,
    price: 99.99 + id * 10,
    image: `https://picsum.photos/seed/${id}/400`,
    seller: `@usuario${id}`,
    location: 'São Paulo, SP',
    isAd: id % 5 === 0,
    category: id % 2 === 0 ? 'Eletrônicos' : 'Móveis',
    description: 'Descrição detalhada do produto, com todas as suas características e qualidades. Este é um item de alta qualidade, perfeito para você.',
    ...overrides,
});

export const simulacaoDeMarketplace = (): MarketplaceItem[] => {
    const items: MarketplaceItem[] = Array.from({ length: 20 }, (_, i) => createMockMarketplaceItem(i + 1));
    return items;
};
