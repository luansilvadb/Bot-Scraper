# Data Model - Frontend Architecture Refactoring

**Branch**: `019-frontend-refactor` | **Date**: 2025-02-08

## Entity Definitions

This document defines the entities and patterns for the frontend refactoring initiative.

---

## Entity: ReusableComponent

### Description
Abstracted UI components that replace duplicated code patterns across the application.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | PascalCase component name |
| `propsInterface` | `InterfaceType` | Yes | TypeScript props interface |
| `defaultProps` | `Partial<Props>` | No | Default prop values |
| `compositionSupport` | `boolean` | Yes | Supports children/slots |
| `testCoverage` | `number` | Yes | Target >= 80% |
| `stories` | `string[]` | Yes | Storybook stories |

### Validation Rules

1. **Naming**: Must follow PascalCase
2. **Typing**: All props must be typed (no `any`)
3. **Composition**: Must support `children` if container component
4. **Styling**: Must use Fluent UI `makeStyles`
5. **Testing**: Must have `.test.tsx` file with >=80% coverage

### State Transitions

```
DuplicatedCode -> IdentifiedPattern -> AbstractedComponent -> TestedComponent -> Deployed
```

---

## Entity: CustomHook

### Description
Reusable stateful logic extracted from components.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | camelCase starting with `use` |
| `returnType` | `TypeScriptType` | Yes | Return type signature |
| `parameters` | `ParameterType[]` | Yes | Input parameters |
| `dependencies` | `string[]` | Yes | React dependencies |
| `sideEffects` | `boolean` | Yes | Has useEffect or async |
| `cleanupLogic` | `boolean` | No | Requires cleanup function |

### Validation Rules

1. **Naming**: Must start with `use`, camelCase
2. **Dependencies**: All used hooks/references in dependency array
3. **Cleanup**: Must return cleanup function for subscriptions/timers
4. **Error Handling**: Must handle errors gracefully
5. **Documentation**: Must have JSDoc comments

### Defined Hooks

#### useForm<T>

```typescript
interface UseFormOptions<T> {
  initialData: T;
  validate?: (data: T) => FormErrors<T>;
  onSubmit?: (data: T) => Promise<void>;
}

interface UseFormReturn<T> {
  formData: T;
  errors: FormErrors<T>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T, value: any) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  reset: () => void;
  setErrors: (errors: FormErrors<T>) => void;
}

function useForm<T>(options: UseFormOptions<T>): UseFormReturn<T>;
```

**Purpose**: Centralize form state management
**Replaces**: Duplicated form state in ProductForm, BotForm, SettingForm
**Estimated Lines Saved**: 400

---

#### useModal<T>

```typescript
interface UseModalReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
}

function useModal<T>(): UseModalReturn<T>;
```

**Purpose**: Standardize modal state management
**Replaces**: Repeated modal state patterns in list components
**Estimated Lines Saved**: 150

---

#### useEntityApi<T>

```typescript
interface UseEntityApiOptions {
  endpoint: string;
  entityKey: string;
  queryKeys: string[];
}

interface UseEntityApiReturn<T> {
  useList: () => UseQueryResult<T[]>;
  useOne: (id: string) => UseQueryResult<T>;
  useCreate: () => UseMutationResult<T, unknown, CreateDto>;
  useUpdate: () => UseMutationResult<T, unknown, UpdateDto>;
  useDelete: () => UseMutationResult<void, unknown, string>;
}

function useEntityApi<T>(options: UseEntityApiOptions): UseEntityApiReturn<T>;
```

**Purpose**: Factory for standard CRUD operations
**Replaces**: Duplicated API hooks in feature modules
**Estimated Lines Saved**: 300

---

## Entity: StateContainer

### Description
Cohesive state management units.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `scope` | `'global' \| 'feature' \| 'component'` | Yes | State visibility scope |
| `stateShape` | `Object` | Yes | State structure |
| `actions` | `string[]` | Yes | Available actions |
| `selectors` | `string[]` | Yes | Derived state selectors |
| `persistence` | `'none' \| 'localStorage' \| 'sessionStorage'` | No | Persistence strategy |

### State Scopes

#### Global State (Context API)
- Theme state
- Authentication state
- Toast notifications

