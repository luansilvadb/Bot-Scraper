# Quickstart: Frontend Architecture Refactoring

**Date**: 2025-02-08  
**Feature**: 020-frontend-refactor

## Como Usar Hooks Reutilizáveis

### useEntityApi - CRUD Completo

#### Criando uma tela de listagem

```typescript
import { useEntityApi } from '@/hooks/useEntityApi';
import type { Worker } from '@/types/entities';
import { DataTable } from '@/components/DataTable';
import { CardSkeleton } from '@/components/CardSkeleton';

function WorkersPage() {
  const { data, isLoading, isError, create, update, remove } = useEntityApi<Worker>({
    endpoint: '/workers',
    queryKey: ['workers'],
  });

  if (isLoading) return <CardSkeleton count={5} />;
  if (isError) return <ErrorState message="Erro ao carregar workers" />;

  return (
    <DataTable
      items={data || []}
      renderItem={(worker) => <WorkerRow worker={worker} />}
      keyExtractor={(worker) => worker.id}
    />
  );
}
```

#### Criando um formulário com create/update

```typescript
import { useEntityApi } from '@/hooks/useEntityApi';
import type { Bot } from '@/types/entities';

function BotForm({ bot }: { bot?: Bot }) {
  const { create, update } = useEntityApi<Bot>({
    endpoint: '/bots',
    queryKey: ['bots'],
  });

  const handleSubmit = async (data: BotFormData) => {
    if (bot) {
      // Update
      await update.mutateAsync({ id: bot.id, data });
    } else {
      // Create
      await create.mutateAsync(data);
    }
  };

  return <Form onSubmit={handleSubmit} initialData={bot} />;
}
```

### useForm - Gerenciamento de Formulários

#### Formulário simples

```typescript
import { useForm } from '@/hooks/useForm';

interface SettingsFormData {
  apiUrl: string;
  timeout: number;
}

function SettingsForm() {
  const { formData, errors, handleChange, handleSubmit, isSubmitting } = useForm<SettingsFormData>({
    initialData: { apiUrl: '', timeout: 30 },
    validate: (data) => {
      const errors: FormErrors<SettingsFormData> = {};
      if (!data.apiUrl) errors.apiUrl = 'URL é obrigatória';
      if (data.timeout < 1) errors.timeout = 'Timeout deve ser maior que 0';
      return errors;
    },
    onSubmit: async (data) => {
      await saveSettings(data);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FluentInput
        label="API URL"
        value={formData.apiUrl}
        onChange={(e) => handleChange('apiUrl', e.target.value)}
        error={errors.apiUrl}
      />
      
      <FluentInput
        label="Timeout (segundos)"
        type="number"
        value={formData.timeout}
        onChange={(e) => handleChange('timeout', Number(e.target.value))}
        error={errors.timeout}
      />

      <FluentButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </FluentButton>
    </form>
  );
}
```

#### Formulário em modal

```typescript
import { useForm } from '@/hooks/useForm';
import { useModal } from '@/hooks/useModal';
import { FormModal } from '@/components/FormModal';

function CreateProductModal() {
  const modal = useModal();
  const { formData, errors, handleChange, handleSubmit, isSubmitting, reset } = useForm<ProductFormData>({
    initialData: { name: '', price: 0 },
    onSubmit: async (data) => {
      await createProduct(data);
      modal.close();
      reset();
    },
  });

  return (
    <FormModal
      isOpen={modal.isOpen}
      onClose={() => {
        modal.close();
        reset();
      }}
      title="Criar Produto"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FluentInput
        label="Nome"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
      />
    </FormModal>
  );
}
```

### useModal - Controle de Modais

