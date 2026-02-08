# Implementation Plan: Frontend Architecture Refactoring

**Branch**: `020-frontend-refactor` | **Date**: 2025-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/speckit.specify "Refatorar arquitetura frontend para reduzir verbosidade e aumentar densidade lógica"`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refatorar a arquitetura frontend do Bot-Scraper para reduzir verbosidade, eliminar redundâncias e aumentar a densidade lógica através da criação de hooks reutilizáveis, componentes genéricos e consolidação de utilitários. O objetivo é alcançar 15%+ redução em LoC mantendo 100% de cobertura de tipos e testes.

## Technical Context

**Language/Version**: TypeScript 5.9.3 (strict mode)
**Primary Dependencies**: React 19.2.0, Fluent UI React Components 9.72.11, TanStack React Query 5.90.20, React Router DOM 7.13.0, Axios 1.13.4, Vite 7.2.4
**Storage**: N/A (frontend consome API NestJS backend)
**Testing**: Vitest 4.0.18 com Testing Library (Jest DOM, React, User Event), jsdom
**Target Platform**: Web browser (Chrome, Firefox, Edge, Safari modernos)
**Project Type**: Web application (React SPA)
**Performance Goals**: Build time < 30s, bundle size otimizado, Lighthouse score > 90
**Constraints**: Manter compatibilidade com React 19, Fluent UI v9, sem quebrar APIs existentes
**Scale/Scope**: Frontend codebase (~90 arquivos TypeScript/React), refatoração focada em /frontend/src

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Arquitetura Modular e Tipagem | ✅ PASS | Frontend já organizado em features, TypeScript strict mode ativo |
| II. Padrões de Teste | ✅ PASS | Vitest configurado, testes existentes para hooks e componentes |
| III. Experiência do Usuário e Consistência | ✅ PASS | Fluent UI padronizado, componentes reutilizáveis existentes |
| IV. Escalabilidade e Assincronia | ✅ PASS | React Query para cache/state remoto, arquitetura stateless |

**Gate Result**: ✅ **PASSED** - Nenhuma violação identificada. Refatoração mantém princípios constitucionais.

## Project Structure

### Documentation (this feature)

```text
specs/020-frontend-refactor/
├── plan.md                    # This file (/speckit.plan command output)
├── research.md                # Phase 0 output (padrões identificados, decisões técnicas)
├── data-model.md              # Phase 1 output (tipos e interfaces consolidadas)
├── quickstart.md              # Phase 1 output (como usar novas abstrações)
├── contracts/                 # Phase 1 output (interfaces e contratos de hooks/componentes)
└── tasks.md                   # Phase 2 output (tarefas de implementação)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/             # Componentes genéricos reutilizáveis
│   │   ├── common/            # FluentButton, FluentInput, FluentAvatar, etc.
│   │   ├── layout/            # AppShell, AppBar, MainStage, etc.
│   │   ├── ui/                # Componentes de UI auxiliares
│   │   ├── FormModal/         # Modal genérico para formulários
│   │   ├── FormSection/       # Seção de formulário reutilizável
│   │   ├── CardSkeleton/      # Skeleton para cards
│   │   ├── StatusBadge/       # Badge de status
│   │   ├── DataTable/         # Tabela de dados
│   │   └── ConfirmDialog/     # Diálogo de confirmação
│   ├── features/              # Módulos por feature
│   │   ├── workers/           # Gerenciamento de workers
│   │   ├── bots/              # Gerenciamento de bots
│   │   ├── products/            # Produtos
│   │   ├── settings/          # Configurações
│   │   ├── approval/          # Aprovação
│   │   └── dashboard/         # Dashboard
│   ├── hooks/                 # Hooks customizados reutilizáveis
│   │   ├── useForm.ts         # Hook para gerenciamento de formulários
│   │   ├── useModal.ts        # Hook para controle de modais
│   │   ├── useEntityApi.ts    # Hook para chamadas API de entidades
│   │   ├── useToast.tsx       # Hook para notificações toast
│   │   ├── useResponsive.ts    # Hook para responsividade
│   │   └── useClipboard.ts    # Hook para clipboard
│   ├── lib/                   # Utilitários e configurações
│   │   ├── api.ts             # Cliente Axios configurado
│   │   ├── theme-styles.ts    # Estilos de tema Fluent UI
│   │   └── avatar-colors.ts   # Cores para avatares
│   ├── context/               # Contextos React
│   │   ├── ThemeContext.tsx    # Contexto de tema
│   │   └── theme-utils.ts     # Utilitários de tema
│   ├── styles/                # Configurações de estilo
│   │   ├── theme.ts           # Tema Fluent UI
│   │   └── designTokens.ts    # Tokens de design
│   ├── types/                 # Tipos TypeScript globais
│   │   ├── index.ts           # Exportações de tipos
│   │   └── fluent-ui.ts       # Tipos específicos Fluent UI
│   ├── test/                  # Configuração de testes
│   │   └── setup.ts           # Setup do Vitest
│   ├── App.tsx                # Componente raiz
│   └── main.tsx               # Ponto de entrada
├── package.json               # Dependências e scripts
├── vite.config.ts             # Configuração Vite
└── vitest.config.ts           # Configuração Vitest
```

**Structure Decision**: Estrutura já modularizada por features, com componentes genéricos em `/components/`. A refatoração irá expandir `/hooks/` e consolidar utilitários em `/lib/`.

## Complexity Tracking

> **No violations requiring justification**

## Phase 0: Research & Pattern Identification

### Technical Unknowns Resolved

1. **Quais padrões repetitivos existem no frontend atual?**
   - Formulários com lógica similar (validação, submit, estado)
   - Chamadas API duplicadas em diferentes features
   - Modais com estrutura similar
   - Manipulação de estado de loading/error

2. **Quais abstrações já existem e podem ser expandidas?**
   - `useForm` já existe e está sendo usado em múltiplos lugares
   - `useModal`, `useEntityApi`, `useToast` existentes
   - Componentes genéricos: `FormModal`, `FormSection`, `CardSkeleton`, `StatusBadge`

3. **Quais áreas precisam de novas abstrações?**
   - Hooks para operações CRUD padronizadas
   - Componentes para listas paginadas
   - Utilitários para validação de formulários
   - Funções utilitárias espalhadas (ex: formatação, transformação de dados)

### Research Artifacts

Ver arquivo `research.md` gerado na Phase 0.

## Phase 1: Design & Contracts

### Data Model Consolidation

Ver arquivo `data-model.md` para:
- Interfaces reutilizáveis extraídas
- Tipos genéricos consolidados
- Contratos entre hooks e componentes

### API Contracts

Ver diretório `/contracts/` para:
- Contratos de hooks (entradas/saídas)
- Props de componentes genéricos
- Interfaces de serviços utilitários

### Quickstart Guide

Ver arquivo `quickstart.md` para:
- Como usar novos hooks reutilizáveis
- Como importar componentes genéricos
- Convenções de código atualizadas

### Agent Context Update

Após design, executar:
```bash
.specify/scripts/powershell/update-agent-context.ps1 -AgentType opencode
```

---

## Next Steps

1. ✅ **Constitution Check**: Passou
2. ⏳ **Phase 0**: Gerar `research.md` com análise de padrões
3. ⏳ **Phase 1**: Gerar `data-model.md`, `/contracts/`, `quickstart.md`
4. ⏳ **Phase 1**: Atualizar contexto do agente
5. ⏳ **Phase 1**: Re-evaluar Constitution Check
6. ⏳ **Phase 2**: Aguardar `/speckit.tasks` para criar tasks.md

**Status**: Pronto para execução das fases 0 e 1.
