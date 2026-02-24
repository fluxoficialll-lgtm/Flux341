import { useState, useEffect, useCallback } from 'react';
import { LocationFilter, Coordinates, AddressProfile } from '../types/location.types';

// Mock de um serviço de geolocalização reverso
const reverseGeocode = async (coords: Coordinates): Promise<AddressProfile> => {
  console.log(`Reverse geocoding for:`, coords);
  // Simulação de chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    city: 'Cidade Exemplo',
    state: 'Estado Exemplo',
    stateCode: 'EX',
    country: 'País Exemplo',
    countryCode: 'EX',
    displayName: 'Cidade Exemplo, EX, País Exemplo'
  };
};


const getInitialFilter = (): LocationFilter => {
    try {
        const storedFilter = localStorage.getItem('location_filter');
        if (storedFilter) {
            return JSON.parse(storedFilter);
        }
    } catch (error) {
        console.error("Failed to parse location filter from localStorage", error);
    }
    return { type: 'global' };
};

export const usePreciseLocation = () => {
  const [currentFilter, setCurrentFilter] = useState<LocationFilter>(getInitialFilter());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
        localStorage.setItem('location_filter', JSON.stringify(currentFilter));
    } catch (error) {
        console.error("Failed to save location filter to localStorage", error);
    }
  }, [currentFilter]);

  const captureGps = useCallback(async () => {
    setLoading(true);
    if (!navigator.geolocation) {
        setLoading(false);
        throw new Error('Geolocalização não é suportada por este navegador.');
    }

    try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const coords: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };

        const address = await reverseGeocode(coords);
        
        setCurrentFilter({
            type: 'city', // Padrão para cidade após captura de GPS
            coords,
            targetAddress: address,
        });

    } catch (error) {
        console.error("Erro ao capturar GPS:", error);
        throw error; // Lança o erro para que o componente possa lidar com ele (e.g., mostrar um alerta)
    } finally {
        setLoading(false);
    }
  }, []);

  const updateFilter = useCallback((newFilter: Partial<LocationFilter>) => {
    setCurrentFilter(prevFilter => ({ ...prevFilter, ...newFilter }));
  }, []);

  const clearFilter = useCallback(() => {
    setCurrentFilter({ type: 'global' });
  }, []);

  return { currentFilter, loading, captureGps, updateFilter, clearFilter };
};