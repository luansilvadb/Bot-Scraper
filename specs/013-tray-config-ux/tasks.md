# Tasks: System Tray Configuration UX Premium

**Input**: Design documents from `/specs/013-tray-config-ux/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Electron App**: `worker-app/electron/` (main process), `worker-app/src/` (renderer)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project setup and design system foundation

- [x] T001 Extract design tokens from frontend and document in `worker-app/src/design-tokens.css`
- [x] T002 [P] Backup current `worker-app/src/index.css` to `worker-app/src/index.css.backup`
- [x] T003 Update `worker-app/src/index.css` with unified design tokens matching `frontend/src/index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for view transitions and blur detection

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add blur event handler to hide tray window in `worker-app/electron/main.ts`
- [x] T005 [P] Create `worker-app/src/components/ViewTransition.tsx` animation wrapper component
- [x] T006 [P] Create `worker-app/src/components/ViewTransition.css` with transition animations (250ms ease)
- [x] T007 Create `worker-app/src/components/TrayContainer.tsx` main container with view state management
- [x] T008 Create `worker-app/src/components/TrayContainer.css` container styles with glassmorphism

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Configuração Integrada na Tray Window (Priority: P1) 🎯 MVP

**Goal**: Integrate configuration form directly into tray popup window instead of separate centered window

**Independent Test**: Clear config, restart worker-app, verify config form appears in tray popup (not centered window)

### Implementation for User Story 1

- [x] T009 [P] [US1] Add `embedded` prop to `ConfigWindow` interface in `worker-app/src/components/ConfigWindow.tsx`
- [x] T010 [P] [US1] Update `worker-app/src/components/ConfigWindow.css` for embedded appearance (remove padding, adjust sizing)
- [x] T011 [US1] Refactor `ConfigWindow` component for embedded mode in `worker-app/src/components/ConfigWindow.tsx`
- [x] T012 [US1] Update `worker-app/src/App.tsx` to use TrayContainer instead of direct routing
- [x] T013 [US1] Integrate ConfigWindow into TrayContainer with proper state handoff in `worker-app/src/components/TrayContainer.tsx`
- [x] T014 [US1] Remove separate config window creation logic from `worker-app/electron/main.ts` (if exists)

**Checkpoint**: User Story 1 complete - config form appears embedded in tray popup

---

## Phase 4: User Story 2 - Design Unificado com Frontend Dashboard (Priority: P1)

**Goal**: Achieve visual consistency between worker-app and frontend dashboard

**Independent Test**: Compare screenshots of worker-app and dashboard side-by-side, verify colors/fonts/components match

### Implementation for User Story 2

- [x] T015 [P] [US2] Update primary colors in `worker-app/src/design-tokens.css` to match frontend (`#242424` bg)
- [x] T016 [P] [US2] Update accent colors in `worker-app/src/design-tokens.css` to match frontend (`#646cff`)
- [x] T017 [P] [US2] Update typography settings in `worker-app/src/design-tokens.css` (font-family, sizes)
- [x] T018 [US2] Update `worker-app/src/components/StatusWindow.css` with unified design tokens
- [x] T019 [US2] Update `worker-app/src/components/ConfigWindow.css` with unified design tokens
- [x] T020 [US2] Ensure FluentProvider uses `webDarkTheme` consistently in `worker-app/src/main.tsx`
- [x] T021 [US2] Add glassmorphism effect (`backdrop-filter: blur(20px)`) to `worker-app/src/components/TrayContainer.css`
- [x] T022 [US2] Update border-radius to 12px on popup container in `worker-app/src/components/TrayContainer.css`

**Checkpoint**: User Story 2 complete - visual consistency with dashboard achieved

---

## Phase 5: User Story 3 - Navegação Fluida entre Status e Config (Priority: P2)

**Goal**: Smooth animated transitions between Status and Config views without flicker

**Independent Test**: With configured worker, click settings → config slides in smoothly → save → status slides back

### Implementation for User Story 3

- [x] T023 [P] [US3] Add `onOpenSettings` callback prop to `StatusWindow` in `worker-app/src/components/StatusWindow.tsx`
- [x] T024 [P] [US3] Add settings button (gear icon) to StatusWindow header in `worker-app/src/components/StatusWindow.tsx`
- [x] T025 [US3] Implement view toggle logic in TrayContainer in `worker-app/src/components/TrayContainer.tsx`
- [x] T026 [US3] Wire ViewTransition component with activeView state in `worker-app/src/components/TrayContainer.tsx`
- [x] T027 [US3] Add slide-in/slide-out CSS animations in `worker-app/src/components/ViewTransition.css`
- [x] T028 [US3] Ensure smooth back navigation after config save/cancel in `worker-app/src/components/TrayContainer.tsx`

