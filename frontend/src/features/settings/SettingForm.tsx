import React from 'react';
import {
  Field,
  Input,
  Textarea,
  Button,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { useForm } from '@/hooks/useForm';
import type { SystemSetting } from './api';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM),
    paddingTop: tokens.spacingVerticalM,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
    paddingTop: tokens.spacingVerticalS,
  },
});

interface SettingFormProps {
  mode: 'create' | 'edit';
  initialData?: SystemSetting;
  onSubmit: (data: SystemSetting) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultData: SystemSetting = {
  key: '',
  value: '',
};

export const SettingForm: React.FC<SettingFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const styles = useStyles();

  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm<SystemSetting>({
    initialData: initialData || defaultData,
    validate: (data) => {
      const validationErrors: { key?: string; value?: string } = {};
      if (!data.key.trim()) {
        validationErrors.key = 'Key is required';
      }
      if (!data.value.trim()) {
        validationErrors.value = 'Value is required';
      }
      return validationErrors;
    },
    onSubmit: async (data) => {
      await onSubmit(data);
    },
  });

  const isDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Field
        label="Setting Key"
        required
        validationState={errors.key ? 'error' : 'none'}
        validationMessage={errors.key}
      >
        <Input
          value={formData.key}
          onChange={(_, data) => handleChange('key', data.value.toUpperCase())}
          placeholder="E.g. TELEGRAM_TOKEN"
          disabled={isDisabled || mode === 'edit'}
        />
      </Field>

      <Field
        label="Value"
        required
        validationState={errors.value ? 'error' : 'none'}
        validationMessage={errors.value}
      >
        <Textarea
          value={formData.value}
          onChange={(_, data) => handleChange('value', data.value)}
          placeholder="Enter value..."
          resize="vertical"
          disabled={isDisabled}
        />
      </Field>

      <div className={styles.actions}>
        <Button appearance="secondary" onClick={onCancel} disabled={isDisabled}>
          Cancel
        </Button>
        <Button appearance="primary" type="submit" disabled={isDisabled}>
          {isDisabled ? 'Saving...' : mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </div>
    </form>
  );
};
