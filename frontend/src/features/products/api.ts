import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

// Types
export interface Product {
    id: string;
    asin: string;
    title: string;
    currentPrice: number;
    originalPrice: number;
    discountPercentage: number;
    imageUrl: string;
    productUrl: string;
    status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'POSTED';
    botId: string | null;
    bot?: {
        id: string;
        name: string;
    } | null;
    foundAt: string;
    expiresAt: string | null;
}

export interface CreateProductInput {
    asin: string;
    title: string;
    currentPrice: number;
    originalPrice: number;
    discountPercentage: number;
    imageUrl: string;
    productUrl: string;
    botId?: string;
    expiresAt?: string;
}

export interface UpdateProductInput {
    title?: string;
    currentPrice?: number;
    originalPrice?: number;
    discountPercentage?: number;
    imageUrl?: string;
    productUrl?: string;
    status?: Product['status'];
    expiresAt?: string | null;
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    status?: Product['status'];
    botId?: string;
    minDiscount?: number;
    search?: string;
}

export interface BulkResult {
    updated: number;
    skipped: number;
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
export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
    pending: () => [...productKeys.all, 'pending'] as const,
};

// Hooks
export function useProducts(params: ProductQueryParams = {}) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: async () => {
            const { data } = await api.get<PaginatedResponse<Product>>('/products', { params });
            return data;
        },
    });
}

export function usePendingProducts() {
    return useQuery({
        queryKey: productKeys.pending(),
        queryFn: async () => {
            const { data } = await api.get<Product[]>('/products/pending');
            return data;
        },
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<Product>(`/products/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateProductInput) => {
            const { data } = await api.post<Product>('/products', input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...input }: UpdateProductInput & { id: string }) => {
            const { data } = await api.patch<Product>(`/products/${id}`, input);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: productKeys.pending() });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/products/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.pending() });
        },
    });
}

export function useApproveProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post<Product>(`/products/${id}/approve`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.pending() });
        },
    });
}

export function useRejectProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post<Product>(`/products/${id}/reject`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.pending() });
        },
    });
}

export function useBulkApprove() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: string[]) => {
            const { data } = await api.post<BulkResult>('/products/bulk/approve', { ids });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}

export function useBulkReject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: string[]) => {
            const { data } = await api.post<BulkResult>('/products/bulk/reject', { ids });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
}