```typescript
import { useModal } from '@/hooks/useModal';
import { FormModal } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

function WorkerActions({ worker }: { worker: Worker }) {
  const editModal = useModal();
  const deleteModal = useModal();

  return (
    <>
      <FluentButton onClick={editModal.open}>Editar</FluentButton>
      <FluentButton onClick={deleteModal.open} appearance="danger">
        Excluir
      </FluentButton>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Editar Worker"
      >
        <WorkerForm worker={worker} onClose={editModal.close} />
      </FormModal>

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={() => deleteWorker(worker.id)}
        title="Confirmar Exclusão"
        message={`Deseja excluir ${worker.name}?`}
      />
    </>
  );
}
```

### useToast - Notificações

```typescript
import { useToast } from '@/hooks/useToast';
import { useEntityApi } from '@/hooks/useEntityApi';

function CreateWorkerPage() {
  const toast = useToast();
  const { create } = useEntityApi<Worker>({
    endpoint: '/workers',
    queryKey: ['workers'],
  });

  const handleSubmit = async (data: WorkerFormData) => {
    try {
      await create.mutateAsync(data);
      toast.success('Worker criado com sucesso!', {
        duration: 3000,
        onClose: () => console.log('Toast fechado'),
      });
    } catch (error) {
      toast.error('Erro ao criar worker: ' + error.message);
    }
  };

  return <WorkerForm onSubmit={handleSubmit} />;
}
```

---

## Como Usar Componentes Genéricos

### FormModal

```typescript
import { FormModal } from '@/components/FormModal';
import { useForm } from '@/hooks/useForm';

function CreateBotModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { formData, errors, handleChange, handleSubmit, isSubmitting } = useForm<BotFormData>({
    initialData: { name: '', description: '', schedule: '' },
    onSubmit: async (data) => {
      await createBot(data);
      onClose();
    },
  });

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Bot"
      size="large"
      submitLabel="Criar"
      cancelLabel="Cancelar"
      isSubmitting={isSubmitting}
      isValid={Object.keys(errors).length === 0}
    >
      <FormSection title="Informações Básicas">
        <FluentInput
          label="Nome"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />
        <FluentInput
          label="Descrição"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
        />
      </FormSection>
    </FormModal>
  );
}
```

### CardSkeleton

```typescript
import { CardSkeleton } from '@/components/CardSkeleton';

function ProductsPage() {
  const { data, isLoading } = useEntityApi<Product>({
    endpoint: '/products',
    queryKey: ['products'],
  });

  if (isLoading) {
    return <CardSkeleton count={6} rows={3} showHeader showFooter />;
  }

  return <ProductGrid products={data || []} />;
}
```

### StatusBadge

```typescript
import { StatusBadge } from '@/components/StatusBadge';
import type { Worker } from '@/types/entities';

function WorkerCard({ worker }: { worker: Worker }) {
  const getStatusConfig = (status: Worker['status']) => {
    switch (status) {
      case 'CONNECTED':
        return { status: 'success', label: 'Conectado' };
      case 'DISCONNECTED':
        return { status: 'neutral', label: 'Desconectado' };
      case 'BLOCKED':
        return { status: 'error', label: 'Bloqueado' };
      default:
        return { status: 'warning', label: 'Desconhecido' };
    }
  };

  const config = getStatusConfig(worker.status);

  return (
    <Card>
      <CardHeader>
        <Text>{worker.name}</Text>
        <StatusBadge status={config.status} label={config.label} />
      </CardHeader>
    </Card>
  );
}
```

### FormSection

```typescript
import { FormSection } from '@/components/FormSection';

function ComplexForm() {
  return (
    <form>
      <FormSection 
        title="Configurações Básicas" 
        description="Configure as opções básicas do sistema"
        columns={2}
      >
        <FluentInput label="Nome" />
        <FluentInput label="Descrição" />
        <FluentSelect label="Tipo" options={[...]} />
        <FluentInput label="Valor" type="number" />
      </FormSection>

      <FormSection 
        title="Configurações Avançadas" 
        description="Opções avançadas para usuários experientes"
      >
        <FluentSwitch label="Habilitar logs" />
        <FluentInput label="Timeout" type="number" />
      </FormSection>
    </form>
  );
}
```

