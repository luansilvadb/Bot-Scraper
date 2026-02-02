import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { PaginationMeta } from '../../components/DataTable';

// Types
export interface Bot {
    id: string;
    name: string;
    targetUrl: string;
    affiliateTag: string;
    telegramToken: string;
    chatId: string;
    scheduleCron: string;
    status: 'ACTIVE' | 'PAUSED' | 'ERROR';
    createdAt: string;
}

export interface CreateBotInput {
    name: string;
    targetUrl: string;
    affiliateTag: string;
    telegramToken: string;
    chatId: string;
    scheduleCron: string;
    status?: 'ACTIVE' | 'PAUSED' | 'ERROR';
}

export interface UpdateBotInput {
    name?: string;
    targetUrl?: string;
    affiliateTag?: string;
    telegramToken?: string;
    chatId?: string;
    scheduleCron?: string;
    status?: 'ACTIVE' | 'PAUSED' | 'ERROR';
}

export interface BotQueryParams {
    page?: number;
    limit?: number;
    status?: 'ACTIVE' | 'PAUSED' | 'ERROR';
    search?: string;
}

interface PaginatedData<T> {
    data: T[];
    meta: PaginationMeta;
}

// Query Keys
export const botKeys = {
    all: ['bots'] as const,
    lists: () => [...botKeys.all, 'list'] as const,
    list: (params: BotQueryParams) => [...botKeys.lists(), params] as const,
    details: () => [...botKeys.all, 'detail'] as const,
    detail: (id: string) => [...botKeys.details(), id] as const,
};

// Hooks
export function useBots(params: BotQueryParams = {}) {
    return useQuery({
        queryKey: botKeys.list(params),
        queryFn: async () => {
            const { data } = await api.get<PaginatedData<Bot>>('/bots', { params });
            return data;
        },
    });
}

export function useBot(id: string) {
    return useQuery({
        queryKey: botKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<Bot>(`/bots/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useCreateBot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateBotInput) => {
            const { data } = await api.post<Bot>('/bots', input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: botKeys.lists() });
        },
    });
}

export function useUpdateBot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...input }: UpdateBotInput & { id: string }) => {
            const { data } = await api.patch<Bot>(`/bots/${id}`, input);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: botKeys.lists() });
            queryClient.setQueryData(botKeys.detail(data.id), data);
        },
    });
}

export function useDeleteBot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/bots/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: botKeys.lists() });
        },
    });
}

export function useTriggerBot() {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post(`/bots/${id}/trigger`);
            return data;
        },
    });
}
