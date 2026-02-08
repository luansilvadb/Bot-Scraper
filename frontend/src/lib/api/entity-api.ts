/**
 * Entity API Standardized CRUD Utilities
 * Standardized API operations for entity management
 */

import { api } from './api';
import type { Entity, PaginatedResponse, QueryParams } from '../types';

/**
 * Standard CRUD API client factory
 */
export function createEntityApi<T extends Entity>(endpoint: string) {
  return {
    /**
     * Get paginated list of entities
     */
    getList: async (params?: QueryParams): Promise<PaginatedResponse<T>> => {
      const response = await api.get(endpoint, { params });
      return response.data as PaginatedResponse<T>;
    },

    /**
     * Get all entities (non-paginated)
     */
    getAll: async (): Promise<T[]> => {
      const response = await api.get(endpoint);
      return response.data as T[];
    },

    /**
     * Get single entity by ID
     */
    getOne: async (id: string): Promise<T> => {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data as T;
    },

    /**
     * Create new entity
     */
    create: async <CreateDTO = Omit<T, 'id' | 'createdAt' | 'updatedAt'>>(
      data: CreateDTO
    ): Promise<T> => {
      const response = await api.post(endpoint, data);
      return response.data as T;
    },

    /**
     * Update existing entity
     */
    update: async (id: string, data: Partial<T>): Promise<T> => {
      const response = await api.patch(`${endpoint}/${id}`, data);
      return response.data as T;
    },

    /**
     * Delete entity
     */
    delete: async (id: string): Promise<void> => {
      await api.delete(`${endpoint}/${id}`);
    },
  };
}

/**
 * Query key generators for React Query
 */
export const createQueryKeys = (entityKey: string) => ({
  all: [entityKey] as const,
  lists: () => [...createQueryKeys(entityKey).all, 'list'] as const,
  list: (params: unknown) => [...createQueryKeys(entityKey).lists(), params] as const,
  details: () => [...createQueryKeys(entityKey).all, 'detail'] as const,
  detail: (id: string) => [...createQueryKeys(entityKey).details(), id] as const,
});

/**
 * Type guard for paginated response
 */
export function isPaginatedResponse<T>(
  data: unknown
): data is PaginatedResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    'total' in data &&
    'page' in data &&
    'pageSize' in data
  );
}
