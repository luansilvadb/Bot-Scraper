# Implementation Plan: Fix Token Input Visibility

**Branch**: `014-fix-token-input` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/014-fix-token-input/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The goal is to fix a UI regression in the Worker App where the token configuration input field is not appearing. The fix involves correcting the CSS layout within the `ConfigWindow` component to ensuring the form content renders correctly within the Fluent UI `Card` container, and standardizing the input component usage.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x (Worker App)
**Primary Dependencies**: `@fluentui/react-components` (UI), `electron` (Runtime)
**Storage**: Electron Store (via IPC) for config persistence
**Testing**: Manual UI verification
**Target Platform**: Windows (Electron Renderer)
**Project Type**: Web Application (running in Electron)
**Performance Goals**: Instant render (<50ms)
**Constraints**: Must match existing dark mode aesthetics; input must be accessible.
**Scale/Scope**: Small - Single component fix (`ConfigWindow.tsx`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Modular Architecture**: ✅ Fix is localized to `worker-app` UI component.
- **Testing**: ✅ Manual verification plan is sufficient for this UI hotfix.
- **UX**: ✅ Fixes a critical UX blocker (unable to configure).
- **Scalability**: ✅ UI-only change, does not affect backend scaling.
- **Tech Stack**: ✅ Uses existing React/Fluent stack.
- **Local Env**: ✅ Compatible with Node.js local dev.
- **Review Process**: ✅ Will follow PR process.

## Project Structure

### Documentation (this feature)

```text
specs/014-fix-token-input/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A)
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (N/A)
```

### Source Code (repository root)

```text
worker-app/src/
├── components/
│   ├── ConfigWindow.tsx   # Target component to fix
│   └── ConfigWindow.css   # Styles to update
└── App.tsx
```

**Structure Decision**: Modifying existing files in `worker-app/src/components`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       |            |                                     |
