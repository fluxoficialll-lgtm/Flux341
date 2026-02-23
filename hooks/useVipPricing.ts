
import { useState, useEffect } from 'react';
import { GeoData } from '../ServiçosFrontend/ServiçoDeGeolocalização/geoService.js';
import { ConversionResult } from '../ServiçosFrontend/ServiçoDeMoeda/currencyService.js';
import { VipPriceResolver } from '../ServiçosFrontend/ServiçoDePreços/VipPriceResolver.js';
import { Group } from '../types';

export const useVipPricing = (group: Group | null) => {
    const [geoData, setGeoData] = useState<GeoData | null>(null);
    const [displayPriceInfo, setDisplayPriceInfo] = useState<ConversionResult | null>(null);

    useEffect(() => {
        const detect = async () => {
            const detected = await VipPriceResolver.detectUserGeo();
            setGeoData(detected);
        };
        detect();
    }, []);

    useEffect(() => {
        const updatePrice = async () => {
            if (group && geoData) {
                const conversion = await VipPriceResolver.resolvePrice(group, geoData);
                setDisplayPriceInfo(conversion);
            }
        };
        updatePrice();
    }, [group, geoData]);

    return { geoData, displayPriceInfo, setGeoData };
};
