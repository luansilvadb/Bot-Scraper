# Hook Contracts

**Feature**: 020-frontend-refactor  
**Purpose**: Definir contratos TypeScript para hooks reutilizáveis

---

## useEntityApi

### Purpose
Hook genérico para operações CRUD em entidades via API REST.

### Signature

```typescript
function useEntityApi<T extends Entity, CreateDTO = Omit<T, 'id' | 'createdAt' | 'updatedAt'>>(
  options: UseEntityApiOptions<T>
): UseEntityApiReturn<T, CreateDTO>
```

### Input (Options)

```typescript
interface UseEntityApiOptions<T> {
  /** Endpoint base da API (ex: '/workers', '/bots') */
  endpoint: string;
  
  /** Chave para cache do React Query */
  queryKey: string[];
  
  /** Se deve habilitar a query automaticamente */
  enabled?: boolean;
  
  /** Tempo em ms para considerar dados obsoletos */
  staleTime?: number;
  
  /** Habilitar paginação */
  pagination?: {
    pageSize: number;
    enabled: boolean;
  };
}
```

### Output (Return)

```typescript
interface UseEntityApiReturn<T, CreateDTO> {
  // === Query State ===
  
  /** Lista de entidades (null se não carregado) */
  data: T[] | null;
  
  /** Se está carregando dados iniciais */
  isLoading: boolean;
  
  /** Se ocorreu erro na query */
  isError: boolean;
  
  /** Objeto de erro (se houver) */
  error: Error | null;
  
  /** Função para refetch manual */
  refetch: () => Promise<void>;
  
  // === Mutations ===
  
  /** Criar nova entidade */
  create: UseMutationResult<T, Error, CreateDTO>;
  
  /** Atualizar entidade existente */
  update: UseMutationResult<T, Error, { id: string; data: Partial<T> }>;
  
  /** Remover entidade */
  remove: UseMutationResult<void, Error, string>;
  
  // === Pagination (se habilitado) ===
  pagination?: {
    /** Página atual (1-indexed) */
    page: number;
    
    /** Itens por página */
    pageSize: number;
    
    /** Total de itens */
    total: number;
    
    /** Total de páginas */
    totalPages: number;
    
    /** Alterar página */
    setPage: (page: number) => void;
    
    /** Alterar tamanho da página */
    setPageSize: (size: number) => void;
    
    /** Próxima página disponível */
    hasNextPage: boolean;
    
    /** Página anterior disponível */
    hasPreviousPage: boolean;
  };
}

// UseMutationResult é do @tanstack/react-query
interface UseMutationResult<TData, TError, TVariables> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: TError | null;
  data: TData | undefined;
  reset: () => void;
}
```

### Usage Example

```typescript
import { useEntityApi } from '@/hooks/useEntityApi';
import type { Worker } from '@/types/entities';

function WorkersList() {
  const {
    data: workers,
    isLoading,
    isError,
    create,
    update,
    remove,
    pagination
  } = useEntityApi<Worker>({
    endpoint: '/workers',
    queryKey: ['workers'],
    pagination: { pageSize: 10, enabled: true }
  });
  
  // Usar mutations
  const handleCreate = async (newWorker: Omit<Worker, 'id'>) => {
    await create.mutateAsync(newWorker);
  };
  
  // Renderizar
  if (isLoading) return <Loading />;
  if (isError) return <Error />;
  
  return (
    <>
      <WorkerTable workers={workers || []} />
      {pagination && <Pagination {...pagination} />}
    </>
  );
}
```

### Error Handling

- **Network errors**: Em `error` com mensagem apropriada
- **Validation errors**: Parse de error.response.data para FormErrors
- **404 errors**: Entidade não encontrada
- **500 errors**: Erro interno do servidor

---

## useForm

### Purpose
Hook para gerenciamento de estado e validação de formulários.

### Signature

```typescript
function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>
): UseFormReturn<T>
```

