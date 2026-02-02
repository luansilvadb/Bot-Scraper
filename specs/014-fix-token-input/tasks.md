# Tasks: Fix Token Input Visibility

**Branch**: `014-fix-token-input`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phased Implementation

### Phase 1: User Story 1 - Configure Worker Token [P1]

**Goal**: Restore visibility and functionality of the worker token input field using proper layout and design tokens.
**Independent Test**: Token input appears correctly in dark mode and accepts input.

- [x] T001 [US1] Update CSS layout for `ConfigWindow` to ensure Card content expands correctly.
      File: `worker-app/src/components/ConfigWindow.css`
      Note: Add `display: flex; flex-direction: column;` to `.config-card`.

- [x] T002 [US1] Refactor `ConfigWindow` to use standard Input component and remove hardcoded styles.
      File: `worker-app/src/components/ConfigWindow.tsx`
      Note: Replace native `<input>` with properly styled element using `var(--color-bg-secondary)` etc.

- [x] T003 [US1] Update CSS to support standardized input styling.
      File: `worker-app/src/components/ConfigWindow.css`
      Note: Define `.native-input` classes using shared design tokens if not using Fluent `Input` directly (or styling it).

### Phase 2: Polish & Verification

**Goal**: Ensure code quality and absence of regressions.

- [x] T004 [P] Clean up unused styles and ensure visual consistency.
      File: `worker-app/src/components/ConfigWindow.css`

- [x] T005 [US1] Increase window and container height to prevent content clipping.
      File: `worker-app/electron/status-window.ts`, `worker-app/electron/main.ts`, `worker-app/src/components/TrayContainer.css`
      Note: Increase heights to ~600px to accommodate form content.

- [x] T006 [US1] Remove padding from status window to align flush with bottom-right corner.
      File: `worker-app/electron/status-window.ts`
      Note: Remove `- 20` offset in `setPosition`.

- [x] T007 [US1] Reduce window height to remove excess empty space.
      File: `worker-app/electron/status-window.ts`, `worker-app/electron/main.ts`
      Note: Reduce height from 600px to 460px (calculated to fit content tight).

- [x] T008 [US1] Fine-tune window height to remove remaining gap (410px).
      File: `worker-app/electron/status-window.ts`, `worker-app/electron/main.ts`, `worker-app/src/components/TrayContainer.css`
      Note: Reduce height to 410px and adjust min-height.

- [x] T009 [US1] Increase window height to 550px to eliminate scrollbar.
      File: `worker-app/electron/status-window.ts`, `worker-app/electron/main.ts`, `worker-app/src/components/TrayContainer.css`
      Note: Increase height to 550px to fit content comfortable.

- [x] T010 [US1] Increase status window height to 850px to match user preference.
      File: `worker-app/electron/status-window.ts`, `worker-app/src/components/TrayContainer.css`
      Note: Increase height to 850px and min-height to 800px.

- [x] T011 [US1] Adjust window height to 650px to fit content without excess space.
      File: `worker-app/electron/status-window.ts`, `worker-app/electron/main.ts`, `worker-app/src/components/TrayContainer.css`
      Note: 850px was too large; 650px should provide ample room without huge gap.

- [x] T012 [US1] Remove 'Worker Name' input field from configuration form.
      File: `worker-app/src/components/ConfigWindow.tsx`
      Note: Simplify form to only require Token.

## Dependencies

- **US1** is the single blocking story.
- T001 should be applied first to fix the container layout.
- T002 and T003 are coupled (component + styles).

## Implementation Strategy

1.  **Fix Layout First**: Ensure the container (Card) actually renders its children with height (T001).
2.  **Standardize Input**: Replace the problematic hardcoded input with a design-system compliant one (T002, T003).
3.  **Verify**: Check visually.
