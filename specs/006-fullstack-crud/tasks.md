# Tasks: CRUD Completo Fullstack

**Input**: Design documents from `/specs/006-fullstack-crud/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Constituição exige testes unitários e E2E. Testes serão incluídos nas tasks.

**Organization**: Tasks são agrupadas por user story para permitir implementação e teste independente de cada história.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story à qual a task pertence (US1, US2, US3, US4)
- Caminhos exatos de arquivos incluídos nas descrições

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`
- **Tests Backend**: `backend/test/`
- **Tests Frontend**: `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criação de DTOs base, componentes compartilhados e configuração

- [x] T001 Criar pasta de DTOs compartilhados em `backend/src/common/dto/`
- [x] T002 [P] Criar PaginationQueryDto em `backend/src/common/dto/pagination-query.dto.ts`
- [x] T003 [P] Criar PaginatedResponseDto em `backend/src/common/dto/paginated-response.dto.ts`
- [x] T004 [P] Criar componente DataTable reutilizável em `frontend/src/components/DataTable/DataTable.tsx`
- [x] T005 [P] Criar componente ConfirmDialog em `frontend/src/components/ConfirmDialog/ConfirmDialog.tsx`
- [x] T006 [P] Criar hook useToast para notificações em `frontend/src/hooks/useToast.tsx`
- [x] T007 [P] Configurar cliente axios base em `frontend/src/lib/api.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura que DEVE estar completa antes de qualquer user story

**⚠️ CRITICAL**: Nenhuma user story pode começar até esta fase estar completa

- [x] T008 Verificar ValidationPipe global está configurado em `backend/src/main.ts`
- [x] T009 [P] Criar interceptor de resposta padrão em `backend/src/common/interceptors/transform.interceptor.ts`
- [x] T010 [P] Criar filtro de exceção HTTP em `backend/src/common/filters/http-exception.filter.ts`
- [x] T011 Registrar interceptor e filtro no AppModule em `backend/src/app.module.ts`
- [x] T012 Configurar QueryClient do react-query em `frontend/src/main.tsx`

**Checkpoint**: Infraestrutura pronta - user stories podem ser implementadas

---

## Phase 3: User Story 1 - Gerenciar Bots (Priority: P1) 🎯 MVP

**Goal**: CRUD completo para Bots no backend e frontend

**Independent Test**: Criar bot via UI, verificar na lista, editar, excluir e confirmar remoção

### Backend - Bots

- [x] T013 [P] [US1] Criar CreateBotDto com validação em `backend/src/modules/bots/dto/create-bot.dto.ts`
- [x] T014 [P] [US1] Criar UpdateBotDto com validação em `backend/src/modules/bots/dto/update-bot.dto.ts`
- [x] T015 [P] [US1] Criar BotQueryDto para filtros em `backend/src/modules/bots/dto/query-bot.dto.ts`
- [x] T016 [US1] Expandir BotsService com paginação e filtros em `backend/src/modules/bots/bots.service.ts`
- [x] T017 [US1] Expandir BotsController com DTOs e query params em `backend/src/modules/bots/bots.controller.ts`
- [x] T018 [US1] Criar teste unitário do BotsService em `backend/src/modules/bots/bots.service.spec.ts`

### Frontend - Bots

- [x] T019 [P] [US1] Criar hooks de API para Bots em `frontend/src/features/bots/api.ts`
- [x] T020 [US1] Criar formulário BotForm reutilizável em `frontend/src/features/bots/BotForm.tsx`
- [x] T021 [US1] Expandir CreateBotModal com BotForm em `frontend/src/features/bots/CreateBotModal.tsx`
- [x] T022 [US1] Criar EditBotModal em `frontend/src/features/bots/EditBotModal.tsx`
- [x] T023 [US1] Expandir BotList com paginação, busca e ações em `frontend/src/features/bots/BotList.tsx`
- [x] T024 [US1] Adicionar feedback visual (loading/success/error) nos componentes de Bots

**Checkpoint**: User Story 1 completa e testável independentemente

---

## Phase 4: User Story 2 - Gerenciar Proxies (Priority: P2)

**Goal**: CRUD completo para Proxies no backend e frontend

**Independent Test**: Criar proxy via UI, verificar na lista, editar credenciais, excluir

### Backend - Proxies

