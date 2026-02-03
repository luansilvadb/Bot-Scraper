# Implementation Plan - Standardize Fluent UI Design System

**Feature**: [017-fluent-design-system](./spec.md)
**Status**: Planned

## Technical Context

The current `frontend` is built with React + Vite + TypeScript and uses `@fluentui/react-components` (v9). We need to inject a specific set of CSS tokens provided by the user into this ecosystem.

**Existing Tech Stack**:
- Frontend: React 19, Vite, TypeScript
- UI Library: Fluent UI v9
- CSS: Vanilla CSS (likely `index.css`)

**Constraints**:
- Must support Light and Dark modes.
- Must use the *exact* hex codes provided in the user request.
- Must ensure Fluent UI components look "premium" and consistent with these tokens.

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **Security** | PASS | No sensitive data involved. Start with secure defaults. |
| **Performance** | PASS | CSS Variables are native and high-performance. |
| **Maintainability** | PASS | Centralized token definition is highly maintainable. |
| **User Experience** | PASS | Direct visual upgrade; supports Dark Mode preference. |

## Proposed Solution

1.  **CSS Layer**:
    - Replace/Update `src/index.css` with the provided `:root` and `.dark` blocks.
    - Ensure basic resets apply `background-color: var(--background)` and `color: var(--foreground)` to `body`.

2.  **Fluent UI Integration**:
    - Create a `src/theme/` directory.
    - Create `lightTheme` and `darkTheme` objects using `createTheme` or manual overrides.
    - Map key slots (Backgrounds, Foregrounds, Brands) to the CSS variables (e.g., `brandBackground: 'var(--primary)'`).

3.  **Application Wrapper**:
    - Create `AppProvider` (or update existing) to handle `ThemeContext`.
    - Retrieve user preference from `localStorage`.
    - Apply `.dark` class to `document.documentElement` or `body`.
    - Pass the correct Fluent `theme` object to `<FluentProvider>`.

## Implementation Phases

### Phase 1: Foundation (CSS)
- Update `index.css` with full variable list.
- Verify fonts are available (Open Sans, etc.) or added to `index.html`.

### Phase 2: Theme Logic
- Create `ThemeContext` and `useTheme` hook.
- Implement storage persistence.

### Phase 3: Fluent Mapping
- Create the custom Fluent Theme objects.
- Connect `FluentProvider`.

### Phase 4: Component Polish
- Review key components (Cards, Sidebars) and ensure they are utilizing the system.
- Add utility classes if needed for the specific shadow/radius tokens.

## Verification
- Visual check of Light Mode (White/Blue).
- Visual check of Dark Mode (Black/Blue).
- Component consistency check.
