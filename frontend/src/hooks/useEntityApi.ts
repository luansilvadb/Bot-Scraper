import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { api } from '../lib/api';

export interface UseEntityApiOptions {
  endpoint: string;
  entityKey: string;
  queryKeys?: string[];
}

export interface UseEntityApiReturn<T, CreateDto = Omit<T, 'id'>, UpdateDto = Partial<T>> {
  useList: () => UseQueryResult<T[], Error>;
  useOne: (id: string) => UseQueryResult<T, Error>;
  useCreate: () => UseMutationResult<T, Error, CreateDto>;
  useUpdate: () => UseMutationResult<T, Error, { id: string; data: UpdateDto }>;
  useDelete: () => UseMutationResult<void, Error, string>;
}

export function useEntityApi<T extends Record<string, unknown>, CreateDto = Omit<T, 'id'>, UpdateDto = Partial<T>>(
  options: UseEntityApiOptions
): UseEntityApiReturn<T, CreateDto, UpdateDto> {
  const { endpoint, entityKey, queryKeys = [] } = options;
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
    queryClient.invalidateQueries({ queryKey: [entityKey] });
  };

  const useList = () =>
    useQuery<T[], Error>({
      queryKey: [entityKey, 'list'],
      queryFn: async () => {
        const response = await api.get(`${endpoint}`);
        return response.data as T[];
      },
    });

  const useOne = (id: string) =>
    useQuery<T, Error>({
      queryKey: [entityKey, 'one', id],
      queryFn: async () => {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data as T;
      },
      enabled: !!id,
    });

  const useCreate = () =>
    useMutation<T, Error, CreateDto>({
      mutationFn: async (data) => {
        const response = await api.post(endpoint, data);
        return response.data as T;
      },
      onSuccess: invalidateQueries,
    });

  const useUpdate = () =>
    useMutation<T, Error, { id: string; data: UpdateDto }>({
      mutationFn: async ({ id, data }) => {
        const response = await api.patch(`${endpoint}/${id}`, data);
        return response.data as T;
      },
      onSuccess: invalidateQueries,
    });

  const useDelete = () =>
    useMutation<void, Error, string>({
      mutationFn: async (id) => {
        await api.delete(`${endpoint}/${id}`);
      },
      onSuccess: invalidateQueries,
    });

  return {
    useList,
    useOne,
    useCreate,
    useUpdate,
    useDelete,
  };
}
