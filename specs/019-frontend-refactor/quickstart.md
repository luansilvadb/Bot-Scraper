# Quick Start Guide - Frontend Refactoring

**Branch**: `019-frontend-refactor` | **Date**: 2025-02-08

## Overview

This guide helps developers use the new abstractions created by the frontend refactoring initiative.

---

## Prerequisites

- Familiarity with React and TypeScript
- Understanding of Fluent UI React components
- Knowledge of React Query for data fetching

---

## New Hooks

### useForm

**Purpose**: Centralized form state management

**Basic Usage**:

```typescript
import { useForm } from '@/hooks/useForm';

interface ProductFormData {
  name: string;
  price: number;
  category: string;
}

function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const { 
    formData, 
    errors, 
    handleChange, 
    handleSubmit, 
    isSubmitting 
  } = useForm<ProductFormData>({
    initialData: initialData || { name: '', price: 0, category: '' },
    validate: (data) => {
      const errors: Partial<Record<keyof ProductFormData, string>> = {};
      if (!data.name) errors.name = 'Name is required';
      if (data.price <= 0) errors.price = 'Price must be positive';
      return errors;
    },
    onSubmit: async (data) => {
      await onSubmit(data);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Name" validationMessage={errors.name}>
        <Input 
          value={formData.name} 
          onChange={(e) => handleChange('name', e.target.value)} 
        />
      </Field>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

**Return Values**:

| Property | Type | Description |
|----------|------|-------------|
| `formData` | `T` | Current form values |
| `errors` | `FormErrors<T>` | Validation errors |
| `isSubmitting` | `boolean` | Submit in progress |
| `isDirty` | `boolean` | Form has changes |
| `handleChange` | `(field, value) => void` | Update field value |
| `handleSubmit` | `(e) => Promise<void>` | Submit handler |
| `reset` | `() => void` | Reset to initial |
| `setErrors` | `(errors) => void` | Set errors manually |

---

### useModal

**Purpose**: Manage modal visibility and data

**Basic Usage**:

```typescript
import { useModal } from '@/hooks/useModal';

function ProductList() {
  const { isOpen, data: editingProduct, open, close } = useModal<Product>();

  return (
    <>
      <Button onClick={() => open()}>Create Product</Button>
      
      {products.map(product => (
        <Card key={product.id}>
          {product.name}
          <Button onClick={() => open(product)}>Edit</Button>
        </Card>
      ))}

      <FormModal
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        isOpen={isOpen}
        onClose={close}
      >
        <ProductForm 
          initialData={editingProduct} 
          onSubmit={handleSubmit} 
        />
      </FormModal>
    </>
  );
}
```

**Return Values**:

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Modal visibility |
| `data` | `T \| null` | Modal data (if editing) |
| `open` | `(data?: T) => void` | Open modal |
| `close` | `() => void` | Close modal |
| `toggle` | `() => void` | Toggle visibility |

---

### useEntityApi

**Purpose**: Generate CRUD hooks for entities

**Basic Usage**:

```typescript
// features/products/api.ts
import { useEntityApi } from '@/hooks/useEntityApi';
import type { Product } from '@/types';

export const productApi = useEntityApi<Product>({
  endpoint: '/api/products',
  entityKey: 'products',
  queryKeys: ['products', 'categories']
});

// Usage in component
import { productApi } from './api';

function ProductList() {
  const { data: products, isLoading } = productApi.useList();
  const createProduct = productApi.useCreate();
  const updateProduct = productApi.useUpdate();
  const deleteProduct = productApi.useDelete();

  const handleCreate = async (data: CreateProductDto) => {
    await createProduct.mutateAsync(data);
  };

  // ...
}
```

**Generated Hooks**:

| Hook | Purpose |
|------|---------|
| `useList` | Query all entities |
| `useOne(id)` | Query single entity |
| `useCreate` | Create mutation |
| `useUpdate` | Update mutation |
| `useDelete` | Delete mutation |

---

## New Components

### FormModal

**Purpose**: Standardized modal for forms

**Props**:

```typescript
interface FormModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}
```

**Usage**:

```tsx
<FormModal
  title="Create Product"
  isOpen={isOpen}
  onClose={close}
  size="medium"
>
  <ProductForm onSubmit={handleSubmit} />
</FormModal>
```

**Features**:
- Consistent styling (90% width, max 560px)
- Built-in close button
- Escape key to close
- Click outside to close

---

### FormSection

**Purpose**: Form section with header and divider

**Props**:

```typescript
interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  showDivider?: boolean;
}
```

**Usage**:

```tsx
<FormSection
  icon={<Settings20Regular />}
  title="Configuration"
  showDivider
>
  <Field label="API Key">
    <Input value={apiKey} onChange={...} />
  </Field>
