/**
 * Shared Type Definitions
 */

// Core types
export * from './entities';
export * from './form';
export * from './api';

// Fluent UI extensions
export * from './fluent-ui';
export type { ThemeMode } from '../context/theme-utils';

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
export type AsyncOperationState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Pagination types (legacy - use from './api')
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

