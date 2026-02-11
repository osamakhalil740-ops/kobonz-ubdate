/**
 * Global Location Selector Component
 * 
 * Provides a comprehensive location picker with:
 * - All countries (195+)
 * - All cities per country (complete data)
 * - All districts per city (complete data)
 * 
 * Uses on-demand loading from GeoNames API with Firebase caching
 */

import React, { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { logger } from '../utils/logger';
import { getAllCountries } from '../services/geonamesApi';
import { logger } from '../utils/logger';
import { getCitiesForCountry, getDistrictsForCity } from '../services/locationService';
import { logger } from '../utils/logger';
import CitySearchSelector from './CitySearchSelector';
import { logger } from '../utils/logger';

interface LocationData {
  country: string;
  countryCode: string;
  city: string;
  district: string;
}

interface GlobalLocationSelectorProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  required?: boolean;
  className?: string;
  showDistrict?: boolean; // Optional: some forms may not need district level
}

const GlobalLocationSelector: React.FC<GlobalLocationSelectorProps> = ({
  value,
  onChange,
  required = false,
  className = '',
  showDistrict = true,
}) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  // Load all countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load cities when country changes
  useEffect(() => {
    if (value.countryCode) {
      loadCities(value.countryCode);
    } else {
      setCities([]);
      setDistricts([]);
    }
  }, [value.countryCode]);

  // Load districts when city changes
  useEffect(() => {
    if (value.city && value.countryCode && showDistrict) {
      loadDistricts(value.city, value.countryCode);
    } else {
      setDistricts([]);
    }
  }, [value.city, value.countryCode, showDistrict]);

  const loadCountries = async () => {
    setLoadingCountries(true);
    setError(null);
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch (err) {
      setError('Failed to load countries. Please check your internet connection.');
      logger.error('Error loading countries:', err);
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadCities = async (countryCode: string) => {
    setLoadingCities(true);
    setError(null);
    try {
      const data = await getCitiesForCountry(countryCode);
      setCities(data);
    } catch (err) {
      setError('Failed to load cities. Please try again.');
      logger.error('Error loading cities:', err);
    } finally {
      setLoadingCities(false);
    }
  };

  const loadDistricts = async (cityName: string, countryCode: string) => {
    setLoadingDistricts(true);
    setError(null);
    try {
      const data = await getDistrictsForCity(cityName, countryCode);
      setDistricts(data);
    } catch (err) {
      setError('Failed to load districts. You can continue without selecting a district.');
      logger.error('Error loading districts:', err);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(c => c.countryCode === e.target.value);
    onChange({
      country: selectedCountry?.countryName || '',
      countryCode: e.target.value,
      city: '',
      district: '',
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      city: e.target.value,
      district: '',
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      district: e.target.value,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Country Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={value.countryCode}
            onChange={handleCountryChange}
            required={required}
            disabled={loadingCountries}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingCountries ? 'Loading countries...' : 'Select a country'}
            </option>
            {countries.map((country) => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.countryName}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {loadingCountries && (
          <p className="text-xs text-gray-500 mt-1">Loading all countries...</p>
        )}
      </div>

      {/* City Selector with Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City {required && <span className="text-red-500">*</span>}
        </label>
        
        {!value.countryCode ? (
          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
            Select a country first
          </div>
        ) : loadingCities ? (
          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading top cities...
          </div>
        ) : (
          <CitySearchSelector
            countryCode={value.countryCode}
            topCities={cities.map(city => ({
              id: city.id,
              name: city.name,
              population: city.population,
              state: city.state,
            }))}
            value={value.city}
            onChange={(cityName) => handleCityChange({ target: { value: cityName } } as any)}
            placeholder={`Search for your city in ${value.country}...`}
            required={required}
          />
        )}
      </div>

      {/* District Selector with Search (Optional) */}
      {showDistrict && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District/Neighborhood <span className="text-gray-400">(Optional)</span>
          </label>
          
          {!value.city ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
              Select a city first
            </div>
          ) : loadingDistricts ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading districts...
            </div>
          ) : (
            <CitySearchSelector
              countryCode={value.countryCode}
              topCities={districts.map(district => ({
                id: district.id,
                name: district.name,
                population: 0,
                state: '',
              }))}
              value={value.district}
              onChange={(districtName) => handleDistrictChange({ target: { value: districtName } } as any)}
              placeholder={`Search for your district in ${value.city}... (optional)`}
              required={false}
            />
          )}
          
          {!loadingDistricts && districts.length === 0 && value.city && (
            <p className="text-xs text-gray-500 mt-1">
              No districts available. You can skip this step.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalLocationSelector;
