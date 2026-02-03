# Tasks: Standardize Fluent UI Design System

**Feature**: [017-fluent-design-system](./plan.md)
**Status**: Ready

## Dependencies

- **US1 (Global Tokens)** blocks **US2** and **US3**
- **US2 (Dark Mode)** blocks full verification of **US3**

## Implementation Strategy

We will start by injecting the CSS variables into the global stylesheet. Then we will build the bridge (Theme Mapping) between these variables and Fluent UI. Finally, we will implement the context provider to switch modes and verify components.

## Phase 1: Setup

- [x] T001 Verify `frontend` project structure and dependencies in `frontend/package.json`

## Phase 2: Foundational (CSS Token System)

- [x] T002 Replace `frontend/src/index.css` with the provided `:root` and `.dark` design token definitions

## Phase 3: User Story 1 - Apply Global Design Tokens (P1)

*Goal: Fluent UI components use the CSS variables for their core branding.*

- [x] T003 [P] [US1] Create `frontend/src/styles/theme.ts` to define the Fluent UI Theme objects (`lightTheme`, `darkTheme`)
- [x] T004 [US1] Map Fluent color tokens (Brand, Neutral) to CSS variables (`var(--primary)`, `var(--background)`) in `frontend/src/styles/theme.ts`
- [x] T005 [US1] Map Fluent generic tokens (Radius, Shadows) to CSS variables (`var(--radius)`, `var(--shadow-md)`) in `frontend/src/styles/theme.ts`

## Phase 4: User Story 2 - Dark Mode Implementation (P2)

*Goal: Users can toggle between Light and Dark modes with instant visual feedback.*

- [x] T006 [P] [US2] Create `ThemeContext` and custom hook in `frontend/src/context/ThemeContext.tsx`
- [x] T007 [US2] Implement `ThemeProvider` in `frontend/src/context/ThemeContext.tsx` handling `localStorage` and `document.documentElement` class toggling
- [x] T008 [US2] Update `frontend/src/App.tsx` (or `main.tsx`) to wrap the application with `ThemeProvider` and `FluentProvider` with dynamic theme prop
- [x] T009 [P] [US2] Create `frontend/src/components/ThemeToggle.tsx` component to switch modes

## Phase 5: User Story 3 - Component Standardization (P3)

*Goal: Interface feels custom and premium.*

- [x] T010 [US3] Update `frontend/src/components/Layout.tsx` (or main container) to use semantic background tokens
- [x] T011 [P] [US3] Verify `frontend/src/index.css` has correct body reset styles (`background-color: var(--background)`, `color: var(--foreground)`)
- [x] T012 [US3] Review and update Sidebar/Navigation components to use `--sidebar` tokens if not automatically inherited

## Phase 6: Polish & Verification

- [x] T013 Verify visual regression between CSS variables and Fluent components
- [x] T014 Ensure fonts (`Open Sans`) are correctly loaded in `frontend/index.html`
