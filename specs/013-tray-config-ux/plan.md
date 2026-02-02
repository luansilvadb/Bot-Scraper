# Implementation Plan: System Tray Configuration UX Premium

**Branch**: `013-tray-config-ux` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-tray-config-ux/spec.md`

## Summary

Redesign the worker-app tray window to integrate configuration UI directly, eliminating the separate centered configuration window. The design must be unified with the frontend dashboard (same colors, components, Fluent UI). Key improvements include:
- Configuration form embedded in tray popup (not separate window)
- Popup auto-hides on blur while worker continues running in background
- Smooth animated transitions between Status ↔ Config views
- Visual feedback for connection states (loading, success, error)
- Consistent visual identity with frontend dashboard

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js LTS  
**Primary Dependencies**: Electron 28+, React 18, Fluent UI v9, Vite  
**Storage**: electron-store (encrypted local config)  
**Testing**: Vitest for unit tests, Playwright for E2E  
**Target Platform**: Windows 10/11 (Electron desktop app)  
**Project Type**: Electron desktop application (worker-app)  
**Performance Goals**: 60fps animations, <300ms transitions  
**Constraints**: Popup auto-hide on blur, design unified with frontend dashboard  
**Scale/Scope**: Single-user desktop application, system tray integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Arquitetura Modular | ✅ | Components are modular (StatusView, ConfigView, TrayWindow) |
| II. Padrões de Teste | ⚠️ | Add unit tests for new components |
| III. Experiência do Usuário | ✅ | Primary focus of this feature |
| IV. Escalabilidade | N/A | Desktop app, not API |

**Gate Status**: ✅ PASS - All applicable principles satisfied or have justification

## Project Structure

### Documentation (this feature)

```text
specs/013-tray-config-ux/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (component state models)
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A (no API changes)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
worker-app/
├── electron/
│   ├── main.ts              # Main process, tray management
│   ├── tray.ts              # Tray icon and window positioning
│   ├── config-store.ts      # Encrypted configuration storage
│   └── types.ts             # Shared types
├── src/
│   ├── App.tsx              # Main React app (MODIFY)
│   ├── index.css            # Global styles (MODIFY - unify with frontend)
│   ├── components/
│   │   ├── StatusWindow.tsx     # Status view (MODIFY)
│   │   ├── StatusWindow.css     # Status styles
│   │   ├── ConfigWindow.tsx     # Config view (MAJOR REWRITE)
│   │   ├── ConfigWindow.css     # Config styles (MAJOR REWRITE)
│   │   ├── TrayContainer.tsx    # NEW: Container with view transitions
│   │   └── ViewTransition.tsx   # NEW: Animated transition wrapper
│   └── hooks/
│       └── useWorkerStatus.ts   # Worker status hook
└── tests/
    └── components/
        ├── TrayContainer.spec.ts  # NEW
        └── ConfigWindow.spec.ts   # NEW/UPDATE
```

### Design System Unification

```text
# Files to sync/reference from frontend
frontend/src/
├── index.css                # Color tokens, typography (REFERENCE)
└── features/workers/
    └── styles.css           # Component patterns (REFERENCE)

# Create shared tokens file
worker-app/src/
└── design-tokens.css        # NEW: Imported from frontend palette
```

**Structure Decision**: Electron desktop app with React renderer. Main changes in `worker-app/src/components/`. Will create shared design tokens synced with `frontend/src/index.css`.

## Complexity Tracking

> No constitution violations requiring justification.

| Aspect | Complexity | Rationale |
|--------|------------|-----------|
| View Transitions | Medium | CSS animations between Status ↔ Config |
| Blur Detection | Low | Electron `blur` event on BrowserWindow |
| Design Unification | Medium | Extract tokens from frontend, apply to worker-app |
| Tray Positioning | Already exists | Reuse existing tray window logic |
