import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    // Soporte para navegadores antiguos que usan addListener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
         media.removeEventListener('change', listener);
      } else {
         media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
};