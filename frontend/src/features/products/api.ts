/**
 * Products API - Refactored to use useEntityApi
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEntityApi } from '../../hooks/useEntityApi';
import { api } from '../../lib/api';
import type { Entity } from '../../types';

export interface Product extends Entity {
  name: string;
  description?: string;
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
  pageSize?: number;
  status?: Product['status'];
  botId?: string;
  minDiscount?: number;
  search?: string;
}

export interface BulkResult {
  updated: number;
  skipped: number;
}

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  pending: () => [...productKeys.all, 'pending'] as const,
};

/**
 * Hook for products list with pagination
 */
export function useProducts(params: ProductQueryParams = {}) {
  return useEntityApi<Product, CreateProductInput>({
    endpoint: '/products',
    queryKey: productKeys.all,
    pagination: { pageSize: params.pageSize || 20, enabled: true },
  });
}

/**
 * Hook for pending products
 */
export function usePendingProducts() {
  return useQuery({
    queryKey: productKeys.pending(),
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/products/pending');
      return data;
    },
  });
}

/**
 * Hook for single product
 */
export function useProduct(id: string) {
  const api = useEntityApi<Product, CreateProductInput>({
    endpoint: '/products',
    queryKey: productKeys.all,
    enabled: !!id,
  });
  return api.useOne(id);
}

/**
 * Hook for create product
 */
export function useCreateProduct() {
  const { create } = useEntityApi<Product, CreateProductInput>({
    endpoint: '/products',
    queryKey: productKeys.all,
  });
  return create;
}

/**
 * Hook for update product
 */
export function useUpdateProduct() {
  const { update } = useEntityApi<Product, CreateProductInput>({
    endpoint: '/products',
    queryKey: productKeys.all,
  });
  return update;
}

/**
 * Hook for delete product
 */
export function useDeleteProduct() {
  const { remove } = useEntityApi<Product, CreateProductInput>({
    endpoint: '/products',
    queryKey: productKeys.all,
  });
  return remove;
}

/**
 * Hook for approve product
 */
export function useApproveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<Product>(`/products/${id}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

/**
 * Hook for reject product
 */
export function useRejectProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<Product>(`/products/${id}/reject`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

/**
 * Hook for bulk approve
 */
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

/**
 * Hook for bulk reject
 */
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
