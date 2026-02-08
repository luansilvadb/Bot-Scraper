import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModal } from '../useModal';

interface TestData {
  id: string;
  name: string;
}

describe('useModal', () => {
  it('should initialize with closed state and null data', () => {
    const { result } = renderHook(() => useModal<TestData>());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('should open modal without data', () => {
    const { result } = renderHook(() => useModal<TestData>());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('should open modal with data', () => {
    const { result } = renderHook(() => useModal<TestData>());
    const testData = { id: '1', name: 'Test' };

    act(() => {
      result.current.open(testData);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual(testData);
  });

  it('should close modal and clear data', () => {
    const { result } = renderHook(() => useModal<TestData>());
    const testData = { id: '1', name: 'Test' };

    act(() => {
      result.current.open(testData);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual(testData);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('should toggle modal state', () => {
    const { result } = renderHook(() => useModal<TestData>());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should clear data when toggling closed', () => {
    const { result } = renderHook(() => useModal<TestData>());
    const testData = { id: '1', name: 'Test' };

    act(() => {
      result.current.open(testData);
    });

    expect(result.current.data).toEqual(testData);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.data).toBeNull();
  });
});
