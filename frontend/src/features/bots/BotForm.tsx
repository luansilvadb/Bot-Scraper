import {
  Field,
  Input,
  Select,
  Button,
  SkeletonItem,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  Info20Regular,
  Send20Regular,
  Settings20Regular,
} from '@fluentui/react-icons';
import { useForm } from '@/hooks/useForm';
import { FormSection } from '@/components/FormSection';
import type { CreateBotInput, UpdateBotInput, Bot } from './api';

interface BotFormProps {
  initialData?: Bot;
  onSubmit: (data: CreateBotInput | UpdateBotInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

interface FormErrors {
  name?: string;
  targetUrl?: string;
  affiliateTag?: string;
  telegramToken?: string;
  chatId?: string;
  scheduleCron?: string;
}

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  actions: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalS),
    justifyContent: 'flex-end',
    marginTop: tokens.spacingVerticalL,
  },
});

const defaultData = {
  name: '',
  targetUrl: '',
  affiliateTag: '',
  telegramToken: '',
  chatId: '',
  scheduleCron: '*/30 * * * *',
  status: 'ACTIVE' as const,
};

export function BotForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: BotFormProps) {
  const styles = useStyles();

  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm<typeof defaultData>({
    initialData: initialData
      ? {
          name: initialData.name || '',
          targetUrl: initialData.targetUrl || '',
          affiliateTag: initialData.affiliateTag || '',
          telegramToken: initialData.telegramToken || '',
          chatId: initialData.chatId || '',
          scheduleCron: initialData.scheduleCron || '*/30 * * * *',
          status: initialData.status || 'ACTIVE',
        }
      : defaultData,
    validate: (data): FormErrors => {
      const newErrors: FormErrors = {};

      if (!data.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!data.targetUrl.trim()) {
        newErrors.targetUrl = 'Target URL is required';
      } else {
        try {
          new URL(data.targetUrl);
        } catch {
          newErrors.targetUrl = 'Must be a valid URL';
        }
      }

      if (!data.affiliateTag.trim()) {
        newErrors.affiliateTag = 'Affiliate tag is required';
      }

      if (!data.telegramToken.trim()) {
        newErrors.telegramToken = 'Telegram token is required';
      }

      if (!data.chatId.trim()) {
        newErrors.chatId = 'Chat ID is required';
      }

      if (!data.scheduleCron.trim()) {
        newErrors.scheduleCron = 'Schedule cron is required';
      } else {
        const cronRegex =
          /^([0-9*,\-/]+)\s+([0-9*,\-/]+)\s+([0-9*,\-/]+)\s+([0-9*,\-/]+)\s+([0-9*,\-/]+)$/;
        if (!cronRegex.test(data.scheduleCron)) {
          newErrors.scheduleCron = 'Must be a valid cron expression';
        }
      }

      return newErrors;
    },
    onSubmit: async (data) => {
      const submitData: CreateBotInput | UpdateBotInput = {
        name: data.name,
        targetUrl: data.targetUrl,
        affiliateTag: data.affiliateTag,
        telegramToken: data.telegramToken,
        chatId: data.chatId,
        scheduleCron: data.scheduleCron,
        status: data.status,
      };
      await onSubmit(submitData);
    },
  });

  const isDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormSection icon={<Info20Regular />} title="General Information" showDivider>
        <Field
          label="Name"
          required
          validationState={errors.name ? 'error' : 'none'}
          validationMessage={errors.name}
        >
          <Input
            value={formData.name}
            onChange={(_, data) => handleChange('name', data.value)}
            placeholder="My Bot"
            disabled={isDisabled}
          />
        </Field>

        <Field
          label="Target URL"
          required
          validationState={errors.targetUrl ? 'error' : 'none'}
          validationMessage={errors.targetUrl}
        >
          <Input
            value={formData.targetUrl}
            onChange={(_, data) => handleChange('targetUrl', data.value)}
            placeholder="https://www.amazon.com/..."
            disabled={isDisabled}
          />
        </Field>

        <Field
          label="Affiliate Tag"
          required
          validationState={errors.affiliateTag ? 'error' : 'none'}
          validationMessage={errors.affiliateTag}
        >
          <Input
            value={formData.affiliateTag}
            onChange={(_, data) => handleChange('affiliateTag', data.value)}
            placeholder="mytag-20"
            disabled={isDisabled}
          />
        </Field>
      </FormSection>

      <FormSection icon={<Send20Regular />} title="Telegram Credentials" showDivider>
        <Field
          label="Telegram Token"
          required
          validationState={errors.telegramToken ? 'error' : 'none'}
          validationMessage={errors.telegramToken}
        >
          <Input
            value={formData.telegramToken}
            onChange={(_, data) => handleChange('telegramToken', data.value)}
            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            type="password"
            disabled={isDisabled}
          />
        </Field>

        <Field
          label="Chat ID"
          required
          validationState={errors.chatId ? 'error' : 'none'}
          validationMessage={errors.chatId}
        >
          <Input
            value={formData.chatId}
            onChange={(_, data) => handleChange('chatId', data.value)}
            placeholder="-1001234567890"
            disabled={isDisabled}
          />
        </Field>
      </FormSection>

      <FormSection icon={<Settings20Regular />} title="Configuration">
        <Field
          label="Schedule (Cron)"
          required
          validationState={errors.scheduleCron ? 'error' : 'none'}
          validationMessage={errors.scheduleCron}
        >
          <Input
            value={formData.scheduleCron}
            onChange={(_, data) => handleChange('scheduleCron', data.value)}
            placeholder="*/30 * * * *"
            disabled={isDisabled}
          />
        </Field>

        <Field label="Status">
          <Select
            value={formData.status}
            onChange={(_, data) =>
              handleChange('status', data.value as 'ACTIVE' | 'PAUSED')
            }
            disabled={isDisabled}
          >
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
          </Select>
        </Field>
      </FormSection>

      <div className={styles.actions}>
        <Button appearance="secondary" onClick={onCancel} disabled={isDisabled}>
          Cancel
        </Button>
        <Button appearance="primary" type="submit" disabled={isDisabled}>
          {isDisabled ? (
            <SkeletonItem
              shape="rectangle"
              style={{ width: '60px', height: '16px' }}
            />
          ) : mode === 'create' ? (
            'Create Bot'
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
