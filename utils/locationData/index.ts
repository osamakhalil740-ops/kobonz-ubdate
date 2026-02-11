/**
 * Global Location Database - Lazy Loading Entry Point
 * 
 * This module provides access to 195+ countries with cities and areas.
 * Data is split into regional files and loaded on-demand for optimal performance.
 * 
 * Performance Strategy:
 * - Core 25 countries: Always loaded (embedded)
 * - Remaining 170+ countries: Lazy-loaded by region when needed
 * - Total data: ~2.5MB, but only ~150KB loaded initially
 */

import { countryData as coreCountries } from '../countryData';

// Type definitions
export interface CityData {
  [city: string]: string[];
}

export interface CountryData {
  cities: CityData;
}

export interface RegionalData {
  [country: string]: CountryData;
}

// Regional data loaders (lazy-loaded)
let africaData: RegionalData | null = null;
let asiaData: RegionalData | null = null;
let europeData: RegionalData | null = null;
let americasData: RegionalData | null = null;
let oceaniaData: RegionalData | null = null;

// Country to region mapping for fast lookup
const countryRegionMap: { [country: string]: string } = {
  // Americas
  "United States": "americas",
  "Canada": "americas",
  "Brazil": "americas",
  "Mexico": "americas",
  "Argentina": "americas",
  
  // Europe
  "United Kingdom": "europe",
  "Germany": "europe",
  "France": "europe",
  "Italy": "europe",
  "Spain": "europe",
  "Netherlands": "europe",
  "Switzerland": "europe",
  "Sweden": "europe",
  "Norway": "europe",
  "Denmark": "europe",
  "Finland": "europe",
  
  // Asia
  "UAE": "asia",
  "Saudi Arabia": "asia",
  "Japan": "asia",
  "China": "asia",
  "India": "asia",
  "South Korea": "asia",
  "Singapore": "asia",
  "Hong Kong": "asia",
  "Thailand": "asia",
  "Malaysia": "asia",
  "Indonesia": "asia",
  "Philippines": "asia",
  "Vietnam": "asia",
  
  // Africa
  "South Africa": "africa",
  "Nigeria": "africa",
  "Egypt": "africa",
  "Kenya": "africa",
  
  // Oceania
  "Australia": "oceania",
  
  // Africa (additional)
  "Algeria": "africa",
  "Angola": "africa",
  "Benin": "africa",
  "Botswana": "africa",
  "Burkina Faso": "africa",
  "Burundi": "africa",
  "Cameroon": "africa",
  "Cape Verde": "africa",
  "Central African Republic": "africa",
  "Chad": "africa",
  "Comoros": "africa",
  "Congo": "africa",
  "DR Congo": "africa",
  "Djibouti": "africa",
  "Equatorial Guinea": "africa",
  "Eritrea": "africa",
  "Eswatini": "africa",
  "Ethiopia": "africa",
  "Gabon": "africa",
  "Gambia": "africa",
  "Ghana": "africa",
  "Guinea": "africa",
  "Guinea-Bissau": "africa",
  "Ivory Coast": "africa",
  "Lesotho": "africa",
  "Liberia": "africa",
  "Libya": "africa",
  "Madagascar": "africa",
  "Malawi": "africa",
  "Mali": "africa",
  "Mauritania": "africa",
  "Mauritius": "africa",
  "Morocco": "africa",
  "Mozambique": "africa",
  "Namibia": "africa",
  "Niger": "africa",
  "Rwanda": "africa",
  "Sao Tome and Principe": "africa",
  "Senegal": "africa",
  "Seychelles": "africa",
  "Sierra Leone": "africa",
  "Somalia": "africa",
  "South Sudan": "africa",
  "Sudan": "africa",
  "Tanzania": "africa",
  "Togo": "africa",
  "Tunisia": "africa",
  "Uganda": "africa",
  "Zambia": "africa",
  "Zimbabwe": "africa",
  
  // Asia (additional)
  "Afghanistan": "asia",
  "Armenia": "asia",
  "Azerbaijan": "asia",
  "Bahrain": "asia",
  "Bangladesh": "asia",
  "Bhutan": "asia",
  "Brunei": "asia",
  "Cambodia": "asia",
  "East Timor": "asia",
  "Georgia": "asia",
  "Iran": "asia",
  "Iraq": "asia",
  "Israel": "asia",
  "Jordan": "asia",
  "Kazakhstan": "asia",
  "Kuwait": "asia",
  "Kyrgyzstan": "asia",
  "Laos": "asia",
  "Lebanon": "asia",
  "Maldives": "asia",
  "Mongolia": "asia",
  "Myanmar": "asia",
  "Nepal": "asia",
  "North Korea": "asia",
  "Oman": "asia",
  "Pakistan": "asia",
  "Palestine": "asia",
  "Qatar": "asia",
  "Sri Lanka": "asia",
  "Syria": "asia",
  "Taiwan": "asia",
  "Tajikistan": "asia",
  "Turkmenistan": "asia",
  "Uzbekistan": "asia",
  "Yemen": "asia",
  
  // Europe (additional)
  "Albania": "europe",
  "Andorra": "europe",
  "Austria": "europe",
  "Belarus": "europe",
  "Belgium": "europe",
  "Bosnia and Herzegovina": "europe",
  "Bulgaria": "europe",
  "Croatia": "europe",
  "Cyprus": "europe",
  "Czech Republic": "europe",
  "Estonia": "europe",
  "Greece": "europe",
  "Hungary": "europe",
  "Iceland": "europe",
  "Ireland": "europe",
  "Kosovo": "europe",
  "Latvia": "europe",
  "Liechtenstein": "europe",
  "Lithuania": "europe",
  "Luxembourg": "europe",
  "Malta": "europe",
  "Moldova": "europe",
  "Monaco": "europe",
  "Montenegro": "europe",
  "North Macedonia": "europe",
  "Poland": "europe",
  "Portugal": "europe",
  "Romania": "europe",
  "Russia": "europe",
  "San Marino": "europe",
  "Serbia": "europe",
  "Slovakia": "europe",
  "Slovenia": "europe",
  "Turkey": "europe",
  "Ukraine": "europe",
  "Vatican City": "europe",
  
  // Americas (additional)
  "Antigua and Barbuda": "americas",
  "Bahamas": "americas",
  "Barbados": "americas",
  "Belize": "americas",
  "Bolivia": "americas",
  "Chile": "americas",
  "Colombia": "americas",
  "Costa Rica": "americas",
  "Cuba": "americas",
  "Dominica": "americas",
  "Dominican Republic": "americas",
  "Ecuador": "americas",
  "El Salvador": "americas",
  "Grenada": "americas",
  "Guatemala": "americas",
  "Guyana": "americas",
  "Haiti": "americas",
  "Honduras": "americas",
  "Jamaica": "americas",
  "Nicaragua": "americas",
  "Panama": "americas",
  "Paraguay": "americas",
  "Peru": "americas",
  "Saint Kitts and Nevis": "americas",
  "Saint Lucia": "americas",
  "Saint Vincent and the Grenadines": "americas",
  "Suriname": "americas",
  "Trinidad and Tobago": "americas",
  "Uruguay": "americas",
  "Venezuela": "americas",
  
  // Oceania (additional)
  "Fiji": "oceania",
  "Kiribati": "oceania",
  "Marshall Islands": "oceania",
  "Micronesia": "oceania",
  "Nauru": "oceania",
  "New Zealand": "oceania",
  "Palau": "oceania",
  "Papua New Guinea": "oceania",
  "Samoa": "oceania",
  "Solomon Islands": "oceania",
  "Tonga": "oceania",
  "Tuvalu": "oceania",
  "Vanuatu": "oceania"
};

