"use client";

import { useState, useEffect } from 'react';

/**
 * Hook for responsive design with media queries
 * 
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the query matches
 * 
 * @example
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 * const isMobile = useMediaQuery('(max-width: 767px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Handle SSR/initial render
    const media = window.matchMedia(query);
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Create listener
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Add listener (modern API)
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    
    // Fallback for older browsers
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

/**
 * Common breakpoint hooks for convenience
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
