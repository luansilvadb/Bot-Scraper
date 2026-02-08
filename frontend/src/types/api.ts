/**
 * API Types
 * Types for API responses and async operations
 */

/**
 * Standard API response
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Query parameters for list endpoints
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

/**
 * Async operation state
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Mutation operation state
 */
export interface MutationState {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Legacy API error type (for backward compatibility)
 * @deprecated Use ApiError from './index' instead
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
}
