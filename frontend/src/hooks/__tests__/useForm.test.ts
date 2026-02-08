import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

interface TestFormData {
  name: string;
  email: string;
}

describe('useForm', () => {
  const initialData: TestFormData = {
    name: '',
    email: '',
  };

  it('should initialize with initial data', () => {
    const { result } = renderHook(() =>
      useForm({ initialData: { name: 'John', email: 'john@example.com' } })
    );

    expect(result.current.formData).toEqual({
      name: 'John',
      email: 'john@example.com',
    });
  });

  it('should handle field changes', () => {
    const { result } = renderHook(() => useForm({ initialData }));

    act(() => {
      result.current.handleChange('name', 'John');
    });

    expect(result.current.formData.name).toBe('John');
    expect(result.current.isDirty).toBe(true);
  });

  it('should clear error on field change', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData,
        validate: (data) => ({
          name: data.name ? undefined : 'Name is required',
        }),
      })
    );

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as Event);
    });

    expect(result.current.errors.name).toBe('Name is required');

    act(() => {
      result.current.handleChange('name', 'John');
    });

    expect(result.current.errors.name).toBeUndefined();
  });

  it('should validate on submit', async () => {
    const validate = vi.fn().mockReturnValue({ name: 'Name is required' });
    const { result } = renderHook(() =>
      useForm({ initialData, validate })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as Event);
    });

    expect(validate).toHaveBeenCalledWith(initialData);
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('should call onSubmit when validation passes', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useForm({ initialData: { name: 'John', email: '' }, onSubmit })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as Event);
    });

    expect(onSubmit).toHaveBeenCalledWith({ name: 'John', email: '' });
  });

  it('should set isSubmitting during submission', async () => {
    let resolveSubmit: () => void;
    const onSubmit = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    const { result } = renderHook(() =>
      useForm({ initialData: { name: 'John', email: '' }, onSubmit })
    );

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as Event);
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      resolveSubmit();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('should reset form to initial data', () => {
    const { result } = renderHook(() =>
      useForm({ initialData: { name: 'John', email: 'john@example.com' } })
    );

    act(() => {
      result.current.handleChange('name', 'Jane');
      result.current.setErrors({ name: 'Error' });
    });

    expect(result.current.formData.name).toBe('Jane');
    expect(result.current.isDirty).toBe(true);
    expect(result.current.errors.name).toBe('Error');

    act(() => {
      result.current.reset();
    });

    expect(result.current.formData).toEqual({
      name: 'John',
      email: 'john@example.com',
    });
    expect(result.current.isDirty).toBe(false);
    expect(result.current.errors).toEqual({});
  });

  it('should allow manual error setting', () => {
    const { result } = renderHook(() => useForm({ initialData }));

    act(() => {
      result.current.setErrors({ name: 'Custom error' });
    });

    expect(result.current.errors.name).toBe('Custom error');
  });

  it('should allow manual form data setting', () => {
    const { result } = renderHook(() => useForm({ initialData }));

    act(() => {
      result.current.setFormData({ name: 'Jane', email: 'jane@example.com' });
    });

    expect(result.current.formData).toEqual({
      name: 'Jane',
      email: 'jane@example.com',
    });
  });

  it('should not submit when validation fails', async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({
        initialData,
        validate: () => ({ name: 'Required' }),
        onSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as Event);
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