### Input (Options)

```typescript
interface UseFormOptions<T> {
  /** Dados iniciais do formulário */
  initialData: T;
  
  /** Função de validação opcional */
  validate?: (data: T) => FormErrors<T>;
  
  /** Callback de submit */
  onSubmit?: (data: T) => Promise<void>;
  
  /** Resetar ao submeter com sucesso */
  resetOnSuccess?: boolean;
}
```

### Output (Return)

```typescript
interface UseFormReturn<T> {
  /** Dados atuais do formulário */
  formData: T;
  
  /** Erros de validação por campo */
  errors: FormErrors<T>;
  
  /** Se está submetendo */
  isSubmitting: boolean;
  
  /** Se houve alteração desde o initialData */
  isDirty: boolean;
  
  /** Se o formulário é válido (sem erros) */
  isValid: boolean;
  
  /** Alterar valor de um campo */
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  
  /** Handler para evento submit */
  handleSubmit: (e: FormEvent) => Promise<void>;
  
  /** Resetar para initialData */
  reset: () => void;
  
  /** Definir erros manualmente */
  setErrors: (errors: FormErrors<T>) => void;
  
  /** Definir dados manualmente */
  setFormData: (data: T) => void;
  
  /** Definir um campo específico */
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  
  /** Obter erro de um campo específico */
  getFieldError: (field: keyof T) => string | undefined;
}
```

### Usage Example

```typescript
import { useForm } from '@/hooks/useForm';

interface BotFormData {
  name: string;
  description: string;
  schedule: string;
}

function BotForm({ onSubmit }: { onSubmit: (data: BotFormData) => Promise<void> }) {
  const { formData, errors, handleChange, handleSubmit, isSubmitting } = useForm<BotFormData>({
    initialData: { name: '', description: '', schedule: '' },
    validate: (data) => {
      const errors: FormErrors<BotFormData> = {};
      if (!data.name) errors.name = 'Nome é obrigatório';
      if (data.name.length < 3) errors.name = 'Nome deve ter pelo menos 3 caracteres';
      return errors;
    },
    onSubmit
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      {errors.name && <span>{errors.name}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```

---

## useModal

### Purpose
Hook para controle de estado de modais.

### Signature

```typescript
function useModal(
  initialState?: boolean
): UseModalReturn
```

### Input

```typescript
interface UseModalOptions {
  /** Estado inicial (default: false) */
  initialState?: boolean;
  
  /** Callback quando abrir */
  onOpen?: () => void;
  
  /** Callback quando fechar */
  onClose?: () => void;
}
```

### Output

```typescript
interface UseModalReturn {
  /** Se o modal está aberto */
  isOpen: boolean;
  
  /** Abrir modal */
  open: () => void;
  
  /** Fechar modal */
  close: () => void;
  
  /** Toggle estado */
  toggle: () => void;
  
  /** Set estado diretamente */
  setOpen: (open: boolean) => void;
}
```

### Usage Example

```typescript
import { useModal } from '@/hooks/useModal';
import { FormModal } from '@/components/FormModal';

function WorkerPage() {
  const createModal = useModal();
  const editModal = useModal();
  
  return (
    <>
      <button onClick={createModal.open}>Criar Worker</button>
      
      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Criar Worker"
      >
        {/* conteúdo */}
      </FormModal>
    </>
  );
}
```

---

## useToast

### Purpose
Hook para exibir notificações toast.

### Signature

```typescript
function useToast(): UseToastReturn
```

### Output

```typescript
interface UseToastReturn {
  /** Exibir toast de sucesso */
  success: (message: string, options?: ToastOptions) => void;
  
  /** Exibir toast de erro */
  error: (message: string, options?: ToastOptions) => void;
  
  /** Exibir toast de aviso */
  warning: (message: string, options?: ToastOptions) => void;
  
  /** Exibir toast informativo */
  info: (message: string, options?: ToastOptions) => void;
  
  /** Dismiss todos os toasts */
  dismissAll: () => void;
}

interface ToastOptions {
  /** Duração em ms (default: 5000) */
  duration?: number;
  
  /** Se deve fechar automaticamente */
  autoClose?: boolean;
  
  /** Callback ao fechar */
  onClose?: () => void;
}
```

