# Implementation Plan: Frontend Architecture Refactoring

**Branch**: `019-frontend-refactor` | **Date**: 2025-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-frontend-refactor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor frontend architecture to reduce verbosity and increase logical density while maintaining code quality, readability, and security. This involves abstracting common component patterns, consolidating state management, and ensuring security standards are preserved throughout the refactoring process.

Primary requirements:
- Abstract common UI patterns into reusable components
- Simplify state management and reduce prop drilling
- Maintain TypeScript strict typing and security controls
- Reduce LoC by 15% while improving maintainability

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x
**Primary Dependencies**: 
- React + Vite (from AGENTS.md)
- Fluent UI (from AGENTS.md)
- React Query (implied from patterns)
- Axios (from AGENTS.md)
**Storage**: N/A (Frontend only)
**Testing**: Vitest/Jest with React Testing Library (from AGENTS.md patterns)
**Target Platform**: Web browser (Chrome, Firefox, Safari, Edge)
**Project Type**: web (Frontend + Backend architecture detected)
**Performance Goals**: Bundle size increase <5%, maintain 60fps interactions
**Constraints**: 
- Must maintain TypeScript strict mode (no `any` types)
- Must preserve all security controls (XSS, input sanitization)
- Must maintain 80%+ test coverage on new abstractions
**Scale/Scope**: Single-page application with modular feature structure

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on Constitution v1.1.0:

### Gate I: Arquitetura Modular e Tipagem ✓
- **Status**: PASS
- **Evidence**: Project uses TypeScript strict mode, feature-based folder structure exists
- **Action Required**: Ensure refactored components maintain strict typing (no `any`)

### Gate II: Padrões de Teste ✓
- **Status**: PASS
- **Evidence**: AGENTS.md specifies test commands (`npm test`, `npm run test:watch`)
- **Action Required**: All new abstractions require unit tests with 80%+ coverage

### Gate III: Experiência do Usuário e Consistência ✓
- **Status**: PASS
- **Evidence**: Fluent UI provides consistent design system, Axios interceptors for error handling
- **Action Required**: Maintain existing error handling patterns

### Gate IV: Escalabilidade e Assincronia ✓
- **Status**: PASS
- **Evidence**: React Query for async state, BullMQ workers for backend (per Constitution)
- **Action Required**: Ensure frontend state management scales with feature growth

## Project Structure

### Documentation (this feature)

```text
specs/019-frontend-refactor/
├── plan.md          # This file (/speckit.plan command output)
├── research.md      # Phase 0 output (/speckit.plan command)
├── data-model.md    # Phase 1 output (/speckit.plan command)
├── quickstart.md    # Phase 1 output (/speckit.plan command)
├── contracts/       # Phase 1 output (/speckit.plan command)
└── tasks.md         # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/     # Reusable UI components (to be refactored)
│   ├── features/       # Feature-based modules
│   ├── hooks/          # Custom React hooks (to be consolidated)
│   ├── lib/            # API layer and utilities
│   ├── contexts/       # React contexts for state management
│   └── styles/         # Fluent UI styling
├── tests/
│   ├── unit/           # Component and hook tests
│   └── integration/    # Integration tests
└── package.json

backend/
├── src/
│   └── ... (unchanged by this feature)
```

