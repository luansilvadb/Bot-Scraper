/**
 * Workers API - Refactored to use useEntityApi
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEntityApi } from '../../hooks/useEntityApi';
import { api } from '../../lib/api';
import type { Entity } from '../../types';

export interface NetworkInfo {
  externalIp: string;
  ispName: string;
  lastCheckedAt: string;
}

export interface WorkerStats {
  tasksCompleted: number;
  tasksFailed: number;
  uptime: number;
}

export interface LocalWorker extends Entity {
  name: string;
  description?: string;
  token: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'BLOCKED';
  lastSeenAt: string;
  registeredAt: string;
  networkInfo?: NetworkInfo;
  stats: WorkerStats;
}

export interface RegisterWorkerInput {
  name: string;
}

export interface WorkerQueryParams {
  status?: 'CONNECTED' | 'DISCONNECTED' | 'BLOCKED';
  page?: number;
  pageSize?: number;
}

export interface RegenerateTokenResponse {
  token: string;
  regeneratedAt: string;
}

export interface GetTokenResponse {
  token: string;
}

export interface ScrapingTask {
  id: string;
  targetUrl: string;
  priority: number;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  attempts: number;
  workerId?: string;
  workerName?: string;
}

export const workerKeys = {
  all: ['workers'] as const,
  lists: () => [...workerKeys.all, 'list'] as const,
  list: (params: WorkerQueryParams) => [...workerKeys.lists(), params] as const,
  details: () => [...workerKeys.all, 'detail'] as const,
  detail: (id: string) => [...workerKeys.details(), id] as const,
};

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
};

/**
 * Hook for workers list
 */
export function useWorkers(params: WorkerQueryParams = {}) {
  return useEntityApi<LocalWorker, RegisterWorkerInput>({
    endpoint: '/api/workers',
    queryKey: workerKeys.all,
    pagination: { pageSize: params.pageSize || 20, enabled: false }, // Workers doesn't support pagination yet
  });
}

/**
 * Hook for single worker
 */
export function useWorker(id: string) {
  const api = useEntityApi<LocalWorker, RegisterWorkerInput>({
    endpoint: '/api/workers',
    queryKey: workerKeys.all,
    enabled: !!id,
  });
  return api.useOne(id);
}

/**
 * Hook for register worker
 */
export function useRegisterWorker() {
  const { create } = useEntityApi<LocalWorker, RegisterWorkerInput>({
    endpoint: '/api/workers',
    queryKey: workerKeys.all,
  });
  return create;
}

/**
 * Hook for delete worker
 */
export function useDeleteWorker() {
  const { remove } = useEntityApi<LocalWorker, RegisterWorkerInput>({
    endpoint: '/api/workers',
    queryKey: workerKeys.all,
  });
  return remove;
}

/**
 * Hook for regenerate token
 */
export function useRegenerateToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<RegenerateTokenResponse>(`/api/workers/${id}/regenerate-token`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.all });
    },
  });
}

/**
 * Hook for get worker token
 */
export function useGetWorkerToken(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: [...workerKeys.detail(id), 'token'] as const,
    queryFn: async () => {
      const { data } = await api.get<GetTokenResponse>(`/api/workers/${id}/token`);
      return data;
    },
    enabled: options.enabled ?? true,
    staleTime: 0,
    gcTime: 0,
  });
}

/**
 * Hook for tasks
 */
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: async () => {
      const { data } = await api.get('/api/tasks');
      const items = data?.items || [];
      return items.map((task: Record<string, unknown>): ScrapingTask => ({
        id: task.id as string,
        targetUrl: task.productUrl as string,
        priority: task.priority as number,
        status: task.status === 'IN_PROGRESS' ? 'IN_PROGRESS' :
                task.status === 'PENDING' ? 'PENDING' :
                task.status === 'COMPLETED' ? 'COMPLETED' :
                task.status === 'FAILED' ? 'FAILED' :
                task.status === 'PERMANENTLY_FAILED' ? 'FAILED' : 'PENDING',
        createdAt: task.createdAt as string,
        attempts: task.attemptCount as number,
        workerId: task.assignedWorkerId as string | undefined,
        workerName: (task.assignedWorker as Record<string, string> | undefined)?.name,
      }));
    },
    refetchInterval: 3000,
  });
}
