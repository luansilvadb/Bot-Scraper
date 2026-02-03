# Research: Fluent UI Standardization

**Feature**: [017-fluent-design-system](../spec.md)
**Status**: Research Completed

## Decisions

### 1. CSS Variables + Fluent Theme Mapping
**Decision**: We will define the provided CSS variables in a global `index.css` file and creating a custom Fluent UI v9 Theme that maps fluent tokens to these variables.

**Rationale**:
- The user explicitly provided a CSS variable design system (`:root { ... }`).
- Fluent UI v9 (`@fluentui/react-components`) uses a Javascript-based theme object.
- To satisfy "Standardize UI/UX", both custom HTML elements and Fluent components must share the same source of truth.
- Mapping Fluent tokens (e.g., `colorBrandBackground`) to `var(--primary)` ensures that if the CSS variable changes (e.g. via JS or dev tools), both systems update instantly.

### 2. Dark Mode Implementation
**Decision**: Use a class-based approach (`html.dark`) for the global CSS variables and a `FluentProvider` wrapping the app that switches its `theme` prop based on the same state.

**Rationale**:
- The user provided a `.dark` class definition.
- Fluent UI requires a separate `webDarkTheme` (or custom equivalent) passed to the provider.
- Synchronizing the CSS class and the React Provider ensures consistency.

### 3. Theme State Management
**Decision**: Use a React Context (`ThemeContext`) to manage the current mode (light/dark) and persist preference to `localStorage`.

**Rationale**:
- "Standard" requirement for modern apps.
- Allows components deeper in the tree to toggle themes without prop drilling.
- Simple and effective.

## Alternatives Considered

- **Pure Fluent Theme**: Ignoring CSS variables and only using Fluent's object.
  - *rejected*: The user explicitly gave us a CSS design system they want to use.
- **Pure CSS Overrides**: Trying to override Fluent CSS variables directly.
  - *rejected*: Fluent v9 uses hashed classes and dynamic variables; overriding them blindly is brittle. Using the official `createTheme` or specific token mapping is cleaner.

## Open Questions (Resolved)

- **Fluent UI Version?**: Confirmed `v9` (`@fluentui/react-components`).
- **Integration**: V9 supports custom themes created via `createTheme` or manual object construction.
