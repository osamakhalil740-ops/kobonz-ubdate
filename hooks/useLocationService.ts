/**
 * React Hook for Location Service
 * Provides easy-to-use location data with caching and loading states
 */

import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { 
  getAllCountries, 
  getCitiesForCountry, 
  getDistrictsForCity 
} from '../services/locationService';

interface Country {
  code: string;
  name: string;
  continent?: string;
  capital?: string;
}

interface City {
  id: string | number;
  name: string;
  population?: number;
  state?: string;
}

interface District {
  id: string | number;
  name: string;
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        if (mounted) {
          setCountries(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load countries');
          logger.error('Error loading countries:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCountries();

    return () => {
      mounted = false;
    };
  }, []);

  return { countries, loading, error };
}

export function useCities(countryCode: string | null) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCities = async () => {
      if (!countryCode) {
        setCities([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getCitiesForCountry(countryCode);
        if (mounted) {
          setCities(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load cities');
          logger.error('Error loading cities:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCities();

    return () => {
      mounted = false;
    };
  }, [countryCode]);

  return { cities, loading, error };
}

export function useDistricts(cityName: string | null, countryCode: string | null) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDistricts = async () => {
      if (!cityName || !countryCode) {
        setDistricts([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getDistrictsForCity(cityName, countryCode);
        if (mounted) {
          setDistricts(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load districts');
          logger.error('Error loading districts:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDistricts();

    return () => {
      mounted = false;
    };
  }, [cityName, countryCode]);

  return { districts, loading, error };
}
