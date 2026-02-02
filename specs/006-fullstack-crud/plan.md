# Implementation Plan: CRUD Completo Fullstack

**Branch**: `006-fullstack-crud` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-fullstack-crud/spec.md`

## Summary

Implementação de operações CRUD completas para as 4 entidades do sistema (Bot, Proxy, ScrapedProduct, SystemSetting) tanto no backend (API REST NestJS) quanto no frontend (React + Vite). O backend já possui estrutura parcial de módulos; esta feature completa as operações faltantes e adiciona paginação, filtros e DTOs de validação. O frontend terá páginas de listagem, formulários de criação/edição e modais de confirmação para cada entidade.

## Technical Context

**Language/Version**: TypeScript 5.7+ (strict mode)
**Primary Dependencies**:
- Backend: NestJS 11, Prisma 6, class-validator, class-transformer
- Frontend: React 19, Vite 7, @tanstack/react-query, @fluentui/react-components, axios
**Storage**: PostgreSQL (via Prisma ORM)
**Testing**: Jest + Supertest (backend), Vitest (frontend - a adicionar se necessário)
**Target Platform**: Web (Windows dev, Linux/ARM64 prod)
**Project Type**: Web application (monorepo com backend/ e frontend/)
**Performance Goals**: Listagem < 2s para 1000 registros, CRUD operations < 30s user flow
**Constraints**: Sem Docker local, feedback visual 100%, responsivo 320-1920px
**Scale/Scope**: 4 entidades, ~16 endpoints REST, ~8 páginas/modais frontend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Requisito | Status | Notas |
|-----------|-----------|--------|-------|
| I. Arquitetura Modular | Módulos NestJS por domínio, DTOs obrigatórios | ✅ PASS | Módulos existentes (bots, proxy, products, settings) serão expandidos |
| I. Sem `any` | TypeScript strict, interfaces claras | ✅ PASS | DTOs tipados com class-validator |
| II. Testes Unitários | *.spec.ts para services | ⚠️ PENDING | Criar testes para novos services |
| II. Testes E2E | Supertest para endpoints críticos | ⚠️ PENDING | Adicionar testes E2E para CRUD |
| III. Resposta Padrão | Envelope de resposta consistente | ✅ PASS | Manter padrão atual |
| III. Validação Amigável | class-validator com mensagens claras | ✅ PASS | DTOs com decorators de validação |
| IV. Stateless | API sem estado para escalabilidade | ✅ PASS | Sem sessão, sem estado em memória |

**Gate Status**: ✅ PASSED (pendências de testes serão endereçadas nas tasks)

## Project Structure

### Documentation (this feature)

```text
specs/006-fullstack-crud/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── bots.yaml
│   ├── proxies.yaml
│   ├── products.yaml
│   └── settings.yaml
├── checklists/
│   └── requirements.md  # Specification checklist
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── common/
│   │   └── dto/                    # DTOs compartilhados (pagination, response)
│   ├── modules/
│   │   ├── bots/
│   │   │   ├── dto/                # CreateBotDto, UpdateBotDto, BotQueryDto
│   │   │   ├── bots.controller.ts  # Endpoints CRUD [EXPANDIR]
│   │   │   ├── bots.service.ts     # Lógica de negócio [EXPANDIR]
│   │   │   └── bots.module.ts
│   │   ├── proxy/
│   │   │   ├── dto/                # CreateProxyDto, UpdateProxyDto
│   │   │   ├── proxy.controller.ts # Endpoints CRUD [EXPANDIR]
│   │   │   ├── proxy.service.ts    # Lógica de negócio [EXPANDIR]
│   │   │   └── proxy.module.ts
│   │   ├── products/
│   │   │   ├── dto/                # ProductQueryDto, UpdateProductStatusDto
│   │   │   ├── products.controller.ts # Endpoints CRUD [CRIAR/EXPANDIR]
│   │   │   ├── products.service.ts    # Lógica de negócio [CRIAR/EXPANDIR]
│   │   │   └── products.module.ts
│   │   └── settings/
│   │       ├── dto/                # CreateSettingDto, UpdateSettingDto
│   │       ├── settings.controller.ts # Endpoints CRUD [EXPANDIR]
│   │       ├── settings.service.ts    # Lógica de negócio [EXPANDIR]
│   │       └── settings.module.ts
│   └── prisma/
└── test/
    └── e2e/                        # Testes E2E por módulo

frontend/
├── src/
│   ├── components/
│   │   ├── DataTable/              # Tabela reutilizável com paginação
│   │   ├── ConfirmDialog/          # Modal de confirmação
│   │   └── FormField/              # Campo de formulário reutilizável
│   ├── features/
│   │   ├── bots/
│   │   │   ├── BotList.tsx         # [EXPANDIR] Lista com ações
│   │   │   ├── BotForm.tsx         # [CRIAR] Formulário criar/editar
│   │   │   ├── CreateBotModal.tsx  # [EXPANDIR] Modal de criação
│   │   │   └── api.ts              # [CRIAR] Cliente API
│   │   ├── proxy/
│   │   │   ├── ProxyList.tsx       # [EXPANDIR]
│   │   │   ├── ProxyForm.tsx       # [CRIAR]
│   │   │   └── api.ts              # [CRIAR]
│   │   ├── products/               # [CRIAR PASTA]
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductCard.tsx     # Card com imagem do produto
│   │   │   └── api.ts
│   │   └── settings/
│   │       ├── SettingsList.tsx    # [EXPANDIR]
│   │       ├── SettingForm.tsx     # [CRIAR]
│   │       └── api.ts              # [CRIAR]
│   ├── lib/
│   │   └── api.ts                  # Cliente axios base
│   └── hooks/
│       └── useToast.ts             # Hook para notificações
└── tests/
```

**Structure Decision**: Segue estrutura existente de monorepo com backend NestJS modular e frontend React feature-based. Novos componentes serão adicionados dentro da estrutura existente.

## Complexity Tracking

> Nenhuma violação de constituição que necessite justificativa.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| N/A | - | - |