**Structure Decision**: Web application with separate frontend/backend. Frontend follows feature-based organization per AGENTS.md. Refactoring focuses on `frontend/src/components/` and `frontend/src/hooks/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. All gates pass.

## Phase 0: Research ✓ COMPLETE

### Research Summary

All research tasks completed. See `research.md` for detailed findings.

**Key Findings**:
- **7 duplication patterns** identified (forms, modals, toasts, skeletons, sections, status badges, API hooks)
- **Baseline LoC**: 7,747 lines across 63 files
- **Estimated savings**: 1,330 lines (18% reduction, exceeds 15% target)
- **Prop drilling**: Minimal issues found, no Context API changes needed
- **3 new hooks** to create: useForm, useModal, useEntityApi
- **4 new components** to create: FormModal, FormSection, CardSkeleton, StatusBadge

**Status**: ✓ All NEEDS CLARIFICATION resolved

## Phase 1: Design ✓ COMPLETE

### Data Model (data-model.md) ✓

**Status**: Complete

**Entities Defined**:
- **ReusableComponent**: Component abstraction entity with props, composition, and test requirements
- **CustomHook**: Hook entity with 3 concrete implementations (useForm, useModal, useEntityApi)
- **StateContainer**: State management scope definitions

**Key Hooks Defined**:
1. `useForm<T>` - Centralized form state management (~400 lines saved)
2. `useModal<T>` - Standardized modal state (~150 lines saved)
3. `useEntityApi<T>` - Factory for CRUD operations (~300 lines saved)

**Key Components Defined**:
1. `FormModal` - Standardized modal wrapper (~150 lines saved)
2. `FormSection` - Reusable form section (~80 lines saved)
3. `CardSkeleton` - Loading skeleton for cards (~100 lines saved)
4. `StatusBadge` - Status indicator (~60 lines saved)

### API Contracts (contracts/)

**Status**: N/A - Frontend-only refactoring

No new API contracts required. Existing backend contracts unchanged.

### Quick Start (quickstart.md) ✓

**Status**: Complete

**Documentation Includes**:
- Hook usage examples (useForm, useModal, useEntityApi)
- Component usage examples (FormModal, FormSection, CardSkeleton, StatusBadge)
- Migration examples (Before/After comparisons)
- Best practices and testing guidelines
- Troubleshooting guide

---

## Phase 1 Completion Summary

### Constitution Check Re-evaluation

**Status**: ✓ All gates still passing

Post-design review confirms:
- **Gate I (Type Safety)**: All abstractions strictly typed, no `any` introduced
- **Gate II (Testing)**: Test coverage requirements defined for all abstractions
- **Gate III (UX)**: Security controls preserved, Fluent UI patterns maintained
- **Gate IV (Scalability)**: Factory patterns support horizontal feature growth

### Generated Artifacts

| Artifact | Status | Path |
|----------|--------|------|
| Implementation Plan | ✓ Complete | `specs/019-frontend-refactor/plan.md` |
| Research Document | ✓ Complete | `specs/019-frontend-refactor/research.md` |
| Data Model | ✓ Complete | `specs/019-frontend-refactor/data-model.md` |
| Quick Start Guide | ✓ Complete | `specs/019-frontend-refactor/quickstart.md` |
| Tasks Breakdown | ✓ Complete | `specs/019-frontend-refactor/tasks.md` |
| API Contracts | N/A | No contracts needed (frontend-only) |

### Implementation Plan Status

**Phase 0 (Research)**: ✓ COMPLETE
- All unknowns resolved
- Baseline metrics established (7,747 LoC)
- 7 duplication patterns identified

**Phase 1 (Design)**: ✓ COMPLETE
- Data model defined with entity relationships
- 3 custom hooks specified with TypeScript interfaces
- 4 reusable components designed
- Quick start guide created

**Phase 2 (Tasks)**: ✓ COMPLETE
- Task breakdown generated in `tasks.md`
- 12 implementation tasks defined across 4 categories
- Dependencies mapped, timelines estimated
- Risk assessment completed

---

## Plan Completion Summary

All phases of the planning workflow have been completed successfully.

### Phases Completed

| Phase | Status | Artifacts |
|-------|--------|-----------|
| Phase 0: Research | ✓ Complete | `research.md` - 7 patterns identified, baseline established |
| Phase 1: Design | ✓ Complete | `data-model.md`, `quickstart.md` - entities & usage defined |
| Phase 2: Tasks | ✓ Complete | `tasks.md` - 12 tasks across 4 categories |

### Key Metrics

- **Baseline LoC**: 7,747 lines
- **Target Reduction**: 15% (6,585 lines)
- **Estimated Savings**: 1,330 lines (18% reduction)
- **Tasks Created**: 12 implementation tasks
- **Estimated Timeline**: 3-4 weeks

### Agent Context

✓ AGENTS.md updated with new technologies:
- TypeScript 5.x + React 18.x + Fluent UI
- Custom hooks: useForm, useModal, useEntityApi
- Reusable components: FormModal, FormSection, CardSkeleton, StatusBadge

---

**Report**: All planning artifacts generated for branch `019-frontend-refactor`

**Ready for**: Implementation phase (tasks.md ready for execution)
