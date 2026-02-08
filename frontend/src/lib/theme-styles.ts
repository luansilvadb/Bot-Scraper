/**
 * Theme-aware style utilities
 * Provides consistent styling patterns across the application
 */

import { tokens } from '@fluentui/react-components';

/**
 * Teams Purple color values
 * Primary brand color for Microsoft Teams
 */
export const TEAMS_COLORS = {
  purple: '#6264A7',
  purpleDark: '#4B4C7F',
  purpleLight: '#8E8FBD',
  purpleLighter: '#B9B9D3',
} as const;

/**
 * Breakpoint values matching the responsive design
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1920,
} as const;

/**
 * Layout dimensions
 */
export const LAYOUT = {
  appBar: {
    desktop: 68,
    tablet: 48,
  },
  listPane: {
    desktop: 280,
    tablet: 240,
  },
} as const;

/**
 * Get theme-aware shadow styles
 * Returns appropriate shadow based on theme mode
 */
export const getShadow = (level: 'sm' | 'md' | 'lg' | 'xl'): string => {
  const shadows = {
    sm: tokens.shadow4,
    md: tokens.shadow8,
    lg: tokens.shadow16,
    xl: tokens.shadow28,
  };
  return shadows[level] || tokens.shadow8;
};

/**
 * Get spacing value from Fluent UI tokens
 */
export const getSpacing = (size: 'xs' | 's' | 'm' | 'l' | 'xl'): string => {
  const spacingMap = {
    xs: tokens.spacingHorizontalXS,
    s: tokens.spacingHorizontalS,
    m: tokens.spacingHorizontalM,
    l: tokens.spacingHorizontalL,
    xl: tokens.spacingHorizontalXL,
  };
  return spacingMap[size] || tokens.spacingHorizontalM;
};

/**
 * Get border radius from Fluent UI tokens
 */
export const getBorderRadius = (size: 'sm' | 'md' | 'lg'): string => {
  const radiusMap = {
    sm: tokens.borderRadiusSmall,
    md: tokens.borderRadiusMedium,
    lg: tokens.borderRadiusLarge,
  };
  return radiusMap[size] || tokens.borderRadiusMedium;
};

/**
 * Typography scale
 */
export const typography = {
  caption: {
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase100,
    fontWeight: tokens.fontWeightRegular,
  },
  body: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    fontWeight: tokens.fontWeightRegular,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    lineHeight: tokens.lineHeightBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  headline: {
    fontSize: tokens.fontSizeHero700,
    lineHeight: tokens.lineHeightHero700,
    fontWeight: tokens.fontWeightBold,
  },
} as const;

/**
 * Animation durations
 */
export const animation = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
} as const;

/**
 * Common transition pattern
 */
export const transition = (
  property: string = 'all',
  duration: 'fast' | 'normal' | 'slow' = 'normal'
): string => {
  const durations = {
    fast: animation.fast,
    normal: animation.normal,
    slow: animation.slow,
  };
  return `${property} ${durations[duration]} cubic-bezier(0.4, 0, 0.2, 1)`;
};

/**
 * Focus ring style for accessibility
 */
export const focusRing = {
  outline: `2px solid ${tokens.colorBrandStroke1}`,
  outlineOffset: '2px',
};

/**
 * Truncate text with ellipsis
 */
export const truncate = {
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
};

/**
 * Visually hidden but accessible to screen readers
 */
export const visuallyHidden = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden' as const,
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  border: '0',
};

/**
 * Responsive breakpoint helpers
 */
export const mediaQuery = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile - 1}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.tablet}px)`,
  wide: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
};

/**
 * Layout grid template for AppShell
 */
export const gridTemplate = {
  desktop: `${LAYOUT.appBar.desktop}px ${LAYOUT.listPane.desktop}px 1fr`,
  tablet: `${LAYOUT.appBar.tablet}px ${LAYOUT.listPane.tablet}px 1fr`,
  mobile: '1fr',
};