#### Feature State (React Query)
- Entity lists (bots, products, settings)
- Cached API responses
- Optimistic updates

#### Component State (useState)
- Form inputs
- Modal visibility
- UI toggles

---

## Component Library

### Form Components

#### FormModal

**Purpose**: Standardized modal for forms
**Props Interface**:

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

**Replaces**: CreateBotModal, EditBotModal, CreateSettingModal wrappers

---

#### FormSection

**Purpose**: Reusable form section with header
**Props Interface**:

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
  <Field label="Name">
    <Input value={name} onChange={...} />
  </Field>
</FormSection>
```

**Replaces**: Inline section markup in ProductForm, BotForm

---

### UI Components

#### CardSkeleton

**Purpose**: Loading skeleton for card lists
**Props Interface**:

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

**Replaces**: Inline skeleton arrays in ProductList, WorkerList

---

#### StatusBadge

**Purpose**: Type-safe status indicator
**Props Interface**:

```typescript
type StatusValue = 'active' | 'inactive' | 'pending' | 'error';
type StatusSize = 'small' | 'medium';

interface StatusBadgeProps {
  status: StatusValue;
  size?: StatusSize;
  customMap?: Record<string, { color: string; icon?: React.ReactNode }>;
}
```

**Usage**:
```tsx
<StatusBadge status={product.status} size="medium" />
```

**Replaces**: getStatusBadge() functions in BotList, ProductList

---

### Hook Components

#### useToast (Enhanced)

**Enhancement**: Add convenience methods to existing hook

```typescript
interface UseToastReturn {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
}
```

**Replaces**: Manual toast dispatching in modals and lists

---

## Validation Rules Summary

### Component Rules

1. **Props must be typed**: No `any` types allowed
2. **Composition**: Container components must accept `children`
3. **Styling**: Use `makeStyles` from `@fluentui/react-components`
4. **Accessibility**: All interactive elements must be accessible
5. **Error Boundaries**: Components must handle errors gracefully

### Hook Rules

1. **Naming**: Start with `use`, camelCase
2. **Dependencies**: Complete dependency arrays
3. **Cleanup**: Return cleanup for side effects
4. **Documentation**: JSDoc for all exports
5. **Testing**: Test hooks with `@testing-library/react-hooks`

### State Management Rules

1. **Scope**: Use appropriate scope (global/feature/component)
2. **Immutability**: Never mutate state directly
3. **Selectors**: Memoize derived data with `useMemo`
4. **Actions**: Keep action logic in hooks, not components

---

## Migration Strategy

### Phase 1: Core Abstractions

1. Create `useForm` hook
2. Refactor one form (SettingForm - smallest)
3. Validate with tests
4. Apply to remaining forms

### Phase 2: UI Components

1. Create `FormModal` component
2. Migrate CreateSettingModal
3. Migrate EditBotModal, CreateBotModal
4. Create `CardSkeleton`, `FormSection`

### Phase 3: API Layer

1. Create `useEntityApi` factory
2. Migrate one feature (settings - simplest)
3. Migrate remaining features

### Phase 4: Polish

1. Standardize `useToast` usage
2. Create `StatusBadge` component
3. Consolidate `useResponsive` exports
4. Final metrics validation

---

## Success Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Total LoC | 7,747 | 6,585 (-15%) | `cloc` |
| Component LoC | ~2,000 dupe | 1,100 saved | Manual count |
| Test Coverage | Current | >=80% | Test runner |
| Bundle Size | Current | <+5% | Build output |
| Type Safety | 0 `any` | 0 `any` | ESLint |

---

## Entity Relationship Diagram

```
┌─────────────────┐     uses      ┌──────────────────┐
│   Reusable      │──────────────▶│   CustomHook     │
│   Component     │               │                  │
└────────┬────────┘               └────────┬─────────┘
         │                                  │
         │ imports                            │ manages
         ▼                                  ▼
┌─────────────────┐               ┌──────────────────┐
│   Fluent UI     │               │   StateContainer │
│   (external)    │               │                  │
└─────────────────┘               └──────────────────┘
         ▲                                  │
         │                                  │ provides
         └──────────────────────────────────┘
```

---

**Status**: Ready for implementation
