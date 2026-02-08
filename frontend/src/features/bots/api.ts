/**
 * Bots API - Refactored to use useEntityApi
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEntityApi } from '../../hooks/useEntityApi';
import { api } from '../../lib/api';
import type { Entity } from '../../types';

export interface Bot extends Entity {
  name: string;
  targetUrl: string;
  affiliateTag: string;
  telegramToken: string;
  chatId: string;
  scheduleCron: string;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
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
  pageSize?: number;
  status?: 'ACTIVE' | 'PAUSED' | 'ERROR';
  search?: string;
}

export const botKeys = {
  all: ['bots'] as const,
  lists: () => [...botKeys.all, 'list'] as const,
  list: (params: BotQueryParams) => [...botKeys.lists(), params] as const,
  details: () => [...botKeys.all, 'detail'] as const,
  detail: (id: string) => [...botKeys.details(), id] as const,
};

/**
 * Hook for bots list with pagination
 */
export function useBots(params: BotQueryParams = {}) {
  return useEntityApi<Bot, CreateBotInput>({
    endpoint: '/bots',
    queryKey: botKeys.all,
    pagination: { pageSize: params.pageSize || 10, enabled: true },
  });
}

/**
 * Hook for single bot
 */
export function useBot(id: string) {
  const api = useEntityApi<Bot, CreateBotInput>({
    endpoint: '/bots',
    queryKey: botKeys.all,
    enabled: !!id,
  });
  return api.useOne(id);
}

/**
 * Hook for create bot
 */
export function useCreateBot() {
  const { create } = useEntityApi<Bot, CreateBotInput>({
    endpoint: '/bots',
    queryKey: botKeys.all,
  });
  return create;
}

/**
 * Hook for update bot
 */
export function useUpdateBot() {
  const { update } = useEntityApi<Bot, CreateBotInput>({
    endpoint: '/bots',
    queryKey: botKeys.all,
  });
  return update;
}

/**
 * Hook for delete bot
 */
export function useDeleteBot() {
  const { remove } = useEntityApi<Bot, CreateBotInput>({
    endpoint: '/bots',
    queryKey: botKeys.all,
  });
  return remove;
}

/**
 * Hook for trigger bot (custom action not covered by CRUD)
 */
export function useTriggerBot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/bots/${id}/trigger`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: botKeys.all });
    },
  });
}
