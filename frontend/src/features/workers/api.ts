import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

// Types
export interface NetworkInfo {
    externalIp: string;
    ispName: string;
    lastCheckedAt: string;
}

export interface WorkerStats {
    tasksCompleted: number;
    tasksFailed: number;
    uptime: number; // in seconds
}

export interface LocalWorker {
    id: string;
    name: string;
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
}

// Query Keys
export const workerKeys = {
    all: ['workers'] as const,
    lists: () => [...workerKeys.all, 'list'] as const,
    list: (params: WorkerQueryParams) => [...workerKeys.lists(), params] as const,
    details: () => [...workerKeys.all, 'detail'] as const,
    detail: (id: string) => [...workerKeys.details(), id] as const,
};

// Hooks
export function useWorkers(params: WorkerQueryParams = {}) {
    return useQuery({
        queryKey: workerKeys.list(params),
        queryFn: async () => {
            const { data } = await api.get<LocalWorker[]>('/api/workers', { params });
            // The backend returns an array directly, not PaginatedData for this endpoint yet
            return data;
        },
        refetchInterval: 5000, // Poll every 5s for real-time updates (fallback for WebSocket)
    });
}

export function useWorker(id: string) {
    return useQuery({
        queryKey: workerKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<LocalWorker>(`/api/workers/${id}`);
            return data;
        },
        enabled: !!id,
        refetchInterval: 5000,
    });
}

export function useRegisterWorker() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: RegisterWorkerInput) => {
            const { data } = await api.post<LocalWorker>('/api/workers', input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workerKeys.lists() });
        },
    });
}

export function useDeleteWorker() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/workers/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workerKeys.lists() });
        },
    });
}

// Tasks
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

export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
};

export function useTasks() {
    return useQuery({
        queryKey: taskKeys.lists(),
        queryFn: async () => {
            const { data } = await api.get<{ data: ScrapingTask[], meta: any }>('/api/tasks');
            // TasksController usually returns standard paginated response { data, meta }
            return data.data || [];
        },
        refetchInterval: 3000,
    });
}