- [x] T025 [P] [US2] Criar CreateProxyDto com validação em `backend/src/modules/proxy/dto/create-proxy.dto.ts`
- [x] T026 [P] [US2] Criar UpdateProxyDto com validação em `backend/src/modules/proxy/dto/update-proxy.dto.ts`
- [x] T027 [P] [US2] Criar ProxyQueryDto para filtros em `backend/src/modules/proxy/dto/query-proxy.dto.ts`
- [x] T028 [US2] Expandir ProxyService com paginação e filtros em `backend/src/modules/proxy/proxy.service.ts`
- [x] T029 [US2] Expandir ProxyController com DTOs e query params em `backend/src/modules/proxy/proxy.controller.ts`
- [x] T030 [US2] Criar teste unitário do ProxyService em `backend/src/modules/proxy/proxy.service.spec.ts`

### Frontend - Proxies

- [x] T031 [P] [US2] Criar hooks de API para Proxies em `frontend/src/features/proxy/api.ts`
- [x] T032 [US2] Criar formulário ProxyForm reutilizável em `frontend/src/features/proxy/ProxyForm.tsx`
- [x] T033 [US2] Criar CreateProxyModal em `frontend/src/features/proxy/CreateProxyModal.tsx`
- [x] T034 [US2] Criar EditProxyModal em `frontend/src/features/proxy/EditProxyModal.tsx`
- [x] T035 [US2] Expandir ProxyList com paginação, status e ações em `frontend/src/features/proxy/ProxyList.tsx`
- [x] T036 [US2] Adicionar feedback visual (loading/success/error) nos componentes de Proxies

**Checkpoint**: User Stories 1 e 2 completas e testáveis independentemente

---

## Phase 5: User Story 3 - Gerenciar Produtos (Priority: P3)

**Goal**: Visualização, aprovação, rejeição e exclusão de produtos scrapeados

**Independent Test**: Ver lista de produtos pendentes, aprovar/rejeitar, excluir

### Backend - Products

- [x] T037 [P] [US3] Criar CreateProductDto em `backend/src/modules/products/dto/create-product.dto.ts`
- [x] T038 [P] [US3] Criar UpdateProductDto em `backend/src/modules/products/dto/update-product.dto.ts`
- [x] T039 [P] [US3] Criar ProductQueryDto com filtros em `backend/src/modules/products/dto/query-product.dto.ts`
- [x] T040 [US3] Criar ProductsService com CRUD e paginação em `backend/src/modules/products/products.service.ts`
- [x] T041 [US3] Adicionar métodos approve() e reject() no ProductsService
- [x] T042 [US3] Criar ProductsController com endpoints CRUD em `backend/src/modules/products/products.controller.ts`
- [x] T043 [US3] Adicionar endpoints POST approve e reject no ProductsController
- [x] T044 [US3] Registrar ProductsModule no AppModule em `backend/src/app.module.ts`
- [x] T045 [US3] Criar teste unitário do ProductsService em `backend/src/modules/products/products.service.spec.ts`

### Frontend - Products

- [x] T046 [P] [US3] Criar pasta products em `frontend/src/features/products/`
- [x] T047 [P] [US3] Criar hooks de API para Products em `frontend/src/features/products/api.ts`
- [x] T048 [US3] Criar ProductCard com imagem e botões de ação em `frontend/src/features/products/ProductCard.tsx` (integrated in ProductList)
- [x] T049 [US3] Criar ProductList com grid/tabela em `frontend/src/features/products/ProductList.tsx`
- [x] T050 [US3] Adicionar filtros por status e botões de bulk approve/reject
- [x] T051 [US3] Adicionar feedback visual (loading/success/error) nos componentes de Products

**Checkpoint**: User Stories 1, 2 e 3 completas e testáveis independentemente

---

## Phase 6: User Story 4 - Gerenciar Configurações (Priority: P4)

**Goal**: Visualização e edição de configurações do sistema key-value

**Independent Test**: Ver lista de configs, editar valor existente, criar nova config

### Backend - Settings

- [x] T052 [P] [US4] Criar UpsertSettingDto em `backend/src/modules/settings/dto/upsert-setting.dto.ts`
- [x] T053 [P] [US4] Criar SettingQueryDto em `backend/src/modules/settings/dto/query-setting.dto.ts`
- [x] T054 [US4] Expandir SettingsService com CRUD e upsert em `backend/src/modules/settings/settings.service.ts`
- [x] T055 [US4] Expandir SettingsController com endpoints CRUD em `backend/src/modules/settings/settings.controller.ts`
- [x] T056 [US4] Criar teste unitário do SettingsService em `backend/src/modules/settings/settings.service.spec.ts`

### Frontend - Settings

- [x] T057 [P] [US4] Criar hooks de API para Settings em `frontend/src/features/settings/api.ts`
- [x] T058 [US4] Criar SettingForm para edição inline em `frontend/src/features/settings/SettingForm.tsx`
- [x] T059 [US4] Criar CreateSettingModal em `frontend/src/features/settings/CreateSettingModal.tsx`
- [x] T060 [US4] Expandir SettingsList com edição e ações em `frontend/src/features/settings/SettingsList.tsx`
- [x] T061 [US4] Adicionar feedback visual (loading/success/error) nos componentes de Settings

