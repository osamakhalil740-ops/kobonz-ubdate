import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { 
  getAllCountries as getAllCountriesService,
  getCitiesForCountry as getCitiesService,
  getDistrictsForCity as getDistrictsService,
} from '../services/locationService';
import { logger } from '../utils/logger';

type ViewMode = 'grid' | 'list' | 'map';

interface Country {
  code: string;
  name: string;
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

const LocationBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // State for async data loading
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [citiesForSelectedCountry, setCitiesForSelectedCountry] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [districtsCache, setDistrictsCache] = useState<Record<string, District[]>>({});

  // Load all countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const countriesData = await getAllCountriesService();
        setCountries(countriesData);
      } catch (error) {
        logger.error('Failed to load countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);

  // Load cities when country is selected
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedCountry) {
        setCitiesForSelectedCountry([]);
        return;
      }

      try {
        setLoadingCities(true);
        const citiesData = await getCitiesService(selectedCountry.code);
        setCitiesForSelectedCountry(citiesData);
      } catch (error) {
        logger.error(`Failed to load cities for ${selectedCountry.name}:`, error);
        setCitiesForSelectedCountry([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedCountry]);

  // Load districts for a city (lazy loading)
  const loadDistrictsForCity = async (cityName: string, countryCode: string) => {
    const cacheKey = `${countryCode}-${cityName}`;
    
    // Return cached districts if available
    if (districtsCache[cacheKey]) {
      return districtsCache[cacheKey];
    }

    try {
      const districts = await getDistrictsService(cityName, countryCode);
      setDistrictsCache(prev => ({
        ...prev,
        [cacheKey]: districts
      }));
      return districts;
    } catch (error) {
      logger.error(`Failed to load districts for ${cityName}:`, error);
      return [];
    }
  };

  // Filter countries and cities based on search (client-side filtering for performance)
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: { 
      country: Country; 
      cities: City[];
    }[] = [];

    // Search through all countries
    countries.forEach(country => {
      const countryMatch = country.name.toLowerCase().includes(query);
      
      // For now, we only show countries that match
      // Cities will be loaded when user selects a country
      if (countryMatch) {
        results.push({
          country,
          cities: []
        });
      }
    });

    return results;
  }, [searchQuery, countries]);

  const toggleCity = async (cityKey: string, cityName: string, countryCode: string) => {
    const newExpanded = new Set(expandedCities);
    const isExpanding = !newExpanded.has(cityKey);
    
    if (isExpanding) {
      newExpanded.add(cityKey);
      // Load districts when expanding
      await loadDistrictsForCity(cityName, countryCode);
    } else {
      newExpanded.delete(cityKey);
    }
    
    setExpandedCities(newExpanded);
  };

  const getCouponCount = (country?: string, city?: string, area?: string) => {
    // This would be replaced with actual API call
    return Math.floor(Math.random() * 50) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            🌍 Explore Locations Worldwide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse coupons and deals from all {countries.length} countries worldwide with millions of cities and areas
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for countries..."
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all shadow-lg"
              disabled={loadingCountries}
            />
          </div>
          {searchQuery && !loadingCountries && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              {filteredData?.length || 0} country(ies) found
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 text-center hover:shadow-glow transition-all duration-300">
            <GlobeAltIcon className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">{countries.length}+</div>
            <div className="text-gray-600">Countries</div>
          </div>
          <div className="glass-panel p-6 text-center hover:shadow-glow transition-all duration-300">
            <BuildingOfficeIcon className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">4M+</div>
            <div className="text-gray-600">Cities Worldwide</div>
          </div>
          <div className="glass-panel p-6 text-center hover:shadow-glow transition-all duration-300">
            <MapPinIcon className="h-12 w-12 text-pink-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">∞</div>
            <div className="text-gray-600">Local Districts</div>
          </div>
        </div>

        {/* Search Results or Full List */}
        <div className="max-w-7xl mx-auto">
          {loadingCountries ? (
            /* Loading State */
            <div className="glass-panel p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Countries...</h3>
              <p className="text-gray-600">Please wait while we load the location data</p>
            </div>
          ) : searchQuery && filteredData ? (
            /* Search Results */
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h2>
              {filteredData.map(item => (
                <div key={item.country.code} className="glass-panel p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <GlobeAltIcon className="h-6 w-6 text-blue-500" />
                    {item.country.name}
                  </h3>
                  <Link
                    to={`/locations/${encodeURIComponent(item.country.name)}`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    View All Deals in {item.country.name}
                  </Link>
                </div>
              ))}
              {filteredData.length === 0 && (
                <div className="glass-panel p-12 text-center">
                  <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Results Found</h3>
                  <p className="text-gray-600">Try searching with different keywords</p>
                </div>
              )}
            </div>
          ) : (
            /* Dropdown Country Selector */
            <div className="space-y-6">
              <div className="glass-panel p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Browse Locations by Country</h2>
                <p className="text-gray-600 text-center mb-6">Select a country from the dropdown to explore cities and local areas</p>
                
                {/* Country Dropdown */}
                <div className="max-w-2xl mx-auto mb-8">
                  <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Country
                  </label>
                  <div className="relative">
                    <GlobeAltIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
                    <select
                      id="country-select"
                      value={selectedCountry?.code || ''}
                      onChange={(e) => {
                        const countryCode = e.target.value;
                        const country = countries.find(c => c.code === countryCode);
                        setSelectedCountry(country || null);
                        setSelectedCity(null);
                        setExpandedCities(new Set());
                      }}
                      className="w-full pl-14 pr-10 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all shadow-lg appearance-none bg-white cursor-pointer"
                    >
                      <option value="">Choose a country...</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Selected Country Details */}
                {selectedCountry && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                      <div className="flex items-center gap-4">
                        <GlobeAltIcon className="h-10 w-10 text-blue-600" />
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{selectedCountry.name}</h3>
                          <p className="text-gray-600">
                            {loadingCities ? (
                              <span className="animate-pulse">Loading cities...</span>
                            ) : (
                              <>{citiesForSelectedCountry.length} cities available</>
                            )}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/locations/${encodeURIComponent(selectedCountry.name)}`}
                        className="btn-primary"
                      >
                        View All Deals
                      </Link>
                    </div>

                    {/* Cities Grid */}
                    {loadingCities ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading cities for {selectedCountry.name}...</p>
                      </div>
                    ) : citiesForSelectedCountry.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {citiesForSelectedCountry.map(city => {
                          const cityKey = `${selectedCountry.code}-${city.name}`;
                          const isCityExpanded = expandedCities.has(cityKey);
                          const cacheKey = `${selectedCountry.code}-${city.name}`;
                          const districts = districtsCache[cacheKey] || [];
                          
                          return (
                            <div key={city.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                              <button
                                onClick={() => toggleCity(cityKey, city.name, selectedCountry.code)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  {isCityExpanded ? (
                                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                                  )}
                                  <BuildingOfficeIcon className="h-5 w-5 text-purple-500" />
                                  <div className="text-left">
                                    <span className="font-semibold text-gray-800 block">{city.name}</span>
                                    {city.state && (
                                      <span className="text-xs text-gray-500">{city.state}</span>
                                    )}
                                  </div>
                                </div>
                                <Link
                                  to={`/locations/${encodeURIComponent(selectedCountry.name)}/${encodeURIComponent(city.name)}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                                >
                                  View
                                </Link>
                              </button>
                              
                              {isCityExpanded && (
                                <div className="px-4 pb-3 bg-gray-50 border-t border-gray-100">
                                  {districts.length > 0 ? (
                                    <div className="space-y-1 mt-2">
                                      {districts.map(district => (
                                        <Link
                                          key={district.id}
                                          to={`/locations/${encodeURIComponent(selectedCountry.name)}/${encodeURIComponent(city.name)}/${encodeURIComponent(district.name)}`}
                                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 py-1 group"
                                        >
                                          <MapPinIcon className="h-4 w-4 text-pink-500 group-hover:text-purple-500" />
                                          <span>{district.name}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-3 text-sm text-gray-500">
                                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                                      Loading districts...
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 glass-panel">
                        <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Cities Found</h3>
                        <p className="text-gray-600">No city data available for {selectedCountry.name}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State */}
                {!selectedCountry && (
                  <div className="text-center py-12">
                    <GlobeAltIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Select a country to see available cities and areas</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationBrowser;