</FormSection>
```

**Features**:
- Consistent spacing
- Icon + title header
- Optional divider

---

### CardSkeleton

**Purpose**: Loading skeleton for card lists

**Props**:

```typescript
interface CardSkeletonProps {
  count?: number;
  cardHeight?: number;
}
```

**Usage**:

```tsx
{isLoading && <CardSkeleton count={8} cardHeight={120} />}
```

**Features**:
- Fluent UI Skeleton styling
- Configurable count
- Consistent card dimensions

---

### StatusBadge

**Purpose**: Status indicator with automatic color mapping

**Props**:

```typescript
type StatusValue = 'active' | 'inactive' | 'pending' | 'error' | 'connected' | 'disconnected';
type StatusSize = 'small' | 'medium';

interface StatusBadgeProps {
  status: StatusValue;
  size?: StatusSize;
}
```

**Usage**:

```tsx
<StatusBadge status={worker.status} size="medium" />
<StatusBadge status={product.status} />
```

**Built-in Status Mappings**:

| Status | Color | Icon |
|--------|-------|------|
| active | green | ✓ |
| inactive | gray | ○ |
| pending | yellow | ◐ |
| error | red | ✗ |
| connected | green | ● |
| disconnected | red | ○ |

---

## Enhanced Hooks

### useToast (Enhanced)

**New Methods**:

```typescript
const toast = useToast();

// Simple success toast
toast.showSuccess('Product created successfully');

// Error with title
toast.showError('Failed to save product', 'Save Error');

// Info toast
toast.showInfo('Processing...');

// Warning
toast.showWarning('This action cannot be undone');
```

**Replaces**: Manual toast dispatching with `useToastController`

---

## Migration Examples

### Before: Manual Form State

```typescript
function ProductForm({ initialData, onSubmit }: Props) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = 'Required';
    // ... more validation
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... render
}
```

**Lines**: ~80

---

### After: useForm Hook

```typescript
function ProductForm({ initialData, onSubmit }: Props) {
  const { formData, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialData,
    validate: (data) => {
      const errors: Errors = {};
      if (!data.name) errors.name = 'Required';
      return errors;
    },
    onSubmit
  });

  // ... render
}
```

**Lines**: ~25

**Savings**: ~55 lines per form

---

## Best Practices

### Do

✅ Use `useForm` for all forms with validation
✅ Use `FormModal` instead of inline modal markup
✅ Use `FormSection` for consistent form layouts
✅ Use `StatusBadge` for status indicators
✅ Use enhanced `useToast` for notifications
✅ Maintain strict TypeScript typing (no `any`)
✅ Add tests for all new abstractions

### Don't

❌ Don't inline duplicate form patterns
❌ Don't create new modals without using `FormModal`
❌ Don't copy-paste skeleton loading code
❌ Don't use raw `useToastController` anymore
❌ Don't introduce `any` types
❌ Don't skip tests for refactored code

---

## Testing

### Testing useForm

```typescript
import { renderHook, act } from '@testing-library/react';
import { useForm } from '@/hooks/useForm';

describe('useForm', () => {
  it('should manage form state', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { name: '' },
        validate: (data) => (data.name ? {} : { name: 'Required' })
      })
    );

    act(() => {
      result.current.handleChange('name', 'Test');
    });

    expect(result.current.formData.name).toBe('Test');
  });
});
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import { FormModal } from '@/components/FormModal';

describe('FormModal', () => {
  it('should render with title', () => {
    render(
      <FormModal title="Test" isOpen={true} onClose={jest.fn()}>
        <div>Content</div>
      </FormModal>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### Form not validating

**Check**: Is `validate` function returning empty object for valid state?

```typescript
// Correct
validate: (data) => {
  const errors = {};
  if (!data.name) errors.name = 'Required';
  return errors; // Return empty object if valid
}
```

### Modal not closing

**Check**: Is `onClose` properly connected?

```typescript
const { isOpen, close } = useModal();

<FormModal isOpen={isOpen} onClose={close}>
```

### Toast not showing

**Check**: Are you using the enhanced hook?

```typescript
// Old way - don't use
const { dispatchToast } = useToastController(toasterId);

// New way - use this
const toast = useToast();
toast.showSuccess('Message');
```

---

## Migration Checklist

When refactoring a component:

- [ ] Identify duplicated patterns from research.md
- [ ] Replace with appropriate abstraction
- [ ] Update imports
- [ ] Add/update tests
- [ ] Verify TypeScript strict mode
- [ ] Check security controls preserved
- [ ] Validate accessibility
- [ ] Update documentation if needed
- [ ] Run lint and tests
- [ ] Measure LoC reduction

---

## Support

Questions about the new abstractions?

1. Check this quickstart guide
2. Review data-model.md for entity definitions
3. Look at existing usage in refactored components
4. Check test files for usage examples

---

**Last Updated**: 2025-02-08