**Checkpoint**: User Story 3 complete - smooth transitions between views

---

## Phase 6: User Story 4 - Feedback Visual de Conexão (Priority: P2)

**Goal**: Clear visual feedback during connection process (loading, success, error states)

**Independent Test**: Enter token, click connect, observe spinner → success checkmark or error shake

### Implementation for User Story 4

- [x] T029 [P] [US4] Add connection state types to `worker-app/src/components/ConfigWindow.tsx` (idle, validating, connecting, success, error)
- [x] T030 [P] [US4] Create success checkmark animation in `worker-app/src/components/ConfigWindow.css`
- [x] T031 [P] [US4] Create error shake animation in `worker-app/src/components/ConfigWindow.css`
- [x] T032 [US4] Implement loading spinner during connection in `worker-app/src/components/ConfigWindow.tsx`
- [x] T033 [US4] Add success state transition with checkmark animation in `worker-app/src/components/ConfigWindow.tsx`
- [x] T034 [US4] Add error state with shake animation and inline message in `worker-app/src/components/ConfigWindow.tsx`
- [x] T035 [US4] Auto-transition to status view after successful connection in `worker-app/src/components/TrayContainer.tsx`

**Checkpoint**: User Story 4 complete - all connection states have clear visual feedback

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and validation

- [x] T036 [P] Verify blur-to-hide behavior works correctly in `worker-app/electron/main.ts`
- [x] T037 [P] Test animations at 60fps (no frame drops) across all transitions
- [x] T038 Run quickstart.md validation scenarios (all 5 scenarios)
- [x] T039 Visual comparison test: screenshot worker-app vs dashboard side-by-side
- [x] T040 Clean up any unused CSS/code from old config window implementation
- [x] T041 Update README.md with new UX behavior documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase
- **User Story 2 (Phase 4)**: Depends on Foundational phase (can run parallel with US1)
- **User Story 3 (Phase 5)**: Depends on US1 completion (needs TrayContainer)
- **User Story 4 (Phase 6)**: Depends on US1 completion (needs ConfigWindow refactor)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

```
             ┌──────────────────┐
             │     Setup        │
             │   (Phase 1)      │
             └────────┬─────────┘
                      │
             ┌────────▼─────────┐
             │   Foundational   │
             │   (Phase 2)      │
             └────────┬─────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
  ┌──────▼──────┐         ┌────────▼────────┐
  │     US1      │         │       US2       │
  │ Config in    │         │  Design Unified │
  │ Tray (P1)    │         │     (P1)        │
  └──────┬──────┘         └────────┬────────┘
         │                         │
    ┌────┴────┐                    │
    │         │                    │
┌───▼───┐ ┌───▼───┐                │
│  US3  │ │  US4  │                │
│ Trans │ │ Feed  │                │
│ (P2)  │ │ (P2)  │                │
└───┬───┘ └───┬───┘                │
    │         │                    │
    └────┬────┴────────────────────┘
         │
  ┌──────▼──────┐
  │   Polish    │
  │  (Phase 7)  │
  └─────────────┘
```

### Parallel Opportunities

```bash
# Phase 1 - All can run in parallel:
Task: T001, T002 (different files)

# Phase 2 - Parallel tasks:
Task: T005, T006 (ViewTransition component + CSS)

# Phase 3 (US1) - Parallel tasks:
Task: T009, T010 (props + CSS)

# Phase 4 (US2) - Parallel tasks:
Task: T015, T016, T017 (all design token files)

# Phase 5 (US3) - Parallel tasks:
Task: T023, T024 (both StatusWindow changes)

# Phase 6 (US4) - Parallel tasks:
Task: T029, T030, T031 (types + animations)
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup (design tokens)
2. Complete Phase 2: Foundational (blur + transitions)
3. Complete Phase 3: User Story 1 (config in tray)
4. Complete Phase 4: User Story 2 (design unified)
5. **STOP and VALIDATE**: Test config appears in tray with correct design
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Base ready
2. Add US1 → Config in tray popup ✅
3. Add US2 → Visually consistent with dashboard ✅
4. Add US3 → Smooth navigation ✅
5. Add US4 → Connection feedback ✅
6. Polish → Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- `worker-app/` is the target directory for all changes
- No backend changes required for this feature
- Test by comparing with `frontend/` dashboard visually
- US1 + US2 form the core MVP (both are P1 priority)
