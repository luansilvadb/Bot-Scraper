import { webLightTheme, webDarkTheme } from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';

export const customLightTheme: Theme = {
    ...webLightTheme,
    fontFamilyBase: 'var(--font-sans)',
    borderRadiusMedium: 'var(--radius)',

    // Brand Colors
    colorBrandBackground: 'var(--primary)',
    colorBrandBackgroundHover: 'var(--primary)', // Hover usually needs a slight shade, but sticking to system for now
    colorBrandBackgroundPressed: 'var(--primary)',
    colorBrandForeground1: 'var(--primary)',

    // Neutral Colors (Backgrounds)
    colorNeutralBackground1: 'var(--background)',
    colorNeutralBackground2: 'var(--card)',
    colorNeutralBackground3: 'var(--popover)',
    colorNeutralBackground4: 'var(--input)',

    // Neutral Colors (Foregrounds)
    colorNeutralForeground1: 'var(--foreground)',
    colorNeutralForeground2: 'var(--muted-foreground)',

    // Borders
    colorNeutralStroke1: 'var(--border)',
    colorNeutralStroke2: 'var(--sidebar-border)',

    // Shadows
    shadow4: 'var(--shadow-sm)',
    shadow8: 'var(--shadow)',
    shadow16: 'var(--shadow-md)',
    shadow28: 'var(--shadow-lg)',
    shadow64: 'var(--shadow-xl)',
};

export const customDarkTheme: Theme = {
    ...webDarkTheme,
    fontFamilyBase: 'var(--font-sans)',
    borderRadiusMedium: 'var(--radius)',

    // Brand Colors
    colorBrandBackground: 'var(--primary)',
    colorBrandBackgroundHover: 'var(--primary)',
    colorBrandBackgroundPressed: 'var(--primary)',
    colorBrandForeground1: 'var(--primary)',

    // Neutral Colors (Backgrounds)
    colorNeutralBackground1: 'var(--background)',
    colorNeutralBackground2: 'var(--card)',
    colorNeutralBackground3: 'var(--popover)',
    colorNeutralBackground4: 'var(--input)',

    // Neutral Colors (Foregrounds)
    colorNeutralForeground1: 'var(--foreground)',
    colorNeutralForeground2: 'var(--muted-foreground)',

    // Borders
    colorNeutralStroke1: 'var(--border)',
    colorNeutralStroke2: 'var(--sidebar-border)',

    // Shadows
    shadow4: 'var(--shadow-sm)',
    shadow8: 'var(--shadow)',
    shadow16: 'var(--shadow-md)',
    shadow28: 'var(--shadow-lg)',
    shadow64: 'var(--shadow-xl)',
};
