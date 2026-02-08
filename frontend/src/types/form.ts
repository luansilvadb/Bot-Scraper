/**
 * Form Types
 * Types for form handling and validation
 */

/**
 * Form validation errors mapped by field
 */
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Form state interface
 */
export interface FormState<T> {
  data: T;
  errors: FormErrors<T>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

/**
 * Validation rule for a form field
 */
export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | undefined;
  message?: string;
}

/**
 * Validation rules for form fields
 */
export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

/**
 * Form field metadata
 */
export interface FormField<T> {
  name: keyof T;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule<T[keyof T]>;
}
