import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Entity, PaginatedResponse, QueryParams } from '../types';

export interface UseEntityApiOptions<T extends Entity> {
  endpoint: string;
  queryKey: string[];
  enabled?: boolean;
  staleTime?: number;
  pagination?: {
    pageSize: number;
    enabled: boolean;
  };
}

export interface UseEntityApiReturn<T extends Entity, CreateDTO = Omit<T, 'id' | 'createdAt' | 'updatedAt'>> {
  // Query State
  data: T[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  // Single Entity Query
  useOne: (id: string) => {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
  };

  // Mutations
  create: UseMutationResult<T, Error, CreateDTO>;
  update: UseMutationResult<T, Error, { id: string; data: Partial<T> }>;
  remove: UseMutationResult<void, Error, string>;

  // Pagination (if enabled)
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function useEntityApi<T extends Entity, CreateDTO = Omit<T, 'id' | 'createdAt' | 'updatedAt'>>(
  options: UseEntityApiOptions<T>
): UseEntityApiReturn<T, CreateDTO> {
  const { endpoint, queryKey, enabled = true, staleTime = 30000, pagination: paginationConfig } = options;
  const queryClient = useQueryClient();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(paginationConfig?.pageSize || 10);

  // Build query params
  const queryParams: QueryParams = paginationConfig?.enabled
    ? { page, pageSize }
    : {};

  // List query
  const listQuery = useQuery({
    queryKey: [...queryKey, 'list', queryParams],
    queryFn: async () => {
      const response = await api.get(endpoint, { params: queryParams });
      return response.data as PaginatedResponse<T> | T[];
    },
    enabled,
    staleTime,
    placeholderData: keepPreviousData,
  });

  // Extract data based on response type
  const responseData = listQuery.data;
  const isPaginated = responseData && 'data' in responseData && 'total' in responseData;
  const data = isPaginated ? (responseData as PaginatedResponse<T>).data : (responseData as T[] | null);
  const total = isPaginated ? (responseData as PaginatedResponse<T>).total : 0;
  const totalPages = Math.ceil(total / pageSize);

  // Single entity hook
  const useOne = (id: string) => {
    const query = useQuery({
      queryKey: [...queryKey, 'one', id],
      queryFn: async () => {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data as T;
      },
      enabled: !!id && enabled,
      staleTime,
    });

    return {
      data: query.data || null,
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error,
      refetch: query.refetch,
    };
  };

  // Create mutation
  const create = useMutation<T, Error, CreateDTO>({
    mutationFn: async (newData) => {
      const response = await api.post(endpoint, newData);
      return response.data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Update mutation
  const update = useMutation<T, Error, { id: string; data: Partial<T> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`${endpoint}/${id}`, data);
      return response.data as T;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, 'one', variables.id] });
    },
  });

  // Delete mutation
  const remove = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`${endpoint}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Build return object
  const result: UseEntityApiReturn<T, CreateDTO> = {
    data: data || null,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
    useOne,
    create,
    update,
    remove,
  };

  // Add pagination if enabled
  if (paginationConfig?.enabled) {
    result.pagination = {
      page,
      pageSize,
      total,
      totalPages,
      setPage,
      setPageSize,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  return result;
}
