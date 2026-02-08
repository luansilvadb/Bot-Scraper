# Data Model: Frontend Architecture Refactoring

**Date**: 2025-02-08  
**Feature**: 020-frontend-refactor  
**Purpose**: Consolidar tipos e interfaces reutilizáveis

## Core Types

### Entity Base Interface

```typescript
// src/types/entities.ts

/**
 * Interface base para todas as entidades do sistema
 * Define campos comuns que todas as entidades possuem
 */
export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface para entidades com nome e descrição
 */
export interface NamedEntity extends Entity {
  name: string;
  description?: string;
}

/**
 * Interface para entidades com status
 */
export interface StatusEntity extends Entity {
  status: 'active' | 'inactive' | 'pending' | 'error';
}
```

### Form Types

```typescript
// src/types/form.ts

/**
 * Erros de validação de formulário
 * Mapeia campos do formulário para mensagens de erro
 */
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Estado de um formulário
 */
export interface FormState<T> {
  data: T;
  errors: FormErrors<T>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

/**
 * Configuração de validação para campos
 */
export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | undefined;
  message?: string;
}

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};
```

### API Types

```typescript
// src/types/api.ts

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Resposta paginada da API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Parâmetros de query para listagens
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

/**
 * Estado de operação assíncrona
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Estado de operação mutação
 */
export interface MutationState {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}
```

### UI Types

```typescript
// src/types/ui.ts

/**
 * Props base para componentes Fluent UI
 */
export interface FluentComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props para componentes com ações
 */
export interface ActionableProps {
  onAction?: () => void;
  actionLabel?: string;
  actionDisabled?: boolean;
}

/**
 * Props para componentes de lista
 */
export interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
  loading?: boolean;
}

/**
 * Props para componentes de modal
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
}

/**
 * Props para componentes de formulário em modal
 */
export interface FormModalProps<T> extends ModalProps {
  initialData?: T;
  onSubmit: (data: T) => Promise<void>;
  validate?: (data: T) => FormErrors<T>;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * Props para badge de status
 */
export interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props para componentes de loading
 */
export interface LoadingProps {
  loading?: boolean;
  skeleton?: boolean;
  count?: number;
}
```

## Feature-Specific Consolidated Types

### Workers

```typescript
// Consolidar em src/types/entities.ts

export interface Worker extends NamedEntity, StatusEntity {
  token?: string;
  lastSeen?: Date;
  capabilities?: string[];
}

export interface WorkerTask {
  id: string;
  workerId: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}
```

### Bots

```typescript
// Consolidar em src/types/entities.ts

export interface Bot extends NamedEntity, StatusEntity {
  config: Record<string, unknown>;
  schedule?: string;
  lastRun?: Date;
  nextRun?: Date;
}
```

### Products

```typescript
// Consolidar em src/types/entities.ts

export interface Product extends NamedEntity {
  price: number;
  currency: string;
  url?: string;
  imageUrl?: string;
  source: string;
  metadata?: Record<string, unknown>;
}
```

### Settings

```typescript
// Consolidar em src/types/entities.ts

export interface Setting extends NamedEntity {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'json';
  category?: string;
  isSecret?: boolean;
}
```

## Hook Contracts

### useEntityApi Contract

```typescript
// src/hooks/useEntityApi.ts

interface UseEntityApiOptions<T> {
  endpoint: string;
  queryKey: string[];
  enabled?: boolean;
  staleTime?: number;
}

interface UseEntityApiReturn<T> {
  // Query
  data: T[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  
  // Mutations
  create: UseMutationResult<T, unknown, Omit<T, 'id'>>;
  update: UseMutationResult<T, unknown, { id: string; data: Partial<T> }>;
  remove: UseMutationResult<void, unknown, string>;
  
  // Pagination
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
}

// Hook signature
function useEntityApi<T extends Entity>(
  options: UseEntityApiOptions<T>
): UseEntityApiReturn<T>;
```

### useForm Contract

