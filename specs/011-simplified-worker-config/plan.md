# Implementation Plan: Simplified Worker Configuration

**Branch**: `011-simplified-worker-config` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-simplified-worker-config/spec.md`

## Summary

Simplify the worker configuration experience by removing the server URL input field from the UI and using environment variables to inject the URL at build time. The user-facing configuration form will only require a Token, reducing onboarding friction and eliminating URL-related support requests.

**Technical Approach**: 
1. Create `.env.development` and `.env.production` files with `VITE_SERVER_URL`
2. Modify the configuration service to read URL from `import.meta.env` instead of user input
3. Simplify the React ConfigWindow component to remove the URL field
4. Update the WorkerConfig type to reflect the new flow

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode)  
**Primary Dependencies**: Electron 40+, Vite 7+, React 18, Fluent UI 9, electron-store 8  
**Storage**: electron-store (encrypted local JSON)  
**Testing**: Manual validation (Electron app)  
**Target Platform**: Windows 10/11 (x64)  
**Project Type**: Desktop application (Electron + Vite + React)  
**Performance Goals**: Configuration completion < 30 seconds  
**Constraints**: No Docker, native Windows execution  
**Scale/Scope**: Single-user desktop application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Arquitetura Modular e Tipagem | ✅ PASS | Using TypeScript strict mode, types defined in `types.ts` |
| II. Padrões de Teste | ⚠️ N/A | Desktop app - manual testing is acceptable for MVP |
| III. Experiência do Usuário | ✅ PASS | Simplifying UX from 2 fields to 1 required field |
| IV. Escalabilidade e Assincronia | ✅ PASS | No blocking operations added |

**Gate Result**: ✅ PASSED - No violations detected

## Project Structure

### Documentation (this feature)

```text
specs/011-simplified-worker-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
worker-app/
├── .env.development         # NEW: Development environment variables
├── .env.production          # NEW: Production environment variables
├── .env.example             # NEW: Template for environment setup
├── electron/
│   ├── types.ts             # MODIFY: Update WorkerConfig type
│   ├── services/
│   │   └── config-store.ts  # MODIFY: Read URL from env
│   └── ipc-handlers.ts      # MODIFY: Update validation logic
└── src/
    └── components/
        └── ConfigWindow.tsx # MODIFY: Remove URL field from form
```

**Structure Decision**: Minimal changes to existing Electron desktop app structure. Only configuration-related files are modified.

## Complexity Tracking

> No violations detected - table not required.
