/**
 * Unified Location Service
 * 
 * Provides a single interface for location data across the app
 * Integrates GeoNames API with fallback to static data
 */

import { logger } from '../utils/logger';
import { 
  getAllCountries as getGeoNamesCountries,
  getTopCitiesForCountry as getGeoNamesTopCities,
  searchCitiesInCountry as searchGeoNamesCities,
  getTopDistrictsForCity as getGeoNamesTopDistricts,
  searchDistrictsInCity as searchGeoNamesDistricts,
  searchLocations as searchGeoNames,
  validateGeoNamesSetup,
} from './geonamesApi';

// Fallback to static data if GeoNames is unavailable
// Note: Static data is minimal and only used as fallback
const staticCountries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
];

const getStaticCities = (countryCode: string): string[] => {
  // Minimal fallback data - only major cities
  const staticCityData: Record<string, string[]> = {
    'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'GB': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
    'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
    'CN': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu'],
    'BR': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
  };
  return staticCityData[countryCode] || [];
};

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

let geonamesAvailable = false;

/**
 * Initialize location service
 * Checks if GeoNames API is available
 */
export async function initializeLocationService(): Promise<void> {
  try {
    geonamesAvailable = await validateGeoNamesSetup();
    if (geonamesAvailable) {
      logger.debug('✅ Location Service: Using GeoNames (complete global data)');
    } else {
      logger.debug('⚠️ Location Service: Falling back to static data (limited coverage)');
    }
  } catch (error) {
    logger.error('Location service initialization failed:', error);
    geonamesAvailable = false;
  }
}

/**
 * Get all countries
 */
export async function getAllCountries(): Promise<Country[]> {
  try {
    if (geonamesAvailable) {
      const geoCountries = await getGeoNamesCountries();
      return geoCountries.map(c => ({
        code: c.countryCode,
        name: c.countryName,
        continent: c.continent,
        capital: c.capital,
      }));
    }
  } catch (error) {
    logger.warn('GeoNames unavailable, using static countries:', error);
  }
  
  // Fallback to static data
  return staticCountries.map(c => ({
    code: c.code,
    name: c.name,
  }));
}

/**
 * Get top cities for a country (instant loading)
 * Returns top 100 cities - fast and covers 95% of use cases
 */
export async function getCitiesForCountry(countryCode: string): Promise<City[]> {
  try {
    if (geonamesAvailable) {
      const geoCities = await getGeoNamesTopCities(countryCode);
      return geoCities.map(c => ({
        id: c.geonameId,
        name: c.name,
        population: c.population,
        state: c.adminName1,
      }));
    }
  } catch (error) {
    logger.warn(`GeoNames unavailable for ${countryCode}, using static cities:`, error);
  }
  
  // Fallback to static data
  const staticCitiesData = getStaticCities(countryCode);
  return staticCitiesData.map((name, index) => ({
    id: `${countryCode}-${index}`,
    name,
  }));
}

/**
 * Search cities by name
 * Used for autocomplete - returns matching cities instantly
 */
export async function searchCitiesByName(
  countryCode: string,
  searchTerm: string
): Promise<City[]> {
  if (!geonamesAvailable || !searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  try {
    const results = await searchGeoNamesCities(countryCode, searchTerm);
    return results.map(c => ({
      id: c.geonameId,
      name: c.name,
      population: c.population,
      state: c.adminName1,
    }));
  } catch (error) {
    logger.error('City search failed:', error);
    return [];
  }
}

/**
 * Get top districts for a city (instant loading)
 * Returns main districts only - districts are optional anyway
 */
export async function getDistrictsForCity(
  cityName: string,
  countryCode: string
): Promise<District[]> {
  try {
    if (geonamesAvailable) {
      const geoDistricts = await getGeoNamesTopDistricts(cityName, countryCode);
      return geoDistricts.map(d => ({
        id: d.geonameId,
        name: d.name,
      }));
    }
  } catch (error) {
    logger.warn(`GeoNames unavailable for ${cityName} districts:`, error);
  }
  
  // No fallback for districts in static data
  return [];
}

/**
 * Search districts by name
 * Used for autocomplete when user types
 */
export async function searchDistrictsByName(
  cityName: string,
  countryCode: string,
  searchTerm: string
): Promise<District[]> {
  if (!geonamesAvailable || !searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  try {
    const results = await searchGeoNamesDistricts(cityName, countryCode, searchTerm);
    return results.map(d => ({
      id: d.geonameId,
      name: d.name,
    }));
  } catch (error) {
    logger.error('District search failed:', error);
    return [];
  }
}

/**
 * Search locations globally
 */
export async function searchLocations(query: string): Promise<any[]> {
  if (!geonamesAvailable) {
    return [];
  }
  
  try {
    return await searchGeoNames(query, 50);
  } catch (error) {
    logger.error('Location search failed:', error);
    return [];
  }
}

/**
 * Check if GeoNames is available
 */
export function isGeoNamesAvailable(): boolean {
  return geonamesAvailable;
}

export default {
  initializeLocationService,
  getAllCountries,
  getCitiesForCountry,
  searchCitiesByName,
  getDistrictsForCity,
  searchDistrictsByName,
  searchLocations,
  isGeoNamesAvailable,
};
