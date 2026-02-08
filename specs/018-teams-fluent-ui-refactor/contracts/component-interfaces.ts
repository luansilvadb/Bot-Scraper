/**
 * Component Interface Contracts
 * Feature: Teams-Style UI Refactor with Fluent UI v9
 * Branch: 018-teams-fluent-ui-refactor
 * 
 * These interfaces define the contracts between UI components.
 * All components must adhere to strict TypeScript typing per CQ-001.
 */

import type { ReactNode } from 'react';

// ============================================================================
// CORE LAYOUT INTERFACES
// ============================================================================

/**
 * AppShellProps - Main layout container
 * Implements FR-001: Three-column layout (App Bar, List Pane, Main Stage)
 */
export interface AppShellProps {
  /** Left navigation rail component */
  appBar: ReactNode;
  /** Center list pane component */
  listPane: ReactNode;
  /** Right main content area */
  mainStage: ReactNode;
  /** Optional header above main stage */
  header?: ReactNode;
  /** Current breakpoint for responsive behavior */
  breakpoint: Breakpoint;
  /** Loading state for initial shell render */
  isLoading?: boolean;
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * AppBarProps - Left navigation rail
 * Implements FR-001, FR-009: Navigation rail with responsive collapse
 */
export interface AppBarProps {
  /** Navigation items to display */
  items: NavigationItem[];
  /** Currently active item ID */
  activeItemId: string | null;
  /** Callback when item is selected */
  onItemSelect: (itemId: string) => void;
  /** Current breakpoint (affects collapse behavior) */
  breakpoint: Breakpoint;
  /** Whether to show labels (desktop) or icons only (tablet) */
  showLabels: boolean;
  /** Current theme mode */
  theme: ThemeMode;
}

export interface NavigationItem {
  /** Unique identifier */
  id: string;
  /** Fluent UI icon name */
  icon: string;
  /** Display label */
  label: string;
  /** Route path for navigation */
  path: string;
  /** Whether this item is currently active */
  isActive: boolean;
  /** Display order (for sorting) */
  order: number;
  /** Optional notification badge */
  badge?: {
    count: number;
    type: 'notification' | 'mention' | 'alert';
  };
  /** Disabled state */
  disabled?: boolean;
  /** Tooltip text for icon-only mode */
  tooltip?: string;
}

/**
 * ListPaneProps - Center panel for contacts/channels
 * Implements FR-016: Virtualization for lists >100 items
 */
export interface ListPaneProps<T extends Identifiable> {
  /** Items to display in the list */
  items: T[];
  /** Currently selected item ID */
  selectedId: string | null;
  /** Callback when item is selected */
  onSelect: (itemId: string) => void;
  /** Filter text for search */
  filterText?: string;
  /** Loading state */
  isLoading: boolean;
  /** Whether to use virtualization (>100 items) */
  isVirtualized: boolean;
  /** Render function for list items */
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  /** Empty state component */
  emptyState?: ReactNode;
  /** Current breakpoint */
  breakpoint: Breakpoint;
}

/**
 * MainStageProps - Right content area
 * Primary display area for active content
 */
export interface MainStageProps {
  /** Page/section title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Main content */
  children: ReactNode;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Action buttons in header */
  actions?: ActionButton[];
  /** Optional header content above title */
  headerContent?: ReactNode;
}

export interface ActionButton {
  id: string;
  icon: string;
  label: string;
  onClick: () => void;
  appearance?: 'primary' | 'secondary' | 'subtle';
  disabled?: boolean;
}

// ============================================================================
// IDENTITY COMPONENTS
// ============================================================================

/**
 * UserPersonaProps - User display component
 * Implements FR-003: Avatar with PresenceBadge
 * Implements FR-004: Persona component
 * Implements FR-015: Avatar fallback with initials
 */
export interface UserPersonaProps {
  /** User data */
  user: User;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show presence badge */
  showPresence?: boolean;
  /** Whether to show secondary text (email) */
  showSecondaryText?: boolean;
  /** Click handler */
  onClick?: (user: User) => void;
  /** Additional CSS classes */
  className?: string;
}

export interface User {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Email address */
  email: string;
  /** Avatar photo URL (optional) */
  avatarUrl?: string;
  /** Online presence status */
  status: PresenceStatus;
  /** Job title/role */
  role?: string;
  /** Computed: initials for fallback avatar */
  initials: string;
  /** Computed: deterministic color index (0-11) */
  colorId: number;
}

export type PresenceStatus = 
  | 'available' 
  | 'busy' 
  | 'away' 
  | 'offline' 
  | 'do-not-disturb'
  | 'unknown';

/**
 * ChannelListItemProps - Channel/group display
 */
export interface ChannelListItemProps {
  channel: Channel;
  isSelected: boolean;
  isMuted: boolean;
  onSelect: (channelId: string) => void;
  onMuteToggle: (channelId: string) => void;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount: number;
  lastActivity: Date;
  unreadCount: number;
  isMuted: boolean;
  type: 'public' | 'private' | 'direct';
}

// ============================================================================
// THEME INTERFACES
// ============================================================================

/**
 * ThemeProviderProps - Theme context provider
 * Implements FR-014: Light/dark/auto theme support
 */
export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme mode */
  defaultMode?: ThemeMode;
  /** Storage key for persistence */
  storageKey?: string;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeContextValue {
  /** Current mode setting */
  mode: ThemeMode;
  /** Resolved theme (auto resolves to light/dark) */
  resolvedTheme: 'light' | 'dark';
  /** Whether currently in dark mode */
  isDark: boolean;
  /** Fluent UI theme object */
  fluentTheme: unknown; // Fluent UI Theme type
  /** Set theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light/dark/auto */
  toggleTheme: () => void;
}

// ============================================================================
// UTILITY INTERFACES
// ============================================================================

/**
 * VirtualizedListProps - Generic virtualized list
 * Implements FR-016: Virtualization for large lists
 */
export interface VirtualizedListProps<T extends Identifiable> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => ReactNode;
  onItemClick?: (item: T) => void;
  overscan?: number;
  className?: string;
}

