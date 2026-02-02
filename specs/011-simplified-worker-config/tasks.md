# Tasks: Simplified Worker Configuration

**Input**: Design documents from `/specs/011-simplified-worker-config/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project**: `worker-app/` (Electron desktop application)
- **Main Process**: `worker-app/electron/`
- **Renderer**: `worker-app/src/`
- **Environment**: `worker-app/.env.*`

---

## Phase 1: Setup (Environment Files)

**Purpose**: Create environment configuration files

- [x] T001 [P] Create `.env.development` with `VITE_SERVER_URL=http://localhost:30001` in `worker-app/.env.development`
- [x] T002 [P] Create `.env.production` with placeholder URL in `worker-app/.env.production`
- [x] T003 [P] Create `.env.example` with documentation in `worker-app/.env.example`

---

## Phase 2: Foundational (Type Updates)

**Purpose**: Update types and constants to support environment-based configuration

**⚠️ CRITICAL**: Complete before user story implementation

- [x] T004 Add `SERVER_URL` constant reading from `import.meta.env.VITE_SERVER_URL` in `worker-app/electron/types.ts`
- [x] T005 Update comments in `WorkerConfig` interface to document that `serverUrl` is now environment-based in `worker-app/electron/types.ts`

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - First-Time Worker Setup (Priority: P1) 🎯 MVP

**Goal**: User sees only Token field and can complete setup in under 30 seconds

**Independent Test**: Launch fresh app, enter only token, verify connection works

### Implementation for User Story 1

- [x] T006 [US1] Modify `saveConfig` handler to inject `SERVER_URL` from environment instead of user input in `worker-app/electron/ipc-handlers.ts`
- [x] T007 [US1] Update validation to only require `workerToken` field (remove URL validation) in `worker-app/electron/ipc-handlers.ts`
- [x] T008 [US1] Remove `serverUrl` input field from configuration form in `worker-app/src/components/ConfigWindow.tsx`
- [x] T009 [US1] Update form layout and spacing after URL field removal in `worker-app/src/components/ConfigWindow.tsx`
- [x] T010 [US1] Add helper text below Token field: "Copie o token do seu painel" in `worker-app/src/components/ConfigWindow.tsx`
- [x] T011 [US1] Update error messages to not expose server URL details in `worker-app/src/components/ConfigWindow.tsx`

**Checkpoint**: First-time setup flow complete with single Token field

---

## Phase 4: User Story 2 - Environment-Based URL Configuration (Priority: P1)

**Goal**: Different environments use different URLs at build time

**Independent Test**: Build with different .env files and verify correct URL is used

### Implementation for User Story 2

- [x] T012 [US2] Create Vite env type declaration for `VITE_SERVER_URL` in `worker-app/src/vite-env.d.ts`
- [x] T013 [US2] Ensure `getConfig` returns environment URL when `serverUrl` is empty in `worker-app/electron/services/config-store.ts`
- [x] T014 [US2] Update `startWorker` function to use environment URL as fallback in `worker-app/electron/ipc-handlers.ts`
- [x] T015 [US2] Add console log showing which URL is being used (dev mode only) in `worker-app/electron/main.ts`

**Checkpoint**: Environment-based URL injection working

---

## Phase 5: User Story 3 - Reconfiguring Token (Priority: P2)

**Goal**: Existing users can update their token without re-entering URL

**Independent Test**: Open Settings on configured worker, change token, verify reconnection

### Implementation for User Story 3

- [x] T016 [US3] Verify Settings view shows Token field with masked value in `worker-app/src/components/ConfigWindow.tsx`
- [x] T017 [US3] Ensure token update triggers reconnection with new credentials in `worker-app/electron/ipc-handlers.ts`
- [x] T018 [US3] Verify Cancel button discards changes without affecting connection in `worker-app/src/components/ConfigWindow.tsx`

**Checkpoint**: Token reconfiguration flow complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T019 Update `README.md` to document environment variable configuration in `worker-app/README.md`
- [x] T020 Run quickstart.md validation checklist in `specs/011-simplified-worker-config/quickstart.md`
- [x] T021 Verify development mode uses localhost URL correctly
- [x] T022 Verify production build would use production URL (check injected value)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Parallel with US1
- **User Story 3 (P2)**: Depends on US1 completion (form must exist)

### Within Each User Story

- Type changes before implementation
- Backend (ipc-handlers) before Frontend (ConfigWindow)
- Core implementation before polish

### Parallel Opportunities

- T001, T002, T003 (all .env files) can run in parallel
- T004, T005 (type updates) are sequential
- US1 and US2 can be implemented in parallel after Phase 2
- US3 should wait for US1 (form must be simplified first)

---

## Parallel Example: Phase 1 (Setup)

```bash
# All environment files can be created in parallel:
Task T001: Create .env.development
Task T002: Create .env.production  
Task T003: Create .env.example
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (environment files)
2. Complete Phase 2: Foundational (type updates)
3. Complete Phase 3: User Story 1 (simplified form)
4. **STOP and VALIDATE**: Test Token-only configuration
5. Deploy if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP Complete!**
3. Add User Story 2 → Verify env injection works
4. Add User Story 3 → Test token reconfiguration
5. Polish → Final validation

### Estimated Time

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Setup | 3 | 5 minutes |
| Foundational | 2 | 5 minutes |
| User Story 1 | 6 | 15 minutes |
| User Story 2 | 4 | 10 minutes |
| User Story 3 | 3 | 10 minutes |
| Polish | 4 | 10 minutes |
| **Total** | **22** | **~55 minutes** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- User Story 1 is the MVP - can ship after completing Phase 3