### Usage Example

```typescript
import { useToast } from '@/hooks/useToast';

function CreateWorkerForm() {
  const toast = useToast();
  
  const handleSubmit = async (data: WorkerData) => {
    try {
      await createWorker(data);
      toast.success('Worker criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar worker: ' + error.message);
    }
  };
  
  // ...
}
```

---

## useClipboard

### Purpose
Hook para interagir com clipboard.

### Signature

```typescript
function useClipboard(): UseClipboardReturn
```

### Output

```typescript
interface UseClipboardReturn {
  /** Copiar texto para clipboard */
  copy: (text: string) => Promise<boolean>;
  
  /** Se suporta clipboard API */
  isSupported: boolean;
  
  /** Texto atual do clipboard (se acessível) */
  pastedText: string | null;
  
  /** Ler do clipboard */
  read: () => Promise<string | null>;
}
```

---

## useResponsive

### Purpose
Hook para media queries e responsividade.

### Signature

```typescript
function useResponsive(breakpoint?: Breakpoint): UseResponsiveReturn
```

### Input

```typescript
type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface UseResponsiveOptions {
  /** Breakpoint para verificar (se omitido, retorna todos) */
  breakpoint?: Breakpoint;
}
```

### Output

```typescript
interface UseResponsiveReturn {
  /** Está em mobile (< 640px) */
  isMobile: boolean;
  
  /** Está em tablet (640px - 1024px) */
  isTablet: boolean;
  
  /** Está em desktop (> 1024px) */
  isDesktop: boolean;
  
  /** Está em wide (> 1440px) */
  isWide: boolean;
  
  /** Tamanho atual da viewport */
  width: number;
  
  /** Altura atual da viewport */
  height: number;
  
  /** Matches breakpoint específico */
  matches: (breakpoint: Breakpoint) => boolean;
}
```

---

## Contracts Summary

| Hook | Generic | Input | Output | Side Effects |
|------|---------|-------|--------|--------------|
| useEntityApi | ✅ T extends Entity | Options object | State + Mutations | API calls, cache |
| useForm | ✅ T extends object | Options object | State + Handlers | None |
| useModal | ❌ | Initial boolean | State + Controls | None |
| useToast | ❌ | None | Toast methods | DOM manipulation |
| useClipboard | ❌ | None | Clipboard methods | Browser API |
| useResponsive | ❌ | Breakpoint option | Breakpoint state | Window resize |

---

## Testing Contracts

### Test Requirements

Cada hook deve ter testes que verificam:

1. **useEntityApi**:
   - Query é chamada com queryKey correto
   - Cache funciona corretamente
   - Mutations invalidam cache
   - Erros são tratados
   - Loading states funcionam

2. **useForm**:
   - Estado inicial é setado corretamente
   - handleChange atualiza estado
   - Validação funciona
   - Submit é chamado com dados corretos
   - Reset funciona

3. **useModal**:
   - Estado inicial respeita parâmetro
   - open/close/toggle funcionam
   - Callbacks são chamados

4. **useToast**:
   - Toast é adicionado ao DOM
   - Duração é respeitada
   - Dismiss funciona

---

## Migration Path

### Para novos hooks

1. Criar arquivo em `src/hooks/useHookName.ts`
2. Definir interfaces Input/Output
3. Implementar hook
4. Criar testes em `src/hooks/__tests__/useHookName.test.ts`
5. Exportar em `src/hooks/index.ts`

### Para hooks existentes

1. Verificar se já segue contrato
2. Se não, refatorar para alinhar
3. Atualizar testes
4. Verificar todos os usos
