
import { GestorBase } from './GestorBase';
import { VipAccess, MarketplaceItem, AdCampaign } from '../../../types';
import { sqlite } from '../cache/engine';

export class GestorFinanceiro extends GestorBase {
    public vip = {
        grant: (access: VipAccess) => this.upsert('vip_access', `${access.userId}_${access.groupId}`, access),
        check: (uId: string, gId: string) => this.queryOne<VipAccess>('vip_access', `${uId}_${gId}`)?.status === 'active',
        get: (uId: string, gId: string) => this.queryOne<VipAccess>('vip_access', `${uId}_${gId}`)
    };

    public marketplace = {
        getAll: () => this.queryAll<MarketplaceItem>('marketplace'),
        findById: (id: string) => this.queryOne<MarketplaceItem>('marketplace', id),
        add: (i: MarketplaceItem) => this.upsert('marketplace', i.id, i, { timestamp: i.timestamp }),
        update: (i: MarketplaceItem) => this.upsert('marketplace', i.id, i, { timestamp: i.timestamp }),
        delete: (id: string) => {
            const items = this.queryAll<any>('marketplace').filter(i => String(i.id) !== String(id));
            sqlite.saveTableData('marketplace', items);
        }
    };

    public ads = {
        getAll: () => this.queryAll<AdCampaign>('ads'),
        findById: (id: string) => this.queryOne<AdCampaign>('ads', id),
        add: (ad: AdCampaign) => this.upsert('ads', ad.id, ad, { timestamp: ad.timestamp }),
        update: (ad: AdCampaign) => this.upsert('ads', ad.id, ad, { timestamp: ad.timestamp }),
        delete: (id: string) => {
            const items = this.queryAll<any>('ads').filter(i => String(i.id) !== String(id));
            sqlite.saveTableData('ads', items);
        }
    };
}
