import { useState, useCallback, useEffect, FormEvent } from 'react';

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export interface UseFormOptions<T> {
  initialData: T;
  validate?: (data: T) => FormErrors<T>;
  onSubmit?: (data: T) => Promise<void>;
}

export interface UseFormReturn<T> {
  formData: T;
  errors: FormErrors<T>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  reset: () => void;
  setErrors: (errors: FormErrors<T>) => void;
  setFormData: (data: T) => void;
}

export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialData, validate, onSubmit } = options;

  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setIsDirty(false);
  }, [initialData]);

  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialData]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (validate) {
        const validationErrors = validate(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(formData);
          setIsDirty(false);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [formData, validate, onSubmit]
  );

  return {
    formData,
    errors,
    isSubmitting,
    isDirty,
    handleChange,
    handleSubmit,
    reset,
    setErrors,
    setFormData,
  };
}
