/**
 * Seed Location Data Script
 * 
 * Run this to pre-populate the location cache
 * 
 * Usage:
 *   npm run seed-locations
 * 
 * Or with tsx:
 *   npx tsx scripts/seedLocations.ts
 */

import { seedAll, estimateSeedingTime } from '../utils/seedLocationCache';
import { logger } from '../utils/logger';

async function main() {
  logger.debug('╔════════════════════════════════════════════╗');
  logger.debug('║   🌍 Location Cache Seeding Utility       ║');
  logger.debug('╚════════════════════════════════════════════╝');
  logger.debug('');
  logger.debug('This will pre-populate your Firebase cache with:');
  logger.debug('  ✓ All 195+ countries');
  logger.debug('  ✓ All cities for 25 priority countries');
  logger.debug('  ✓ All districts for 50 major cities');
  logger.debug('');
  logger.debug(`⏰ Estimated time: ${estimateSeedingTime()}`);
  logger.debug('');
  logger.debug('Press Ctrl+C to cancel...');
  logger.debug('');
  
  // Wait 5 seconds to allow user to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  logger.debug('🚀 Starting seeding process...\n');
  
  try {
    await seedAll((progress) => {
      const percentage = Math.round((progress.completed / progress.total) * 100);
      logger.debug(`[${percentage}%] ${progress.current}`);
      
      if (progress.errors.length > 0) {
        logger.debug(`   ⚠️ ${progress.errors.length} errors so far`);
      }
    });
    
    logger.debug('\n✅ Seeding completed successfully!');
    logger.debug('🎉 Your location cache is now ready for production use.');
    process.exit(0);
  } catch (error) {
    logger.error('\n❌ Seeding failed:', error);
    logger.error('Please check your GeoNames API setup and try again.');
    process.exit(1);
  }
}

main();
