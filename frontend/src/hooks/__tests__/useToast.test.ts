import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  it('should return toast methods', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.showToast).toBeDefined();
    expect(result.current.showSuccess).toBeDefined();
    expect(result.current.showError).toBeDefined();
    expect(result.current.showWarning).toBeDefined();
    expect(result.current.showInfo).toBeDefined();
    expect(result.current.ToasterComponent).toBeDefined();
  });

  it('should maintain backward compatibility', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.success).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.warning).toBeDefined();
    expect(result.current.info).toBeDefined();
  });
});
