/**
 * FluentInput Component
 * Wrapper around Fluent UI Input with validation support
 * Replaces all native <input> elements
 */

import * as React from 'react';
import {
  Input,
  type InputProps,
  Label,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { mergeClasses } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    width: '100%',
  },
  field: {
    width: '100%',
  },
  label: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  error: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorStatusDangerForeground1,
    marginTop: tokens.spacingVerticalXS,
  },
  hint: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: tokens.spacingVerticalXS,
  },
  required: {
    color: tokens.colorStatusDangerForeground1,
    marginLeft: tokens.spacingHorizontalXS,
  },
});

export interface FluentInputProps extends Omit<InputProps, 'onChange'> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Change handler with string value */
  onChange?: (value: string) => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * FluentInput - Standardized input component with validation support
 *
 * Usage:
 * ```tsx
 * <FluentInput
 *   label="Email"
 *   placeholder="Enter your email"
 *   onChange={(value) => setEmail(value)}
 * />
 * <FluentInput
 *   label="Password"
 *   type="password"
 *   required
 *   error={passwordError}
 *   hint="Must be at least 8 characters"
 * />
 * ```
 */
export const FluentInput: React.FC<FluentInputProps> = ({
  label,
  error,
  hint,
  required,
  onChange,
  className,
  ...props
}) => {
  const styles = useStyles();
  const inputId = React.useId();

  const handleChange = React.useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
      onChange?.(data.value);
    },
    [onChange]
  );

  // If no label, render just the input wrapped in Field for validation
  if (!label) {
    return (
      <Field
        className={mergeClasses(styles.field, className)}
        validationState={error ? 'error' : undefined}
        validationMessage={error}
        hint={hint}
      >
        <Input {...props} onChange={handleChange} />
      </Field>
    );
  }

  return (
    <div className={mergeClasses(styles.root, className)}>
      <Label htmlFor={inputId} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </Label>
      <Field
        validationState={error ? 'error' : undefined}
        validationMessage={error}
        hint={hint}
      >
        <Input
          {...props}
          id={inputId}
          onChange={handleChange}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
        />
      </Field>
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
};

FluentInput.displayName = 'FluentInput';
