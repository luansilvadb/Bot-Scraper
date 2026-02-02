import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

// Types
export interface SystemSetting {
    key: string;
    value: string;
}

export interface SettingQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Query keys
export const settingKeys = {
    all: ['settings'] as const,
    lists: () => [...settingKeys.all, 'list'] as const,
    list: (params: SettingQueryParams) => [...settingKeys.lists(), params] as const,
    details: () => [...settingKeys.all, 'detail'] as const,
    detail: (key: string) => [...settingKeys.details(), key] as const,
};

// Hooks
export function useSettings(params: SettingQueryParams = {}) {
    return useQuery({
        queryKey: settingKeys.list(params),
        queryFn: async () => {
            const { data } = await api.get<PaginatedResponse<SystemSetting>>('/settings', { params });
            return data;
        },
    });
}

export function useSetting(key: string) {
    return useQuery({
        queryKey: settingKeys.detail(key),
        queryFn: async () => {
            const { data } = await api.get<SystemSetting>(`/settings/${key}`);
            return data;
        },
        enabled: !!key,
    });
}

export function useUpsertSetting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: SystemSetting) => {
            const { data } = await api.post<SystemSetting>('/settings', input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingKeys.all });
        },
    });
}

export function useDeleteSetting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (key: string) => {
            await api.delete(`/settings/${key}`);
            return key;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingKeys.all });
        },
    });
}
