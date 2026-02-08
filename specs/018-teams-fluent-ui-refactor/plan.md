# Implementation Plan: Teams-Style UI Refactor with Fluent UI v9

**Branch**: `018-teams-fluent-ui-refactor` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Refactor interface to imitate Microsoft Teams using Fluent UI v9 with App Shell, 3-column layout, and Teams theming.

## Summary

**Primary Requirement**: Refactor the existing React frontend to use Microsoft Fluent UI v9 components with a Teams-inspired 3-column layout (App Bar, List Pane, Main Stage). This is a UI-only refactor with no backend changes.

**Technical Approach**: 
- Replace native HTML elements with Fluent UI v9 components (Button, Input, Avatar, Persona)
- Implement Teams themes (teamsLightTheme, teamsDarkTheme) with auto/system preference detection
- Create responsive 3-column layout with breakpoints: desktop (3-col), tablet (collapsible), mobile (hamburger)
- Use makeStyles for CSS-in-JS with Fluent tokens
- Virtualize lists >100 items with @tanstack/react-virtual
- Maintain WCAG 2.1 AA accessibility and keyboard navigation

## Technical Context

**Language/Version**: TypeScript 5.9.3 with strict mode
**Primary Dependencies**: React 19.2.0, @fluentui/react-components 9.72.11, @fluentui/react-icons, @tanstack/react-virtual
**Storage**: localStorage (theme preference only) - no database changes
**Testing**: Vitest + React Testing Library, Playwright for E2E
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
**Project Type**: Web frontend (React + Vite)
**Performance Goals**: 60fps scrolling, <200ms initial load time, <500KB initial bundle
**Constraints**: <500KB bundle size (FR-020), 1000 contacts max (scale assumption), presentation layer only
**Scale/Scope**: Single user session, 1000 contacts/channels max, virtualize at 100+ items

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.* ✅ **PASSED**

**Code Quality**: Does this feature maintain strict TypeScript strict mode, explicit return types, and zero lint warnings?
- ✅ **YES**: All component interfaces defined in contracts/component-interfaces.ts with strict typing
- ✅ **Explicit return types** required on all public methods per CQ-001
- ✅ **Zero ESLint warnings** enforced per CQ-002 (npm run lint)

**Testing Standards**: Are tests planned for unit, integration, and contract coverage? Will they be written before implementation?
- ✅ **YES**: TDD approach per TS-001 (tests before implementation)
- ✅ **80%+ coverage** for critical paths per TS-002
- ✅ **Vitest + React Testing Library** for unit/integration, Playwright for E2E
- ✅ **CI gate**: All tests must pass before merge per TS-004

**User Experience Consistency**: Does this feature adhere to Fluent UI standards, consistent navigation, and accessibility requirements?
- ✅ **YES**: Fluent UI v9 components for all UI elements per UX-001
- ✅ **WCAG 2.1 AA** accessibility compliance per UX-004
- ✅ **Teams-like navigation** pattern with keyboard support (FR-010)
- ✅ **Consistent theming** with Teams tokens (FR-005, FR-014)

**Performance Requirements**: Are benchmarks defined? Will the feature meet 200ms p95 response times and 80% test coverage?
- ✅ **YES**: <200ms initial load per SC-004 (PF-001)
- ✅ **<500KB bundle** per FR-020
- ✅ **60fps** scrolling with virtualization (FR-016)
- ✅ **80%+ test coverage** per SC-006 (TS-002)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Selected Structure**: Web application (frontend + backend separation)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx          # Main 3-column layout
│   │   │   ├── AppBar.tsx            # Left navigation rail
│   │   │   ├── ListPane.tsx          # Center list panel
│   │   │   ├── MainStage.tsx         # Right content area
│   │   │   └── NavigationItem.tsx    # App bar navigation item
│   │   ├── ui/
│   │   │   ├── UserPersona.tsx       # Avatar + presence
│   │   │   ├── ChannelListItem.tsx   # List item component
│   │   │   ├── Skeleton.tsx          # Loading skeletons
│   │   │   ├── EmptyState.tsx        # Empty state pattern
│   │   │   └── ErrorState.tsx        # Error with retry
│   │   └── forms/
│   │       └── SearchInput.tsx       # Fluent Input wrapper
│   ├── context/
│   │   └── ThemeContext.tsx          # Light/dark/auto theme
│   ├── hooks/
│   │   ├── useBreakpoint.ts          # Responsive detection
│   │   ├── useVirtualizedList.ts     # List virtualization
│   │   └── useTheme.ts               # Theme access hook
│   ├── styles/
│   │   └── tokens.ts                 # Custom theme tokens
│   ├── types/
│   │   └── components.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── initials.ts               # Generate initials
│   │   ├── color-hash.ts             # Deterministic color
│   │   └── validation.ts             # Input validators
│   └── App.tsx                       # Root with providers
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   │   ├── AppShell.test.tsx
│   │   │   ├── UserPersona.test.tsx
│   │   │   └── layout/
│   │   └── utils/
│   ├── integration/
│   │   └── layout/
│   │       └── 3-column-layout.test.tsx
│   └── e2e/
│       └── navigation.spec.ts
└── package.json

backend/                              # NO CHANGES (out of scope)
├── src/
└── tests/

# UI-only refactor: No backend changes per assumptions
```

**Structure Decision**: Frontend-only changes with clear component hierarchy. Backend remains unchanged per scope clarification (out of scope: Backend API, database schema, business logic).

## Complexity Tracking

> **No violations**: Constitution Check PASSED ✅

**Decision Notes**:
- **Virtualization library**: Using @tanstack/react-virtual (5KB) instead of building custom - industry standard, proven
- **No custom component library**: Using Fluent UI v9 directly - avoids maintenance burden
- **No state management changes**: React Context sufficient for theme, existing state for features
