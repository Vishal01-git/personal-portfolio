"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'terminal' | 'dracula';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'terminal',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('terminal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vp-theme-v2') as Theme | null;
    if (saved === 'terminal' || saved === 'dracula') {
      apply(saved);
    } else {
      apply('terminal'); // default to ember terminal dark
    }
    setMounted(true);
  }, []);

  function apply(t: Theme) {
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.add('dark'); // Always dark mode for tailwind utilities
    localStorage.setItem('vp-theme-v2', t);
    setThemeState(t);
  }

  const toggleTheme = () => apply(theme === 'terminal' ? 'dracula' : 'terminal');
  const setTheme = (t: Theme) => apply(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}