/**
 * Performance Monitoring Utilities
 * Track and optimize application performance
 */

import { logger } from './logger';

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string, startTime: number): void {
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  if (renderTime > 16) { // More than one frame (16ms at 60fps)
    logger.debug(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
  }
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Measure API call performance
 */
export async function measureApiCall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 1000) {
      logger.warn(`Slow API call: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    logger.error(`Failed API call: ${name} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Get Web Vitals metrics
 */
export function reportWebVitals(): void {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return;
  }

  // Report Core Web Vitals
  try {
    // First Contentful Paint (FCP)
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navTiming = navigationEntries[0] as PerformanceNavigationTiming;
      logger.info('Performance Metrics', {
        domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
        loadComplete: navTiming.loadEventEnd - navTiming.loadEventStart,
        domInteractive: navTiming.domInteractive,
      });
    }

    // Paint Timing
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      logger.debug(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
    });
  } catch (error) {
    logger.error('Error reporting web vitals', error);
  }
}

/**
 * Optimize images for better performance
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  // If using a CDN, add query parameters for optimization
  // Example: Cloudinary, Imgix, etc.
  if (!url) return url;
  
  // For now, return the original URL
  // In production, you'd integrate with your image CDN
  return url;
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(urls: string[]): void {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    if (url.endsWith('.woff2') || url.endsWith('.woff')) {
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    } else if (url.endsWith('.css')) {
      link.as = 'style';
    } else if (url.endsWith('.js')) {
      link.as = 'script';
    }
    
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Check if device has slow connection
 */
export function isSlowConnection(): boolean {
  if (!('connection' in navigator)) {
    return false;
  }
  
  const connection = (navigator as any).connection;
  return connection?.effectiveType === 'slow-2g' || 
         connection?.effectiveType === '2g' ||
         connection?.saveData === true;
}

/**
 * Lazy load non-critical CSS
 */
export function loadStylesheet(href: string): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}
