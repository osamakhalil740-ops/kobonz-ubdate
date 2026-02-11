import { useState, useEffect } from 'react';

/**
 * Debounce hook - delays updating a value until after a specified delay
 * Useful for search inputs, API calls, etc.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   // This will only run 300ms after user stops typing
 *   searchAPI(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounced callback hook - creates a debounced version of a callback function
 * 
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced callback function
 * 
 * @example
 * const handleSearch = useDebouncedCallback((term: string) => {
 *   searchAPI(term);
 * }, 300);
 * 
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return (...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };
}

/**
 * Throttle hook - ensures a function is called at most once per specified interval
 * Different from debounce - this guarantees the function runs periodically
 * 
 * @param callback - The function to throttle
 * @param delay - Minimum interval between calls in milliseconds
 * @returns Throttled callback function
 * 
 * @example
 * const handleScroll = useThrottledCallback(() => {
 *   updateScrollPosition();
 * }, 100);
 * 
 * <div onScroll={handleScroll}>...</div>
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [lastRun, setLastRun] = useState<number>(Date.now());

  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastRun >= delay) {
      callback(...args);
      setLastRun(now);
    }
  };
}