**Checkpoint**: Todas as 4 user stories completas e testáveis

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories

### Testes E2E

- [x] T062 [P] Criar teste E2E para Bots CRUD em `backend/test/bots.e2e-spec.ts`
- [x] T063 [P] Criar teste E2E para Proxies CRUD em `backend/test/proxies.e2e-spec.ts`
- [x] T064 [P] Criar teste E2E para Products CRUD em `backend/test/products.e2e-spec.ts`
- [x] T065 [P] Criar teste E2E para Settings CRUD em `backend/test/settings.e2e-spec.ts`

### Responsividade & UX

- [x] T066 [P] Verificar responsividade do DataTable em telas pequenas (320px)
- [x] T067 [P] Adicionar estados vazios (empty states) para listas sem itens
- [x] T068 [P] Garantir que modais funcionam em mobile

### Documentação & Cleanup

- [x] T069 Atualizar quickstart.md com exemplos reais após implementação
- [x] T070 Code cleanup - remover código morto e comentários
- [x] T071 Executar lint e format em todo o código modificado

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode começar imediatamente
- **Foundational (Phase 2)**: Depende de Setup - BLOQUEIA todas as user stories
- **User Stories (Phases 3-6)**: Todas dependem de Foundational
  - Podem ser executadas em paralelo (se houver equipe)
  - Ou sequencialmente na ordem de prioridade (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depende de todas as user stories desejadas

### User Story Dependencies

| Story | Depende de | Pode executar em paralelo com |
|-------|------------|-------------------------------|
| US1 - Bots | Phase 2 | US2, US3, US4 |
| US2 - Proxies | Phase 2 | US1, US3, US4 |
| US3 - Products | Phase 2 | US1, US2, US4 |
| US4 - Settings | Phase 2 | US1, US2, US3 |

### Within Each User Story

1. DTOs (paralelos) → Service → Controller → Tests
2. API hooks → Form → Modals → List → Feedback

---

## Parallel Opportunities

### Phase 1 (Setup)
```bash
# Executar em paralelo:
T002: PaginationQueryDto
T003: PaginatedResponseDto
T004: DataTable component
T005: ConfirmDialog component
T006: useToast hook
T007: api.ts base
```

### Phase 3 (User Story 1 - Bots)
```bash
# DTOs em paralelo:
T013: CreateBotDto
T014: UpdateBotDto
T015: BotQueryDto
T019: API hooks (frontend)

# Após DTOs:
T016 → T017 → T018 (sequencial no backend)
T020 → T021/T022 → T023 → T024 (sequencial no frontend)
```

### Parallel Teams
```bash
# Com múltiplos desenvolvedores após Phase 2:
Dev A: Phase 3 (US1 - Bots)
Dev B: Phase 4 (US2 - Proxies)
Dev C: Phase 5 (US3 - Products)
Dev D: Phase 6 (US4 - Settings)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational
3. ✅ Complete Phase 3: User Story 1 (Bots)
4. **STOP e VALIDAR**: Testar CRUD de Bots end-to-end
5. Deploy/demo se pronto - já tem valor!

### Incremental Delivery

1. Setup + Foundational → Infraestrutura pronta
2. + User Story 1 (Bots) → **MVP! Deploy possível**
3. + User Story 2 (Proxies) → Funcionalidade expandida
4. + User Story 3 (Products) → Curadoria de conteúdo
5. + User Story 4 (Settings) → Customização completa
6. + Polish → Produção-ready

---

## Summary

| Métrica | Valor |
|---------|-------|
| **Total de Tasks** | 71 |
| **Phase 1 (Setup)** | 7 tasks |
| **Phase 2 (Foundational)** | 5 tasks |
| **Phase 3 (US1 - Bots)** | 12 tasks |
| **Phase 4 (US2 - Proxies)** | 12 tasks |
| **Phase 5 (US3 - Products)** | 15 tasks |
| **Phase 6 (US4 - Settings)** | 10 tasks |
| **Phase 7 (Polish)** | 10 tasks |
| **Tasks paralelas [P]** | 31 (44%) |
| **MVP Scope** | Phases 1-3 (24 tasks) |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [US#] label mapeia task para user story específica
- Cada user story é completável e testável independentemente
- Commit após cada task ou grupo lógico
- Pare em qualquer checkpoint para validar a story
- Evite: tasks vagas, conflitos no mesmo arquivo, dependências cross-story