```typescript
// src/hooks/useForm.ts (já existe, apenas documentar)

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
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  reset: () => void;
  setErrors: (errors: FormErrors<T>) => void;
  setFormData: (data: T) => void;
}

// Hook signature
function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>
): UseFormReturn<T>;
```

### useModal Contract

```typescript
// src/hooks/useModal.ts (já existe, apenas documentar)

interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

// Hook signature
function useModal(initialState?: boolean): UseModalReturn;
```

## Component Contracts

### FormModal

```typescript
// src/components/FormModal/FormModal.tsx

interface FormModalProps<T> {
  // Modal props
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'small' | 'medium' | 'large';
  
  // Form props
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  validate?: (data: T) => FormErrors<T>;
  
  // Content
  children: (formProps: {
    formData: T;
    errors: FormErrors<T>;
    handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
    isSubmitting: boolean;
  }) => React.ReactNode;
  
  // Labels
  submitLabel?: string;
  cancelLabel?: string;
}
```

### CardSkeleton

```typescript
// src/components/CardSkeleton/CardSkeleton.tsx

interface CardSkeletonProps {
  count?: number;
  rows?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}
```

### StatusBadge

```typescript
// src/components/StatusBadge/StatusBadge.tsx

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'neutral' | string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}
```

### FormSection

```typescript
// src/components/FormSection/FormSection.tsx

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}
```

## Utility Types

### Result Type

```typescript
// src/types/utils.ts

/**
 * Tipo Result para tratamento de erros funcional
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper para criar Result success
 */
export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

/**
 * Helper para criar Result error
 */
export function err<E = Error>(error: E): Result<never, E> {
  return { success: false, error };
}
```

### Nullable Types

```typescript
// src/types/utils.ts

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type NonNullable<T> = T extends null | undefined ? never : T;
export type Required<T> = Exclude<T, undefined>;
```

### Async Types

```typescript
// src/types/utils.ts

export type AsyncFunction<T, A extends unknown[]> = (
  ...args: A
) => Promise<T>;

export type AsyncReturnType<T extends AsyncFunction<unknown, unknown[]>> =
  T extends AsyncFunction<infer R, unknown[]> ? R : never;
```

## Export Structure

```typescript
// src/types/index.ts

// Core types
export * from './entities';
export * from './form';
export * from './api';
export * from './ui';
export * from './utils';

// Fluent UI extensions
export * from './fluent-ui';
```

## Type Safety Rules

1. **Sem `any`**: Todos os tipos devem ser explícitos
2. **Genéricos preferidos**: Usar `<T extends Entity>` em vez de `Entity` direto
3. **Discriminated unions**: Usar para estados (ex: `status: 'loading' | 'success' | 'error'`)
4. **Branded types**: Para IDs e tipos primitivos com semântica (ex: `type UserId = string & { __brand: 'UserId' }`)
5. **Strict null checks**: Sempre tratar `null` e `undefined` explicitamente

---

## Migration Guide

### De types/feature.ts para types/entities.ts

```typescript
// BEFORE: Em cada feature
// src/features/workers/types.ts
export interface Worker {
  id: string;
  name: string;
  // ... campos específicos
}

// AFTER: Centralizado
// src/types/entities.ts
export interface Worker extends NamedEntity, StatusEntity {
  // ... campos específicos
}

// Import em features
import { Worker } from '@/types/entities';
```

### De interfaces locais para tipos reutilizáveis

```typescript
// BEFORE: Interface duplicada
interface WorkerFormData {
  name: string;
  description: string;
}

// AFTER: Usar tipos existentes
import { Worker } from '@/types/entities';
type WorkerFormData = Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>;
```

---

## Validation

Todos os tipos neste documento:
- ✅ Usam TypeScript strict mode
- ✅ Não usam `any`
- ✅ São testáveis (tipos exportados)
- ✅ Seguem convenções de nomenclatura do projeto
- ✅ São documentados com JSDoc
