import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '@fluentui/react-components';
import { customLightTheme, customDarkTheme } from '../styles/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    themeMode: ThemeMode;
    fluentTheme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        // Check localStorage
        const saved = localStorage.getItem('theme-preference') as ThemeMode;
        if (saved === 'light' || saved === 'dark') return saved;

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        const root = document.documentElement;
        if (themeMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme-preference', themeMode);
    }, [themeMode]);

    const fluentTheme = themeMode === 'light' ? customLightTheme : customDarkTheme;

    return (
        <ThemeContext.Provider value={{ themeMode, fluentTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
