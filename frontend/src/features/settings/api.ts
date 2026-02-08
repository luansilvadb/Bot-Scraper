/**
 * Settings API - Refactored to use useEntityApi
 */

import { useEntityApi } from '../../hooks/useEntityApi';
import type { Entity } from '../../types';

export interface SystemSetting extends Entity {
  key: string;
  value: string;
  name: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category?: string;
  isSecret?: boolean;
}

export interface SettingQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const settingKeys = {
  all: ['settings'] as const,
  lists: () => [...settingKeys.all, 'list'] as const,
  list: (params: SettingQueryParams) => [...settingKeys.lists(), params] as const,
  details: () => [...settingKeys.all, 'detail'] as const,
  detail: (key: string) => [...settingKeys.details(), key] as const,
};

/**
 * Hook for settings list with pagination
 */
export function useSettings(params: SettingQueryParams = {}) {
  return useEntityApi<SystemSetting>({
    endpoint: '/settings',
    queryKey: settingKeys.all,
    pagination: { pageSize: params.pageSize || 20, enabled: true },
  });
}

/**
 * Hook for single setting
 */
export function useSetting(key: string) {
  const api = useEntityApi<SystemSetting>({
    endpoint: '/settings',
    queryKey: settingKeys.all,
    enabled: !!key,
  });
  return api.useOne(key);
}

/**
 * Hook for upsert setting (create or update)
 */
export function useUpsertSetting() {
  const { create, update } = useEntityApi<SystemSetting>({
    endpoint: '/settings',
    queryKey: settingKeys.all,
  });

  return {
    mutate: async (input: SystemSetting) => {
      // Settings use key as identifier, try update first, then create
      try {
        await update.mutateAsync({ id: input.key, data: input });
      } catch {
        await create.mutateAsync(input);
      }
    },
    isPending: create.isPending || update.isPending,
    isSuccess: create.isSuccess || update.isSuccess,
    isError: create.isError || update.isError,
    error: create.error || update.error,
    reset: () => {
      create.reset();
      update.reset();
    },
  };
}

/**
 * Hook for delete setting
 */
export function useDeleteSetting() {
  const { remove } = useEntityApi<SystemSetting>({
    endpoint: '/settings',
    queryKey: settingKeys.all,
  });
  return remove;
}
