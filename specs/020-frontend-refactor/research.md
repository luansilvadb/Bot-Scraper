# Research: Frontend Architecture Refactoring

**Date**: 2025-02-08  
**Feature**: 020-frontend-refactor  
**Purpose**: Identificar padrões redundantes e decisões técnicas para refatoração

## Pattern Analysis

### Patterns Already Abstracted (Existing Hooks/Components)

| Pattern | Location | Usage Count | Status |
|---------|----------|-------------|--------|
| `useForm` | `src/hooks/useForm.ts` | Multiple forms | ✅ Already abstracted |
| `useModal` | `src/hooks/useModal.ts` | Multiple modals | ✅ Already abstracted |
| `useEntityApi` | `src/hooks/useEntityApi.ts` | API calls | ✅ Already abstracted |
| `useToast` | `src/hooks/useToast.tsx` | Notifications | ✅ Already abstracted |
| `FormModal` | `src/components/FormModal/` | Create/Edit modals | ✅ Already abstracted |
| `FormSection` | `src/components/FormSection/` | Form sections | ✅ Already abstracted |
| `CardSkeleton` | `src/components/CardSkeleton/` | Loading states | ✅ Already abstracted |
| `StatusBadge` | `src/components/StatusBadge/` | Status displays | ✅ Already abstracted |

### Patterns to Abstract (Redundancies Identified)

#### PATTERN-001: CRUD Operations Boilerplate

**Problem**: Cada feature (workers, bots, products, settings) implementa própria lógica CRUD repetitiva.

**Locations Found**:
- `src/features/workers/api.ts` - CRUD workers
- `src/features/bots/api.ts` - CRUD bots
- `src/features/products/api.ts` - CRUD products
- `src/features/settings/api.ts` - CRUD settings

**Decision**: Expandir `useEntityApi` para cobrir todos os casos CRUD padrão

**Rationale**: Consistência e redução de código duplicado

---

#### PATTERN-002: Modal Management Duplication

**Problem**: Múltiplos modais (CreateBotModal, EditBotModal, CreateSettingModal) com lógica similar de abertura/fechamento e estado.

**Locations Found**:
- `src/features/bots/CreateBotModal.tsx`
- `src/features/bots/EditBotModal.tsx`
- `src/features/settings/CreateSettingModal.tsx`

**Decision**: Refatorar para usar `useModal` + `FormModal` genérico

**Rationale**: Hooks existentes podem ser aproveitados com melhor composição

---

#### PATTERN-003: Loading/Error State Handling

**Problem**: Estados de loading e error são tratados de forma inconsistente em diferentes componentes.

**Decision**: Criar hook `useAsyncState` ou expandir padrões do React Query

**Rationale**: React Query já gerencia estados assíncronos - padronizar uso

---

#### PATTERN-004: Utility Functions Scattered

**Problem**: Funções utilitárias espalhadas sem organização central.

**Locations Found**:
- `src/lib/avatar-colors.ts` - cores de avatar
- `src/lib/theme-styles.ts` - estilos de tema
- `src/context/theme-utils.ts` - utilitários de tema

**Decision**: Consolidar em `src/lib/utils/` com barrel exports

---

#### PATTERN-005: Type Definitions Duplicated

**Problem**: Interfaces de entidades definidas em múltiplos lugares.

**Locations Found**:
- Tipos em `src/types/index.ts`
- Tipos em features individuais
- Tipos em componentes

**Decision**: Centralizar tipos de entidades em `src/types/entities.ts`

---

## Technical Decisions

### Decision 1: Keep Existing Abstractions

**Choice**: Manter e expandir hooks/componentes já existentes (useForm, useModal, etc.)

**Rationale**: Não reinventar - os hooks existentes são bem desenhados e tipados

**Alternatives Considered**:
- ❌ Criar novos hooks do zero - rejeitado: código existente já é bom
- ✅ Expandir hooks existentes - aceito: aproveita investimento anterior

---

### Decision 2: React Query as State Manager

**Choice**: Usar React Query para todo estado remoto/server

**Rationale**: Já está no projeto, melhora performance com cache, reduz código boilerplate

**Implementation**:
- Expandir uso de `useEntityApi` para todas as entidades
- Remover estados locais redundantes para dados da API

---

### Decision 3: Barrel Exports Pattern

**Choice**: Usar barrel exports (`index.ts`) para facilitar imports

**Rationale**: Já parcialmente implementado, apenas expandir

**Implementation**:
- `src/hooks/index.ts` ✅ Já existe
- `src/components/index.ts` ✅ Já existe
- Expandir para `src/lib/utils/index.ts`

---

### Decision 4: Component Composition over Configuration

**Choice**: Preferir composição de componentes ao invés de props excessivas

**Rationale**: Mais alinhado com React, mais flexível, tipagem mais forte

**Example**:
```tsx
// Instead of:
<DataTable columns={...} data={...} onEdit={...} onDelete={...} />

// Prefer:
<DataTable>
  <DataTable.Columns>{...}</DataTable.Columns>
  <DataTable.Rows>{...}</DataTable.Rows>
</DataTable>
```

---

## Refactoring Targets

### High Impact (P1)

1. **Consolidate API hooks** - Expandir `useEntityApi` para todas as entidades
   - Estimated LoC reduction: 200-300 lines
   - Files affected: api.ts em cada feature

2. **Generic Modal Pattern** - Usar `FormModal` em todos os Create/Edit modals
   - Estimated LoC reduction: 150-200 lines
   - Files affected: CreateBotModal, EditBotModal, CreateSettingModal

### Medium Impact (P2)

3. **Centralize Utilities** - Consolidar funções utilitárias
   - Estimated LoC reduction: 50-100 lines
   - Files affected: lib/*, context/theme-utils.ts

4. **Extract Common Types** - Centralizar tipos de entidades
   - Estimated LoC reduction: 100-150 lines
   - Files affected: types/index.ts, feature types

### Low Impact (P3)

5. **Optimize Component Structure** - Reduzir nesting excessivo
   - Estimated LoC reduction: 50-80 lines
   - Files affected: layouts, pages

---

## Success Metrics Alignment

| Success Criterion | Research Finding | Feasibility |
|-------------------|------------------|-------------|
| SC-001: 15%+ LoC reduction | Total possible: 550-830 lines | ✅ Achievable |
| SC-002: 5+ patterns abstracted | 5 patterns identified above | ✅ Achievable |
| SC-003: 30% tree depth reduction | Requires component restructuring | ✅ Achievable |
| SC-004: 80% utility consolidation | 3 utility files to consolidate | ✅ Achievable |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes in existing components | High | Incremental refactoring with tests |
| TypeScript strictness conflicts | Medium | Validate types after each change |
| Test coverage gaps | Medium | Run tests before/after each refactor |
| Bundle size increase | Low | Tree-shaking, dynamic imports |

---

## Conclusion

A base de código frontend do Bot-Scraper já possui boas abstrações iniciais (useForm, useModal, etc.). A refatoração deve focar em:

1. **Expandir abstrações existentes** em vez de criar novas
2. **Consolidar código repetitivo** em hooks e utilitários
3. **Padronizar padrões** já estabelecidos (React Query, Fluent UI)
4. **Manter 100% type safety** durante todo o processo

**Estimated Total Impact**: 15-20% LoC reduction, melhor manutenibilidade, código mais testável.

**Next Step**: Phase 1 - Gerar data-model.md com tipos e contratos consolidados.
