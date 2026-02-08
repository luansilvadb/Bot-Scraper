/**
 * Fluent UI Type Definitions
 * Types for Teams-style UI components
 */

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * User presence states
 */
export type PresenceState = 'available' | 'away' | 'busy' | 'offline' | 'dnd' | 'out-of-office' | 'unknown';

/**
 * Avatar size options
 */
export type AvatarSize = 'tiny' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Responsive breakpoint types
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

/**
 * Breakpoint configuration
 */
export interface BreakpointConfig {
  mobile: number;   // < 768px
  tablet: number;   // 768px - 1023px
  desktop: number;  // 1024px - 1919px
  wide: number;     // >= 1920px
}

/**
 * Default breakpoint values (in pixels)
 */
export const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1920,
  wide: 1920,
};

/**
 * Navigation item for AppBar
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; filled?: boolean }>;
  to: string;
  badge?: number;
  description?: string;
  disabled?: boolean;
}

/**
 * Navigation section grouping
 */
export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

/**
 * List item for ListPane
 */
export interface ListItem {
  id: string;
  primaryText: string;
  secondaryText?: string;
  avatarUrl?: string;
  presence?: PresenceState;
  timestamp?: Date;
  unreadCount?: number;
  isPinned?: boolean;
  disabled?: boolean;
}

/**
 * User persona properties
 */
export interface UserPersonaProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  presence?: PresenceState;
  size?: AvatarSize;
  showPresence?: boolean;
}

/**
 * Theme context state
 */
export interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  systemPreference: 'light' | 'dark';
}

/**
 * Theme context actions
 */
export interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

/**
 * Complete theme context value
 */
export type ThemeContextValue = ThemeState & ThemeActions;
