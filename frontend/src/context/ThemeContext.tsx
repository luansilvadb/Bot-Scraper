import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Theme } from '@fluentui/react-components';
import { teamsLightTheme, teamsDarkTheme } from '@fluentui/react-components';
import { ThemeMode, STORAGE_KEY, getSystemPreference, resolveTheme } from './theme-utils';

export interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
  fluentTheme: Theme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use a reducer-like pattern to avoid setState in effect
  const [{ mode, resolvedTheme }, dispatch] = useState<{
    mode: ThemeMode;
    resolvedTheme: 'light' | 'dark';
  }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      return {
        mode: saved as ThemeMode,
        resolvedTheme: resolveTheme(saved as ThemeMode),
      };
    }
    return {
      mode: 'auto',
      resolvedTheme: getSystemPreference(),
    };
  });

  // Update document class and save preference when mode or resolvedTheme changes
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, resolvedTheme]);

  // Listen for system preference changes when in auto mode
  useEffect(() => {
    if (mode !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      dispatch((prev) => ({
        ...prev,
        resolvedTheme: event.matches ? 'dark' : 'light',
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    dispatch({
      mode: newMode,
      resolvedTheme: resolveTheme(newMode),
    });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch((prev) => {
      const nextMode = prev.mode === 'light' ? 'dark' : prev.mode === 'dark' ? 'auto' : 'light';
      return {
        mode: nextMode,
        resolvedTheme: resolveTheme(nextMode),
      };
    });
  }, []);

  const fluentTheme = resolvedTheme === 'light' ? teamsLightTheme : teamsDarkTheme;

  const value: ThemeContextType = {
    mode,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    fluentTheme,
    setMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
