import { useState, useEffect } from 'react';

/**
 * A custom React hook to manage staggered visibility of a list of items.
 * It incrementally reveals items with a specified delay.
 *
 * @param itemCount The total number of items to reveal.
 * @param delay The delay in milliseconds between each item's appearance.
 * @returns The number of items that should currently be visible.
 */
export const useStaggeredVisibility = (itemCount: number, delay: number = 250): number => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    // Reset visibility on re-render if needed (e.g., page change)
    setVisibleCount(0);

    const timers: NodeJS.Timeout[] = [];
    
    // Create a timer for each item to be revealed
    for (let i = 1; i <= itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleCount(prevCount => prevCount + 1);
      }, i * delay);
      timers.push(timer);
    }

    // Cleanup function to clear all timeouts if the component unmounts
    // This prevents memory leaks and state updates on unmounted components
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [itemCount, delay]); // Rerun effect if itemCount or delay changes

  return visibleCount;
};