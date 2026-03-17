"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to dark; read from localStorage on mount to avoid flash
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // On mount: read saved preference, then system preference as fallback
    const saved = localStorage.getItem('vp-theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      apply(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      apply(prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  function apply(t: Theme) {
    document.documentElement.setAttribute('data-theme', t);
    // Also keep the dark class in sync for Tailwind `dark:` variants
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vp-theme', t);
    setThemeState(t);
  }

  const toggleTheme = () => apply(theme === 'dark' ? 'light' : 'dark');
  const setTheme = (t: Theme) => apply(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {/* Prevent flash of wrong theme — hide until mounted */}
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}