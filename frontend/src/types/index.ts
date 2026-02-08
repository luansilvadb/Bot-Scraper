/**
 * Shared Type Definitions
 */

export type { ThemeMode } from '../context/theme-utils';
export type { ThemeState, ThemeActions, ThemeContextValue } from './fluent-ui';
export type {
  PresenceState,
  AvatarSize,
  Breakpoint,
  BreakpointConfig,
  NavigationItem,
  NavigationSection,
  ListItem,
  UserPersonaProps,
} from './fluent-ui';
export { defaultBreakpoints } from './fluent-ui';

/**
 * Common API response types
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

/**
 * Common component props
 */
export interface CommonComponentProps {
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * Async operation states
 */
export type AsyncState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Pagination types
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
