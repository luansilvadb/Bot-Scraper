import React from 'react';
import {
  Field,
  Input,
  Button,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  Tag20Regular,
  Money20Regular,
  Image20Regular,
  Link20Regular,
} from '@fluentui/react-icons';
import { useForm } from '@/hooks/useForm';
import { FormSection } from '@/components/FormSection';
import type { CreateProductInput, UpdateProductInput, Product } from './api';

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: Product;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginTop: tokens.spacingVerticalL,
  },
});

interface FormData {
  asin: string;
  title: string;
  currentPrice: string;
  originalPrice: string;
  discountPercentage: string;
  imageUrl: string;
  productUrl: string;
}

const defaultData: FormData = {
  asin: '',
  title: '',
  currentPrice: '',
  originalPrice: '',
  discountPercentage: '',
  imageUrl: '',
  productUrl: '',
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const styles = useStyles();

  const getInitialData = (): FormData => {
    if (!initialData || mode !== 'edit') return defaultData;
    return {
      asin: initialData.asin || '',
      title: initialData.title || '',
      currentPrice: initialData.currentPrice?.toString() || '',
      originalPrice: initialData.originalPrice?.toString() || '',
      discountPercentage: initialData.discountPercentage?.toString() || '',
      imageUrl: initialData.imageUrl || '',
      productUrl: initialData.productUrl || '',
    };
  };

  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm<FormData>({
    initialData: getInitialData(),
    validate: (data) => {
      const newErrors: Partial<Record<keyof FormData, string>> = {};

      if (!data.asin.trim() && mode === 'create') {
        newErrors.asin = 'ASIN is required';
      }

      if (!data.title.trim()) {
        newErrors.title = 'Title is required';
      }

      const currentPrice = parseFloat(data.currentPrice);
      if (isNaN(currentPrice) || currentPrice < 0) {
        newErrors.currentPrice = 'Current price must be a positive number';
      }

      const originalPrice = parseFloat(data.originalPrice);
      if (isNaN(originalPrice) || originalPrice < 0) {
        newErrors.originalPrice = 'Original price must be a positive number';
      }

      const discount = parseInt(data.discountPercentage, 10);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        newErrors.discountPercentage = 'Discount must be between 0 and 100';
      }

      if (!data.imageUrl.trim() || !isValidUrl(data.imageUrl)) {
        newErrors.imageUrl = 'Valid image URL is required';
      }

      if (!data.productUrl.trim() || !isValidUrl(data.productUrl)) {
        newErrors.productUrl = 'Valid product URL is required';
      }

      return newErrors;
    },
    onSubmit: async (data) => {
      if (mode === 'create') {
        const createData: CreateProductInput = {
          asin: data.asin,
          title: data.title,
          currentPrice: parseFloat(data.currentPrice),
          originalPrice: parseFloat(data.originalPrice),
          discountPercentage: parseInt(data.discountPercentage, 10),
          imageUrl: data.imageUrl,
          productUrl: data.productUrl,
        };
        await onSubmit(createData);
      } else {
        const updateData: UpdateProductInput = {
          title: data.title,
          currentPrice: parseFloat(data.currentPrice),
          originalPrice: parseFloat(data.originalPrice),
          discountPercentage: parseInt(data.discountPercentage, 10),
          imageUrl: data.imageUrl,
          productUrl: data.productUrl,
        };
        await onSubmit(updateData);
      }
    },
  });

  const isDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormSection icon={<Tag20Regular />} title="Identity & Details" showDivider>
        {mode === 'create' && (
          <Field
            label="ASIN"
            required
            validationState={errors.asin ? 'error' : 'none'}
            validationMessage={errors.asin}
          >
            <Input
              value={formData.asin}
              onChange={(_, data) => handleChange('asin', data.value)}
              placeholder="B0XXXXXXXXX"
              disabled={isDisabled}
            />
          </Field>
        )}

        <Field
          label="Title"
          required
          validationState={errors.title ? 'error' : 'none'}
          validationMessage={errors.title}
        >
          <Input
            value={formData.title}
            onChange={(_, data) => handleChange('title', data.value)}
            placeholder="Product title"
            disabled={isDisabled}
          />
        </Field>
      </FormSection>

      <FormSection icon={<Money20Regular />} title="Pricing Information" showDivider>
        <div className={styles.row}>
          <Field
            label="Current Price"
            required
            validationState={errors.currentPrice ? 'error' : 'none'}
            validationMessage={errors.currentPrice}
          >
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.currentPrice}
              onChange={(_, data) => handleChange('currentPrice', data.value)}
              placeholder="49.99"
              disabled={isDisabled}
            />
          </Field>

          <Field
            label="Original Price"
            required
            validationState={errors.originalPrice ? 'error' : 'none'}
            validationMessage={errors.originalPrice}
          >
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.originalPrice}
              onChange={(_, data) => handleChange('originalPrice', data.value)}
              placeholder="99.99"
              disabled={isDisabled}
            />
          </Field>
        </div>

        <Field
          label="Discount Percentage"
          required
          validationState={errors.discountPercentage ? 'error' : 'none'}
          validationMessage={errors.discountPercentage}
        >
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.discountPercentage}
            onChange={(_, data) => handleChange('discountPercentage', data.value)}
            placeholder="50"
            disabled={isDisabled}
          />
        </Field>
      </FormSection>

      <FormSection icon={<Image20Regular />} title="Media" showDivider>
        <Field
          label="Image URL"
          required
          validationState={errors.imageUrl ? 'error' : 'none'}
          validationMessage={errors.imageUrl}
        >
          <Input
            value={formData.imageUrl}
            onChange={(_, data) => handleChange('imageUrl', data.value)}
            placeholder="https://example.com/image.jpg"
            disabled={isDisabled}
          />
        </Field>
      </FormSection>

      <FormSection icon={<Link20Regular />} title="Links">
        <Field
          label="Product URL"
          required
          validationState={errors.productUrl ? 'error' : 'none'}
          validationMessage={errors.productUrl}
        >
          <Input
            value={formData.productUrl}
            onChange={(_, data) => handleChange('productUrl', data.value)}
            placeholder="https://amazon.com/dp/B0XXXXXXXXX"
            disabled={isDisabled}
          />
        </Field>
      </FormSection>

      <div className={styles.actions}>
        <Button appearance="secondary" onClick={onCancel} disabled={isDisabled}>
          Cancel
        </Button>
        <Button appearance="primary" type="submit" disabled={isDisabled}>
          {isDisabled
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
            ? 'Create Product'
            : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
