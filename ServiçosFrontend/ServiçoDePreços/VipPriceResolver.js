import { geoService } from '../ServiçoDeGeolocalizacao/geoService.js';
import { currencyService } from '../ServiçoDeMoeda/currencyService.js';

export const VipPriceResolver = {
    async detectUserGeo() {
        return await geoService.detect();
    },

    async resolvePrice(group, geoData) {
        if (!group || !geoData) {
            return null;
        }

        const targetCurrency = geoData.country_code === 'BR' ? 'BRL' : 'USD';
        const price = group.prices[targetCurrency];

        if (!price) {
            return null;
        }

        return await currencyService.convert(price, targetCurrency);
    }
};