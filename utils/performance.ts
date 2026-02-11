/**
 * Performance Monitoring Utilities
 * 
 * Provides tools for measuring and optimizing application performance
 */

import { IS_DEV, IS_PROD } from '../config/constants';
import { logger } from '../utils/logger';

/**
 * Performance Mark
 */
export interface PerformanceMark {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * Performance Metrics Storage
 */
const performanceMarks = new Map<string, PerformanceMark>();

/**
 * Start a performance measurement
 */
export function startMeasure(name: string, metadata?: Record<string, any>): void {
  if (!IS_DEV && !IS_PROD) return;

  performanceMarks.set(name, {
    name,
    startTime: performance.now(),
    metadata
  });

  if (IS_DEV) {
    logger.debug(`⏱️ [Performance] Started: ${name}`);
  }
}

/**
 * End a performance measurement
 */
export function endMeasure(name: string): number | null {
  const mark = performanceMarks.get(name);
  
  if (!mark) {
    logger.warn(`⚠️ [Performance] No start mark found for: ${name}`);
    return null;
  }

  const endTime = performance.now();
  const duration = endTime - mark.startTime;

  mark.endTime = endTime;
  mark.duration = duration;

  if (IS_DEV) {
    logger.debug(`✅ [Performance] Completed: ${name} - ${duration.toFixed(2)}ms`);
  }

  // Log slow operations
  if (duration > 1000) {
    logger.warn(`🐌 [Performance] Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
  }

  return duration;
}

/**
 * Get all performance marks
 */
export function getAllMarks(): PerformanceMark[] {
  return Array.from(performanceMarks.values());
}

/**
 * Clear all performance marks
 */
export function clearMarks(): void {
  performanceMarks.clear();
}

/**
 * Measure function execution time
 */
export function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    startMeasure(name);
    try {
      const result = await fn();
      endMeasure(name);
      resolve(result);
    } catch (error) {
      endMeasure(name);
      reject(error);
    }
  });
}

/**
 * Measure synchronous function execution
 */
export function measureSync<T>(name: string, fn: () => T): T {
  startMeasure(name);
  const result = fn();
  endMeasure(name);
  return result;
}

/**
 * Report performance metrics (for production monitoring)
 */
export function reportMetrics(): void {
  if (!IS_PROD) return;

  const marks = getAllMarks();
  
  // Send to analytics service
  import('../config/monitoring').then(({ analytics }) => {
    marks.forEach(mark => {
      if (mark.duration) {
        analytics.track('performance_metric', {
          name: mark.name,
          duration: Math.round(mark.duration),
          metadata: mark.metadata,
        });
      }
    });
  }).catch(() => {
    // Silently fail if analytics not available
  });
  
  if (IS_DEV) {
    console.table(marks);
  }
}

/**
 * Monitor component render performance
 */
export function usePerformanceMonitor(componentName: string) {
  if (!IS_DEV) return;

  const renderCount = React.useRef(0);
  
  React.useEffect(() => {
    renderCount.current++;
    logger.debug(`🔄 [Render] ${componentName} rendered ${renderCount.current} times`);
  });
}

// Export for use in React components
import React from 'react';
import { logger } from '../utils/logger';
