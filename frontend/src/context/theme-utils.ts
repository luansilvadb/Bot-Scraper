/**
 * Theme utilities - separate file to satisfy Fast Refresh requirements
 */

export const ThemeMode = {
  Light: 'light',
  Dark: 'dark',
  Auto: 'auto',
} as const;

export type ThemeMode = typeof ThemeMode[keyof typeof ThemeMode];

export const STORAGE_KEY = 'theme-preference';

export function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'auto') {
    return getSystemPreference();
  }
  return mode;
}
