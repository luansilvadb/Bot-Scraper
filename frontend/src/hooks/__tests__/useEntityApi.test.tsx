import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEntityApi } from '../useEntityApi';
import { api } from '../../lib/api';
import { ReactNode } from 'react';

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

interface TestEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

describe('useEntityApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return query state and mutations', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useEntityApi<TestEntity>({
        endpoint: '/api/test',
        queryKey: ['test'],
      }),
      { wrapper }
    );

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.create).toBeDefined();
    expect(result.current.update).toBeDefined();
    expect(result.current.remove).toBeDefined();
    expect(result.current.useOne).toBeDefined();
  });

  it('should fetch list', async () => {
    const mockData = [{ id: '1', name: 'Test', createdAt: new Date(), updatedAt: new Date() }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useEntityApi<TestEntity>({
        endpoint: '/api/test',
        queryKey: ['test'],
      }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith('/api/test', { params: {} });
  });

  it('should create entity', async () => {
    const mockData = { id: '1', name: 'Test', createdAt: new Date(), updatedAt: new Date() };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockData });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useEntityApi<TestEntity>({
        endpoint: '/api/test',
        queryKey: ['test'],
      }),
      { wrapper }
    );

    result.current.create.mutate({ name: 'Test' } as Omit<TestEntity, 'id' | 'createdAt' | 'updatedAt'>);

    await waitFor(() => expect(result.current.create.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith('/api/test', { name: 'Test' });
  });

  it('should update entity', async () => {
    const mockData = { id: '1', name: 'Updated', createdAt: new Date(), updatedAt: new Date() };
    vi.mocked(api.patch).mockResolvedValueOnce({ data: mockData });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useEntityApi<TestEntity>({
        endpoint: '/api/test',
        queryKey: ['test'],
      }),
      { wrapper }
    );

    result.current.update.mutate({ id: '1', data: { name: 'Updated' } });

    await waitFor(() => expect(result.current.update.isSuccess).toBe(true));

    expect(api.patch).toHaveBeenCalledWith('/api/test/1', { name: 'Updated' });
  });

  it('should delete entity', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({});

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useEntityApi<TestEntity>({
        endpoint: '/api/test',
        queryKey: ['test'],
      }),
      { wrapper }
    );

    result.current.remove.mutate('1');

    await waitFor(() => expect(result.current.remove.isSuccess).toBe(true));

    expect(api.delete).toHaveBeenCalledWith('/api/test/1');
  });

  it('should support pagination', async () => {
    const mockData = {
      data: [{ id: '1', name: 'Test', createdAt: new Date(), updatedAt: new Date() }],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useEntityApi<TestEntity>({
        endpoint: '/api/test',
        queryKey: ['test'],
        pagination: { pageSize: 10, enabled: true },
      }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.pagination).toBeDefined();
    expect(result.current.pagination?.page).toBe(1);
    expect(result.current.pagination?.pageSize).toBe(10);
    expect(result.current.pagination?.total).toBe(1);
  });
});
