# Research: CRUD Completo Fullstack

**Feature**: 006-fullstack-crud
**Date**: 2026-02-01
**Status**: Complete

## Summary

Esta feature não possui incertezas técnicas significativas (sem NEEDS CLARIFICATION). O contexto técnico foi extraído diretamente da análise do código existente e da constituição do projeto.

---

## 1. Padrões NestJS CRUD Existentes

### Decision
Seguir padrão já estabelecido no módulo `bots`:
- Controller com decorators `@Get()`, `@Post()`, `@Patch()`, `@Delete()`
- Service com métodos `create()`, `findAll()`, `findOne()`, `update()`, `remove()`
- DTOs usando types do Prisma (`Prisma.EntityCreateInput`, `Prisma.EntityUpdateInput`)

### Rationale
- Consistência com código existente
- Menos curva de aprendizado
- Reutilização de padrões testados

### Alternatives Considered
- **CQRS pattern**: Rejeitado - complexidade desnecessária para CRUD simples
- **Repository pattern**: Rejeitado - Prisma já abstrai acesso ao banco

---

## 2. DTOs e Validação

### Decision
Migrar de `Prisma.EntityCreateInput` para DTOs customizados com class-validator:
```typescript
class CreateBotDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsUrl()
  targetUrl: string;
  // ...
}
```

### Rationale
- Constituição exige validação amigável com class-validator
- DTOs permitem mensagens de erro customizadas
- Separa contrato de API do schema do banco
- Permite adicionar regras de negócio na validação

### Alternatives Considered
- **Manter Prisma types**: Rejeitado - não oferece validação em runtime
- **Zod schemas**: Rejeitado - projeto já usa class-validator

---

## 3. Paginação Backend

### Decision
Implementar paginação offset-based com query params:
```typescript
GET /bots?page=1&limit=10&sortBy=createdAt&order=desc
```

Response envelope:
```typescript
{
  data: T[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}
```

### Rationale
- Simples de implementar e consumir
- Adequado para volume esperado (< 10k registros)
- Padrão familiar para desenvolvedores frontend

### Alternatives Considered
- **Cursor-based pagination**: Rejeitado - complexidade desnecessária, sem necessidade de infinite scroll real-time
- **Sem paginação**: Rejeitado - constituição menciona performance, listar tudo seria lento

---

## 4. Frontend State Management

### Decision
Usar TanStack Query (react-query) para:
- Cache de dados
- Mutations com invalidação automática
- Loading/error states
- Refetch on focus

### Rationale
- Já instalado no projeto (`@tanstack/react-query`)
- Padrão moderno para data fetching
- Elimina necessidade de estado global para dados do servidor

### Alternatives Considered
- **Redux/Zustand**: Rejeitado - overkill para CRUD, react-query já resolve
- **Fetch manual + useState**: Rejeitado - muito código boilerplate

---

## 5. Componentes UI

### Decision
Usar Fluent UI React (@fluentui/react-components) para:
- Tables
- Forms (Input, Select, Button)
- Dialogs (confirmação)
- Toasts (notificações)

### Rationale
- Já instalado no projeto
- Design system consistente
- Componentes acessíveis por padrão

### Alternatives Considered
- **Componentes customizados**: Rejeitado - muito trabalho, Fluent UI já é premium
- **Material UI**: Rejeitado - projeto já usa Fluent

---

## 6. Estrutura de Componentes Frontend

### Decision
Organização feature-based com:
```
features/entity/
├── EntityList.tsx      # Página principal com tabela
├── EntityForm.tsx      # Formulário reutilizável (create/edit)
├── CreateEntityModal.tsx  # Modal de criação
├── EditEntityModal.tsx    # Modal de edição
└── api.ts              # Hooks react-query para a entidade
```

### Rationale
- Colocalização de código por domínio
- Reutilização de formulários entre criar/editar
- Separação clara de responsabilidades

### Alternatives Considered
- **Atomic design**: Rejeitado - estrutura atual já funciona bem
- **Pages + components separados**: Rejeitado - menos coeso

---

## 7. Tratamento de Erros

### Decision
Backend: Exceptions NestJS padronizadas (NotFoundException, BadRequestException)
Frontend: Toast notifications com mensagens amigáveis

### Rationale
- NestJS já transforma exceptions em respostas HTTP apropriadas
- Toasts são não-intrusivos e permitem retry

### Alternatives Considered
- **Error boundaries globais**: Manter apenas para erros críticos, CRUD usa toasts locais
- **Alert modals**: Rejeitado - muito intrusivo para operações frequentes

---

## Resolved Unknowns

| Unknown | Resolution |
|---------|------------|
| Framework patterns | Seguir padrões existentes do projeto |
| Validation approach | class-validator com DTOs customizados |
| Pagination style | Offset-based com meta envelope |
| State management | TanStack Query para server state |
| UI components | Fluent UI React |
| Error handling | Toasts + NestJS exceptions |

**Status**: ✅ All technical decisions made. Ready for Phase 1.