---

## Convenções de Código

### Import Order

```typescript
// 1. React/NestJS
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Third-party (agrupados por biblioteca)
import { Button, Input } from '@fluentui/react-components';
import { useToast } from '@/hooks/useToast';

// 3. Internal (paths absolutos)
import { api } from '@/lib/api';
import type { Worker } from '@/types/entities';

// 4. Relative (siblings last)
import { WorkerCard } from './WorkerCard';
```

### Nomenclatura

- **Hooks**: `use[Nome]` (ex: `useForm`, `useEntityApi`)
- **Componentes**: `PascalCase` (ex: `FormModal`, `StatusBadge`)
- **Tipos**: `PascalCase` (ex: `Worker`, `FormErrors`)
- **Interfaces**: `PascalCase` com sufixo quando necessário (ex: `WorkerProps`, `FormConfig`)
- **Funções utilitárias**: `camelCase` (ex: `formatDate`, `validateEmail`)

### Estrutura de Pastas

```
src/
├── components/          # Componentes genéricos reutilizáveis
│   ├── [ComponentName]/
│   │   ├── [ComponentName].tsx
│   │   ├── [ComponentName].test.tsx
│   │   └── index.ts
│   └── index.ts        # Barrel export
├── features/           # Módulos por feature
│   └── [featureName]/
│       ├── components/ # Componentes específicos da feature
│       ├── api.ts      # Chamadas API
│       └── index.ts
├── hooks/              # Hooks customizados
│   ├── use[Nome].ts
│   ├── __tests__/
│   │   └── use[Nome].test.ts
│   └── index.ts        # Barrel export
├── lib/               # Utilitários e configurações
│   ├── utils/         # Funções utilitárias
│   ├── api.ts         # Cliente Axios
│   └── theme-styles.ts
├── types/             # Tipos TypeScript
│   ├── entities.ts    # Entidades do sistema
│   ├── api.ts         # Tipos de API
│   ├── ui.ts          # Tipos de UI
│   └── index.ts       # Barrel export
└── test/              # Configuração de testes
    └── setup.ts
```

---

## Checklist de Qualidade

Antes de submeter código:

- [ ] Hook/componente segue contrato definido
- [ ] TypeScript strict mode - sem `any`
- [ ] Testes unitários escritos
- [ ] ESLint passando (`npm run lint`)
- [ ] Imports ordenados corretamente
- [ ] Tipos exportados em barrel
- [ ] Documentação atualizada (se necessário)
- [ ] Funciona em mobile e desktop

---

## Troubleshooting

### "Cannot find module '@/hooks/useX'"

Verifique se o hook está exportado em `src/hooks/index.ts`:

```typescript
export { useForm } from './useForm';
export { useModal } from './useModal';
// Adicione aqui
export { useX } from './useX';
```

### Erros de tipagem em useEntityApi

Verifique se a entidade estende `Entity`:

```typescript
import type { Entity } from '@/types/entities';

interface Worker extends Entity {
  // ... campos
}
```

### useForm não valida

Certifique-se de retornar o objeto de erros:

```typescript
validate: (data) => {
  const errors: FormErrors<FormData> = {}; // ✅ Criar objeto vazio
  if (!data.name) errors.name = 'Obrigatório';
  return errors; // ✅ Retornar objeto
}
```

---

## Exemplos Completos

Veja os arquivos existentes:

- `src/hooks/useForm.ts` - Formulários completos
- `src/components/FormModal/FormModal.tsx` - Modal genérico
- `src/features/workers/WorkerList.tsx` - Uso de useEntityApi

## Próximos Passos

1. Identificar padrão repetitivo em seu código
2. Verificar se já existe hook/componente genérico
3. Se não existir, considerar criar nova abstração
4. Sempre adicionar testes
5. Documentar no quickstart.md (se for padrão comum)
