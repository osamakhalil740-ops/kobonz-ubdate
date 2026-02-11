import React, { useState, useEffect } from 'react';
import { 
  getAllCountries, 
  getCitiesForCountry, 
  getDistrictsForCity,
  getCitiesForCountryAsync,
  getDistrictsForCityAsync,
  isCoreCountry
} from '../utils/countryData';

interface LocationSelectorProps {
  selectedCountries?: string[];
  selectedCities?: string[];
  selectedAreas?: string[];
  isGlobal?: boolean;
  onChange: (data: {
    countries: string[];
    cities: string[];
    areas: string[];
    isGlobal: boolean;
  }) => void;
  allowMultiple?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCountries = [],
  selectedCities = [],
  selectedAreas = [],
  isGlobal = false,
  onChange,
  allowMultiple = true
}) => {
  const [countries] = useState(getAllCountries());
  const [currentCountry, setCurrentCountry] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  useEffect(() => {
    const loadCities = async () => {
      if (currentCountry) {
        // Check if it's a core country (instant load) or needs async loading
        if (isCoreCountry(currentCountry)) {
          setAvailableCities(getCitiesForCountry(currentCountry));
        } else {
          // Async load for non-core countries
          const cities = await getCitiesForCountryAsync(currentCountry);
          setAvailableCities(cities);
        }
        setCurrentCity('');
        setAvailableAreas([]);
      }
    };
    loadCities();
  }, [currentCountry]);

  useEffect(() => {
    const loadAreas = async () => {
      if (currentCountry && currentCity) {
        // Check if it's a core country (instant load) or needs async loading
        if (isCoreCountry(currentCountry)) {
          setAvailableAreas(getDistrictsForCity(currentCountry, currentCity));
        } else {
          // Async load for non-core countries
          const areas = await getDistrictsForCityAsync(currentCountry, currentCity);
          setAvailableAreas(areas);
        }
      }
    };
    loadAreas();
  }, [currentCountry, currentCity]);

  const handleGlobalToggle = (checked: boolean) => {
    onChange({
      countries: [],
      cities: [],
      areas: [],
      isGlobal: checked
    });
  };

  const handleAddCountry = () => {
    if (currentCountry && !selectedCountries.includes(currentCountry)) {
      onChange({
        countries: [...selectedCountries, currentCountry],
        cities: selectedCities,
        areas: selectedAreas,
        isGlobal: false
      });
    }
  };

  const handleAddCity = () => {
    if (currentCity && !selectedCities.includes(currentCity)) {
      onChange({
        countries: selectedCountries,
        cities: [...selectedCities, currentCity],
        areas: selectedAreas,
        isGlobal: false
      });
    }
  };

  const handleAddArea = (area: string) => {
    if (!selectedAreas.includes(area)) {
      onChange({
        countries: selectedCountries,
        cities: selectedCities,
        areas: [...selectedAreas, area],
        isGlobal: false
      });
    }
  };

  const handleRemoveCountry = (country: string) => {
    onChange({
      countries: selectedCountries.filter(c => c !== country),
      cities: selectedCities,
      areas: selectedAreas,
      isGlobal: false
    });
  };

  const handleRemoveCity = (city: string) => {
    onChange({
      countries: selectedCountries,
      cities: selectedCities.filter(c => c !== city),
      areas: selectedAreas,
      isGlobal: false
    });
  };

  const handleRemoveArea = (area: string) => {
    onChange({
      countries: selectedCountries,
      cities: selectedCities,
      areas: selectedAreas.filter(a => a !== area),
      isGlobal: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Global Toggle */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <input
          type="checkbox"
          id="globalCoupon"
          checked={isGlobal}
          onChange={(e) => handleGlobalToggle(e.target.checked)}
          className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="globalCoupon" className="text-sm font-semibold text-gray-700 cursor-pointer">
          🌍 This coupon is valid globally (all locations)
        </label>
      </div>

      {!isGlobal && (
        <>
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Countries
            </label>
            <div className="flex gap-2">
              <select
                value={currentCountry}
                onChange={(e) => setCurrentCountry(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a country...</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <button
                onClick={handleAddCountry}
                disabled={!currentCountry}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {selectedCountries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCountries.map(country => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {country}
                    <button
                      onClick={() => handleRemoveCountry(country)}
                      className="hover:text-purple-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Cities (Optional)
            </label>
            <div className="flex gap-2">
              <select
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                disabled={!currentCountry}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              >
                <option value="">Choose a city...</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <button
                onClick={handleAddCity}
                disabled={!currentCity}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCities.map(city => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {city}
                    <button
                      onClick={() => handleRemoveCity(city)}
                      className="hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Area Selection */}
          {availableAreas.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Areas/Districts (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                {availableAreas.map(area => (
                  <button
                    key={area}
                    onClick={() => handleAddArea(area)}
                    disabled={selectedAreas.includes(area)}
                    className={`px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                      selectedAreas.includes(area)
                        ? 'bg-pink-100 text-pink-800 border-2 border-pink-400'
                        : 'bg-white border border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              {selectedAreas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedAreas.map(area => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                    >
                      {area}
                      <button
                        onClick={() => handleRemoveArea(area)}
                        className="hover:text-pink-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {(selectedCountries.length > 0 || selectedCities.length > 0 || selectedAreas.length > 0) && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-semibold mb-2">
                ✓ Coupon Location Summary:
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                {selectedCountries.length > 0 && (
                  <li>• Valid in {selectedCountries.length} country(ies)</li>
                )}
                {selectedCities.length > 0 && (
                  <li>• Valid in {selectedCities.length} city(ies)</li>
                )}
                {selectedAreas.length > 0 && (
                  <li>• Valid in {selectedAreas.length} specific area(s)</li>
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LocationSelector;