export interface Identifiable {
  id: string;
}

/**
 * SkeletonProps - Loading skeleton component
 * Implements FR-018: Skeleton screens for loading states
 */
export interface SkeletonProps {
  /** Number of skeleton rows */
  rows?: number;
  /** Whether to show avatar skeleton */
  showAvatar?: boolean;
  /** Whether to show text skeleton */
  showText?: boolean;
  /** Row height in pixels */
  rowHeight?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ErrorBoundaryProps - Error handling wrapper
 * Implements FR-019: Error handling with retry
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Fallback component for errors */
  fallback?: ReactNode;
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: unknown) => void;
}

export interface ErrorStateProps {
  error: Error;
  /** Whether error is retryable */
  isRetryable: boolean;
  /** Retry handler */
  onRetry: () => void;
  /** Dismiss handler */
  onDismiss?: () => void;
}

/**
 * EmptyStateProps - Empty list display
 * Implements FR-022: Empty states with CTA
 */
export interface EmptyStateProps {
  /** Fluent UI icon name */
  icon: string;
  /** Title text */
  title: string;
  /** Description message */
  description?: string;
  /** Call-to-action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// FORM COMPONENT INTERFACES
// ============================================================================

/**
 * SearchInputProps - Fluent UI search input
 * Implements FR-008: Input component replacement
 */
export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Loading state (show spinner) */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Clear button handler */
  onClear?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FormFieldProps - Form field wrapper
 * Implements UX-002: User-friendly error messages
 */
export interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

// ============================================================================
// ACCESSIBILITY INTERFACES
// ============================================================================

/**
 * KeyboardNavigationProps - A11y navigation support
 * Implements FR-010: Keyboard navigation pattern
 */
export interface KeyboardNavigationProps {
  /** ARIA role for the container */
  role: 'list' | 'menu' | 'tablist' | 'toolbar';
  /** Current focus index */
  focusedIndex: number;
  /** Total number of navigable items */
  itemCount: number;
  /** Callback when focus changes */
  onFocusChange: (index: number) => void;
  /** Callback when item is activated (Enter/Space) */
  onActivate: (index: number) => void;
  /** Whether navigation is circular (wraps around) */
  circular?: boolean;
  /** Orientation for arrow key navigation */
  orientation?: 'horizontal' | 'vertical';
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for User interface
 */
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj &&
    'initials' in obj
  );
}

/**
 * Type guard for Channel interface
 */
export function isChannel(obj: unknown): obj is Channel {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'memberCount' in obj &&
    'lastActivity' in obj
  );
}

/**
 * Type guard for NavigationItem interface
 */
export function isNavigationItem(obj: unknown): obj is NavigationItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'icon' in obj &&
    'label' in obj &&
    'path' in obj
  );
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Breakpoints per FR-009 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

/** Virtualization threshold per FR-016 */
export const VIRTUALIZATION_THRESHOLD = 100;

/** Avatar color count per FR-015 */
export const AVATAR_COLOR_COUNT = 12;

/** Bundle size limit per FR-020 */
export const MAX_BUNDLE_SIZE_KB = 500;

/** Performance budget per SC-004 */
export const MAX_LOAD_TIME_MS = 200;

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  // Re-export all interfaces for convenience
  AppShellProps,
  AppBarProps,
  ListPaneProps,
  MainStageProps,
  UserPersonaProps,
  User,
  Channel,
  ChannelListItemProps,
  NavigationItem,
  ThemeProviderProps,
  ThemeContextValue,
  VirtualizedListProps,
  SkeletonProps,
  ErrorBoundaryProps,
  ErrorStateProps,
  EmptyStateProps,
  SearchInputProps,
  FormFieldProps,
  KeyboardNavigationProps,
  ActionButton,
  PresenceStatus,
  ThemeMode,
  Breakpoint,
  Identifiable,
};
