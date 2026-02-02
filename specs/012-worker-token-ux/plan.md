# Implementation Plan: Worker Token UX Improvements

**Branch**: `012-worker-token-ux` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-worker-token-ux/spec.md`

## Summary

Improve the worker token management experience in the frontend dashboard by implementing:
1. A dedicated modal to display tokens after worker registration with copy functionality
2. Token regeneration feature for existing workers with confirmation dialogs
3. "Show Token" option on worker cards with auto-hide security

This feature touches both **frontend** (React UI components) and **backend** (new endpoint for token regeneration).

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: 
- Frontend: React 18, Fluent UI v9, TanStack Query (React Query)
- Backend: NestJS, Prisma ORM
**Storage**: PostgreSQL (worker tokens stored in Worker entity)  
**Testing**: Jest (unit), Supertest (E2E)  
**Target Platform**: Web (modern browsers with Clipboard API support)
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Token copy action under 1 second with visual feedback  
**Constraints**: Clipboard API fallback required for older browsers  
**Scale/Scope**: Dashboard users managing 1-50 workers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Arquitetura Modular** | ✅ PASS | New components isolated in `features/workers/`, backend in `workers` module |
| **II. Padrões de Teste** | ✅ PASS | Unit tests for new components, E2E for regeneration endpoint |
| **III. Experiência do Usuário** | ✅ PASS | Feature is specifically about improving UX - modal feedback, copy confirmation |
| **IV. Escalabilidade** | ✅ PASS | Token regeneration is stateless, no blocking operations |
| **Sem any** | ✅ PASS | All new code will use proper TypeScript interfaces |
| **Sem Docker local** | ✅ PASS | No Docker required for this feature |

**Gate Result**: ✅ PASSED - No violations

## Project Structure

### Documentation (this feature)

```text
specs/012-worker-token-ux/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── workers/
│   │   ├── workers.controller.ts    # New: POST /workers/:id/regenerate-token
│   │   ├── workers.service.ts       # New: regenerateToken method
│   │   └── dto/
│   │       └── regenerate-token.dto.ts
│   └── prisma/
│       └── schema.prisma            # Worker entity (already exists)
└── test/
    └── workers.e2e-spec.ts          # Tests for token regeneration

frontend/
├── src/
│   ├── features/workers/
│   │   ├── WorkerList.tsx           # Modify: Use TokenModal instead of Toast
│   │   ├── WorkerCard.tsx           # Modify: Add Show Token and Regenerate buttons
│   │   ├── RegisterWorkerModal.tsx  # Existing (no changes needed)
│   │   ├── TokenModal.tsx           # NEW: Dedicated token display modal
│   │   ├── TokenDisplay.tsx         # NEW: Reusable token display with copy
│   │   ├── RegenerateTokenDialog.tsx # NEW: Confirmation dialog
│   │   └── api.ts                   # Modify: Add regenerateToken mutation
│   └── hooks/
│       └── useClipboard.ts          # NEW: Clipboard hook with fallback
└── tests/
    └── features/workers/
        └── TokenModal.spec.tsx      # Unit tests for modal
```

**Structure Decision**: Using existing web application structure. New components placed in `features/workers/` following the modular pattern already established.

## Complexity Tracking

> No violations to justify - all gates passed.