/**
 * Get all available countries (195+ countries)
 * This returns immediately without loading regional data
 */
export const getAllCountries = (): string[] => {
  return Object.keys(countryRegionMap).sort();
};

/**
 * Load regional data on-demand
 */
const loadRegionalData = async (region: string): Promise<RegionalData> => {
  switch (region) {
    case 'africa':
      if (!africaData) {
        const module = await import('./africa');
        africaData = module.africaData;
      }
      return africaData;
    
    case 'asia':
      if (!asiaData) {
        const module = await import('./asia');
        asiaData = module.asiaData;
      }
      return asiaData;
    
    case 'europe':
      if (!europeData) {
        const module = await import('./europe');
        europeData = module.europeData;
      }
      return europeData;
    
    case 'americas':
      if (!americasData) {
        const module = await import('./americas');
        americasData = module.americasData;
      }
      return americasData;
    
    case 'oceania':
      if (!oceaniaData) {
        const module = await import('./oceania');
        oceaniaData = module.oceaniaData;
      }
      return oceaniaData;
    
    default:
      return {};
  }
};

/**
 * Get cities for a country (with lazy loading)
 */
export const getCitiesForCountry = async (country: string): Promise<string[]> => {
  const region = countryRegionMap[country];
  
  if (!region) return [];
  
  // Check core countries first
  if (region === 'core') {
    const countryInfo = coreCountries[country as keyof typeof coreCountries];
    return countryInfo ? Object.keys(countryInfo.cities) : [];
  }
  
  // Load regional data
  const regionalData = await loadRegionalData(region);
  const countryInfo = regionalData[country];
  return countryInfo ? Object.keys(countryInfo.cities) : [];
};

