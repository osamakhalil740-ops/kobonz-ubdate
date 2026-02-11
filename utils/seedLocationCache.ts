/**
 * Location Cache Seeding Utility
 * 
 * Pre-populates Firebase cache with frequently accessed countries and cities
 * to ensure fast initial load for most users
 * 
 * Run this after GeoNames setup to pre-warm the cache
 */

import { 
  getAllCountries,
  getAllCitiesForCountry,
  getAllDistrictsForCity,
  getLocationStats,
} from '../services/geonamesApi';

interface SeedProgress {
  total: number;
  completed: number;
  current: string;
  errors: string[];
}

/**
 * Top countries by internet users and business activity
 * These will be pre-cached for instant loading
 */
const PRIORITY_COUNTRIES = [
  'US', // United States
  'CN', // China
  'IN', // India
  'BR', // Brazil
  'JP', // Japan
  'RU', // Russia
  'DE', // Germany
  'GB', // United Kingdom
  'FR', // France
  'KR', // South Korea
  'IT', // Italy
  'CA', // Canada
  'ES', // Spain
  'MX', // Mexico
  'ID', // Indonesia
  'AU', // Australia
  'TR', // Turkey
  'SA', // Saudi Arabia
  'AE', // UAE
  'EG', // Egypt
  'PK', // Pakistan
  'BD', // Bangladesh
  'NG', // Nigeria
  'PH', // Philippines
  'VN', // Vietnam
];

/**
 * Major cities to pre-cache districts for
 */
const PRIORITY_CITIES = {
  US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
  GB: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
  IN: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
  CN: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu'],
  BR: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
  JP: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo'],
  DE: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
  FR: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
  AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  CA: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton'],
};

/**
 * Seed all countries (fast - just one API call)
 */
export async function seedCountries(onProgress?: (progress: SeedProgress) => void): Promise<void> {
  logger.debug('🌍 Seeding countries...');
  
  try {
    const countries = await getAllCountries();
    logger.debug(`✅ Cached ${countries.length} countries`);
    
    if (onProgress) {
      onProgress({
        total: 1,
        completed: 1,
        current: 'All countries',
        errors: [],
      });
    }
  } catch (error) {
    logger.error('❌ Failed to seed countries:', error);
    throw error;
  }
}

/**
 * Seed priority countries' cities
 * This is the most time-consuming operation
 */
export async function seedPriorityCities(
  onProgress?: (progress: SeedProgress) => void
): Promise<void> {
  logger.debug('🏙️ Seeding priority cities...');
  
  const progress: SeedProgress = {
    total: PRIORITY_COUNTRIES.length,
    completed: 0,
    current: '',
    errors: [],
  };
  
  for (const countryCode of PRIORITY_COUNTRIES) {
    progress.current = `Loading cities for ${countryCode}`;
    if (onProgress) onProgress({ ...progress });
    
    try {
      const cities = await getAllCitiesForCountry(countryCode);
      logger.debug(`✅ Cached ${cities.length} cities for ${countryCode}`);
      progress.completed++;
    } catch (error) {
      const errorMsg = `Failed to cache cities for ${countryCode}`;
      logger.error(`❌ ${errorMsg}:`, error);
      progress.errors.push(errorMsg);
      progress.completed++;
    }
    
    if (onProgress) onProgress({ ...progress });
    
    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  logger.debug(`✅ Completed seeding ${progress.completed} countries`);
  if (progress.errors.length > 0) {
    logger.warn(`⚠️ ${progress.errors.length} errors occurred:`, progress.errors);
  }
}

/**
 * Seed districts for major cities
 * Optional - can be done gradually over time
 */
export async function seedPriorityDistricts(
  onProgress?: (progress: SeedProgress) => void
): Promise<void> {
  logger.debug('🏘️ Seeding priority districts...');
  
  const totalCities = Object.values(PRIORITY_CITIES).flat().length;
  const progress: SeedProgress = {
    total: totalCities,
    completed: 0,
    current: '',
    errors: [],
  };
  
  for (const [countryCode, cities] of Object.entries(PRIORITY_CITIES)) {
    for (const cityName of cities) {
      progress.current = `Loading districts for ${cityName}, ${countryCode}`;
      if (onProgress) onProgress({ ...progress });
      
      try {
        const districts = await getAllDistrictsForCity(cityName, countryCode);
        logger.debug(`✅ Cached ${districts.length} districts for ${cityName}`);
        progress.completed++;
      } catch (error) {
        const errorMsg = `Failed to cache districts for ${cityName}`;
        logger.error(`❌ ${errorMsg}:`, error);
        progress.errors.push(errorMsg);
        progress.completed++;
      }
      
      if (onProgress) onProgress({ ...progress });
      
      // Delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  logger.debug(`✅ Completed seeding districts for ${progress.completed} cities`);
  if (progress.errors.length > 0) {
    logger.warn(`⚠️ ${progress.errors.length} errors occurred:`, progress.errors);
  }
}

/**
 * Full seeding process
 * WARNING: This will take 2-4 hours due to rate limiting
 * Best run once during initial setup
 */
export async function seedAll(
  onProgress?: (progress: SeedProgress) => void
): Promise<void> {
  logger.debug('🚀 Starting full location cache seeding...');
  logger.debug('⏰ This will take 2-4 hours due to API rate limits');
  logger.debug('💡 You can close this and it will continue in the background');
  
  const startTime = Date.now();
  
  try {
    // Step 1: Seed countries (fast)
    logger.debug('\n📍 Step 1/3: Seeding countries...');
    await seedCountries(onProgress);
    
    // Step 2: Seed priority cities (slow - 25 countries × ~30 seconds each = ~12 minutes)
    logger.debug('\n📍 Step 2/3: Seeding priority cities...');
    await seedPriorityCities(onProgress);
    
    // Step 3: Seed priority districts (very slow - 50 cities × ~10 seconds each = ~8 minutes)
    logger.debug('\n📍 Step 3/3: Seeding priority districts...');
    await seedPriorityDistricts(onProgress);
    
    const duration = Math.round((Date.now() - startTime) / 1000 / 60);
    logger.debug(`\n✅ Seeding completed in ${duration} minutes!`);
    
    // Show cache statistics
    const stats = await getLocationStats();
    logger.debug('\n📊 Cache Statistics:');
    logger.debug(`   Countries: ${stats.totalCountries} (${stats.cachedCountries} cached)`);
    logger.debug(`   Cities: ${stats.cachedCities} countries cached`);
    logger.debug(`   Districts: ${stats.cachedDistricts} cities cached`);
    
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    throw error;
  }
}

/**
 * Estimate time remaining for seeding
 */
export function estimateSeedingTime(
  includeCities: boolean = true,
  includeDistricts: boolean = true
): string {
  let minutes = 1; // Countries
  
  if (includeCities) {
    minutes += PRIORITY_COUNTRIES.length * 0.5; // ~30 seconds per country
  }
  
  if (includeDistricts) {
    const totalCities = Object.values(PRIORITY_CITIES).flat().length;
    minutes += totalCities * 0.2; // ~12 seconds per city
  }
  
  if (minutes < 60) {
    return `~${Math.round(minutes)} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `~${hours}h ${mins}m`;
  }
}

// Export for use in seed script
export default {
  seedCountries,
  seedPriorityCities,
  seedPriorityDistricts,
  seedAll,
  estimateSeedingTime,
};
