import { useEffect, useRef, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * Custom hook to prevent race conditions and memory leaks in async operations
 * 
 * Usage:
 * const safeAsync = useSafeAsync();
 * 
 * useEffect(() => {
 *   safeAsync(async () => {
 *     const data = await fetchData();
 *     setState(data); // Only updates if component is still mounted
 *   });
 * }, []);
 */
export function useSafeAsync() {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeAsync = useCallback(
    async <T>(asyncFunction: () => Promise<T>): Promise<T | undefined> => {
      try {
        const result = await asyncFunction();
        
        // Only return result if component is still mounted
        if (isMountedRef.current) {
          return result;
        }
        
        return undefined;
      } catch (error) {
        // Only throw error if component is still mounted
        if (isMountedRef.current) {
          throw error;
        }
        
        // Silent failure for unmounted components
        logger.warn('Async operation completed after component unmount:', error);
        return undefined;
      }
    },
    []
  );

  return safeAsync;
}

/**
 * Hook to check if component is mounted
 * Useful for conditional state updates
 */
export function useIsMounted() {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}