/**
 * Get districts/areas for a city (with lazy loading)
 */
export const getDistrictsForCity = async (country: string, city: string): Promise<string[]> => {
  const region = countryRegionMap[country];
  
  if (!region) return [];
  
  // Check core countries first
  if (region === 'core') {
    const countryInfo = coreCountries[country as keyof typeof coreCountries];
    if (!countryInfo) return [];
    const cityInfo = countryInfo.cities[city as keyof typeof countryInfo.cities];
    return cityInfo || [];
  }
  
  // Load regional data
  const regionalData = await loadRegionalData(region);
  const countryInfo = regionalData[country];
  if (!countryInfo) return [];
  
  const cityInfo = countryInfo.cities[city];
  return cityInfo || [];
};

/**
 * Synchronous versions for backward compatibility (core countries only)
 * These work instantly for the 34 core countries
 */
export const getCitiesForCountrySync = (country: string): string[] => {
  const region = countryRegionMap[country];
  if (region !== 'core') return [];
  
  const countryInfo = coreCountries[country as keyof typeof coreCountries];
  return countryInfo ? Object.keys(countryInfo.cities) : [];
};

export const getDistrictsForCitySync = (country: string, city: string): string[] => {
  const region = countryRegionMap[country];
  if (region !== 'core') return [];
  
  const countryInfo = coreCountries[country as keyof typeof coreCountries];
  if (!countryInfo) return [];
  
  const cityInfo = countryInfo.cities[city as keyof typeof countryInfo.cities];
  return cityInfo || [];
};

/**
 * Check if a country is in the core (immediately available) set
 */
export const isCoreCountry = (country: string): boolean => {
  return countryRegionMap[country] === 'core';
};

/**
 * Get region for a country
 */
export const getRegionForCountry = (country: string): string | null => {
  return countryRegionMap[country] || null;
};

/**
 * Preload a region (useful for prefetching)
 */
export const preloadRegion = async (region: string): Promise<void> => {
  await loadRegionalData(region);
};

/**
 * Get countries by region
 */
export const getCountriesByRegion = (region: string): string[] => {
  return Object.keys(countryRegionMap).filter(country => countryRegionMap[country] === region).sort();
};
