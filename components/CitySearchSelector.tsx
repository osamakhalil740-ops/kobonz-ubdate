/**
 * City Search Selector with Autocomplete
 * 
 * Features:
 * - Instant loading (shows top 100 cities immediately)
 * - Search/filter as you type
 * - Finds ANY city via GeoNames search
 * - Professional UX - no long waits
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { logger } from '../utils/logger';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { logger } from '../utils/logger';
import { searchCitiesByName } from '../services/locationService';
import { logger } from '../utils/logger';
import { useDebounce } from '../hooks/useDebounce';
import { logger } from '../utils/logger';

interface City {
  id: string | number;
  name: string;
  population?: number;
  state?: string;
}

interface CitySearchSelectorProps {
  countryCode: string;
  topCities: City[]; // Pre-loaded top 100 cities
  value: string;
  onChange: (cityName: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const CitySearchSelector: React.FC<CitySearchSelectorProps> = ({
  countryCode,
  topCities,
  value,
  onChange,
  placeholder = 'Search for your city...',
  disabled = false,
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search term for API calls (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update search term when value changes externally
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Memoized local filtering (instant, no API call)
  const filteredTopCities = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) {
      return topCities;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return topCities.filter(city =>
      city.name.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, topCities]);

  // Handle API search with debounced term (only when needed)
  useEffect(() => {
    // Don't search if term is too short
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Don't search if we found results in top cities
    if (filteredTopCities.length > 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Search GeoNames API only if no local results
    const searchAPI = async () => {
      setIsSearching(true);
      try {
        const results = await searchCitiesByName(countryCode, debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        logger.error('City search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchAPI();
  }, [debouncedSearchTerm, filteredTopCities.length, countryCode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // If user clears the input, reset selection
    if (!newValue) {
      onChange('');
    }
  };

  const handleCitySelect = (city: City) => {
    setSearchTerm(city.name);
    onChange(city.name);
    setIsOpen(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Combine filtered top cities and search results
  const displayedCities = searchResults.length > 0 ? searchResults : filteredTopCities;
  const showDropdown = isOpen && (displayedCities.length > 0 || isSearching);

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          autoComplete="off"
        />

        {searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {isSearching ? (
            <div className="px-4 py-3 text-center text-gray-500">
              Searching...
            </div>
          ) : displayedCities.length > 0 ? (
            <>
              {searchResults.length === 0 && filteredTopCities.length === topCities.length && (
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                  Top {topCities.length} cities (type to search for others)
                </div>
              )}
              {searchResults.length > 0 && (
                <div className="px-4 py-2 text-xs text-green-600 bg-green-50 border-b">
                  Search results for "{searchTerm}"
                </div>
              )}
              {displayedCities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{city.name}</div>
                      {city.state && (
                        <div className="text-sm text-gray-500">{city.state}</div>
                      )}
                    </div>
                    {city.population && city.population > 0 && (
                      <div className="text-xs text-gray-400">
                        {(city.population / 1000).toFixed(0)}k
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-3 text-center text-gray-500">
              No cities found. Try a different search term.
            </div>
          )}
        </div>
      )}

      {/* Helper text */}
      <p className="mt-1 text-xs text-gray-500">
        {topCities.length > 0 && !searchTerm && (
          <>Showing top {topCities.length} cities. Type to search for others.</>
        )}
        {searchTerm && filteredTopCities.length > 0 && searchResults.length === 0 && (
          <>Found {filteredTopCities.length} matching cities</>
        )}
        {searchTerm && searchResults.length > 0 && (
          <>Found {searchResults.length} cities matching "{searchTerm}"</>
        )}
      </p>
    </div>
  );
};

export default CitySearchSelector;
