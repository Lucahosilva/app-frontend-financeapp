import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode: () => setIsDarkMode(!isDarkMode) };
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};
