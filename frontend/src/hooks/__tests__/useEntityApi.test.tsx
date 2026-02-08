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

  it('should create hooks factory', () => {
    const entityApi = useEntityApi<TestEntity>({
      endpoint: '/api/test',
      entityKey: 'test',
    });

    expect(entityApi.useList).toBeDefined();
    expect(entityApi.useOne).toBeDefined();
    expect(entityApi.useCreate).toBeDefined();
    expect(entityApi.useUpdate).toBeDefined();
    expect(entityApi.useDelete).toBeDefined();
  });

  it('should fetch list', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const entityApi = useEntityApi<TestEntity>({
      endpoint: '/api/test',
      entityKey: 'test',
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => entityApi.useList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith('/api/test');
  });

  it('should fetch single entity', async () => {
    const mockData = { id: '1', name: 'Test' };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const entityApi = useEntityApi<TestEntity>({
      endpoint: '/api/test',
      entityKey: 'test',
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => entityApi.useOne('1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith('/api/test/1');
  });

  it('should create entity', async () => {
    const mockData = { id: '1', name: 'Test' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockData });

    const entityApi = useEntityApi<TestEntity>({
      endpoint: '/api/test',
      entityKey: 'test',
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => entityApi.useCreate(), { wrapper });

    result.current.mutate({ name: 'Test' } as Omit<TestEntity, 'id'>);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith('/api/test', { name: 'Test' });
  });

  it('should update entity', async () => {
    const mockData = { id: '1', name: 'Updated' };
    vi.mocked(api.patch).mockResolvedValueOnce({ data: mockData });

    const entityApi = useEntityApi<TestEntity>({
      endpoint: '/api/test',
      entityKey: 'test',
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => entityApi.useUpdate(), { wrapper });

    result.current.mutate({ id: '1', data: { name: 'Updated' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.patch).toHaveBeenCalledWith('/api/test/1', { name: 'Updated' });
  });

  it('should delete entity', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({});

    const entityApi = useEntityApi<TestEntity>({
      endpoint: '/api/test',
      entityKey: 'test',
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => entityApi.useDelete(), { wrapper });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.delete).toHaveBeenCalledWith('/api/test/1');
  });
});
