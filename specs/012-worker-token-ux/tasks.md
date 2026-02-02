# Tasks: Worker Token UX Improvements

**Input**: Design documents from `/specs/012-worker-token-ux/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`
- **Feature**: `frontend/src/features/workers/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared utilities and hooks used by all user stories

- [x] T001 [P] Create `useClipboard` hook with clipboard API and fallback in `frontend/src/hooks/useClipboard.ts`
- [x] T002 [P] Create `TokenDisplay` reusable component in `frontend/src/features/workers/TokenDisplay.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend infrastructure needed before frontend features can be completed

**⚠️ CRITICAL**: Complete before User Story 2 (Token Regeneration)

- [x] T003 Create `RegenerateTokenResponseDto` in `backend/src/workers/dto/regenerate-token.dto.ts`
- [x] T004 Add `regenerateToken()` method to WorkersService in `backend/src/workers/workers.service.ts`
- [x] T005 Add `POST /workers/:id/regenerate-token` endpoint to WorkersController in `backend/src/workers/workers.controller.ts`
- [x] T006 [P] Add `GET /workers/:id/token` endpoint to WorkersController in `backend/src/workers/workers.controller.ts`

**Checkpoint**: Backend endpoints ready - frontend implementation can begin

---

## Phase 3: User Story 1 - First-Time Token Display (Priority: P1) 🎯 MVP

**Goal**: User sees dedicated modal with token after registering a new worker, can copy with one click

**Independent Test**: Register a new worker, verify modal appears with token and working copy button

### Implementation for User Story 1

- [x] T007 [US1] Create `TokenModal` component in `frontend/src/features/workers/TokenModal.tsx`
- [x] T008 [US1] Add token copy button with "Copied!" feedback state in `TokenModal.tsx`
- [x] T009 [US1] Add security warning text ("Token shown only once") in `TokenModal.tsx`
- [x] T010 [US1] Add close confirmation dialog ("Did you save your token?") in `TokenModal.tsx`
- [x] T011 [US1] Modify `WorkerList.tsx` to use `TokenModal` instead of Toast after registration in `frontend/src/features/workers/WorkerList.tsx`
- [x] T012 [US1] Handle clipboard fallback (selectable text field) when API unavailable in `TokenModal.tsx`

**Checkpoint**: First-time token display flow complete with copy functionality

---

## Phase 4: User Story 2 - Token Regeneration (Priority: P1)

**Goal**: User can regenerate a new token for existing workers, old token immediately invalidated

**Independent Test**: Click "Regenerate Token" on worker card, verify new token displayed and old rejects

### Implementation for User Story 2

- [x] T013 [US2] Create `RegenerateTokenDialog` confirmation component in `frontend/src/features/workers/RegenerateTokenDialog.tsx`
- [x] T014 [US2] Add warning text about old token invalidation in `RegenerateTokenDialog.tsx`
- [x] T015 [US2] Add `regenerateToken` mutation to `frontend/src/features/workers/api.ts`
- [x] T016 [US2] Add "Regenerate Token" menu option to `WorkerCard.tsx` in `frontend/src/features/workers/WorkerCard.tsx`
- [x] T017 [US2] Wire up regeneration flow: confirm dialog → API call → TokenModal in `WorkerCard.tsx`
- [x] T018 [US2] Handle loading and error states during regeneration in `WorkerCard.tsx`

**Checkpoint**: Token regeneration flow complete with confirmation and new token display

---

## Phase 5: User Story 3 - Show Token on Worker Card (Priority: P2)

**Goal**: User can reveal and copy current token from worker card without regeneration

**Independent Test**: Click "Show Token" on card, verify token appears with copy and auto-hides after 30s

### Implementation for User Story 3

- [x] T019 [US3] Add `getWorkerToken` query to `frontend/src/features/workers/api.ts`
- [x] T020 [US3] Add "Show Token" button to `WorkerCard.tsx` in `frontend/src/features/workers/WorkerCard.tsx`
- [x] T021 [US3] Implement token reveal state with auto-hide timer (30 seconds) in `WorkerCard.tsx`
- [x] T022 [US3] Add inline `TokenDisplay` component when token is revealed in `WorkerCard.tsx`
- [x] T023 [US3] Add visual countdown or timer indicator for auto-hide in `WorkerCard.tsx`

**Checkpoint**: Show Token flow complete with auto-hide security measure

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and cleanup

- [x] T024 [P] Add CSS styles for TokenModal and TokenDisplay in `frontend/src/features/workers/styles.css`
- [ ] T025 Run quickstart.md validation checklist in `specs/012-worker-token-ux/quickstart.md`
- [ ] T026 Verify all token operations work with keyboard navigation (accessibility)
- [x] T027 [P] Update component documentation/comments

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Story 1 (Phase 3)**: Depends on Phase 1 only (no backend changes needed)
- **User Story 2 (Phase 4)**: Depends on Phase 1 AND Phase 2 (needs backend endpoint)
- **User Story 3 (Phase 5)**: Depends on Phase 1 AND Phase 2 (needs backend endpoint)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 - No backend dependencies
- **User Story 2 (P1)**: Can start after Phase 2 - Needs regeneration endpoint
- **User Story 3 (P2)**: Can start after Phase 2 - Needs get-token endpoint

### Within Each User Story

- Shared components before story-specific features
- Core functionality before polish
- UI setup before wiring to backend

### Parallel Opportunities

- T001, T002 (hooks/components) can run in parallel in Phase 1
- T003-T006 (backend) can be parallelized except T004→T005 dependency
- US2 and US3 can start in parallel once Phase 2 is complete
- T024, T027 can run in parallel during Polish phase

---

## Parallel Example: Phase 1 (Setup)

```bash
# Launch both shared utilities together:
Task T001: Create useClipboard hook
Task T002: Create TokenDisplay component
```

## Parallel Example: Phase 2 (Backend)

```bash
# DTO and GET endpoint can run in parallel:
Task T003: RegenerateTokenResponseDto
Task T006: GET /workers/:id/token

# Then sequential:
Task T004: WorkersService.regenerateToken (depends on T003)
Task T005: POST endpoint (depends on T004)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (hooks and shared components)
2. Complete Phase 3: User Story 1 (TokenModal after registration)
3. **STOP and VALIDATE**: Test token copy flow works
4. Deploy if ready - users can now reliably copy tokens at registration

### Incremental Delivery

1. Complete Setup → Shared utilities ready
2. Add User Story 1 → Test independently → **MVP Complete!**
3. Complete Phase 2 → Backend endpoints ready
4. Add User Story 2 → Token regeneration works
5. Add User Story 3 → Show token on cards works
6. Polish → Final validation

### Estimated Time

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Setup | 2 | 10 minutes |
| Foundational | 4 | 20 minutes |
| User Story 1 | 6 | 30 minutes |
| User Story 2 | 6 | 25 minutes |
| User Story 3 | 5 | 20 minutes |
| Polish | 4 | 15 minutes |
| **Total** | **27** | **~2 hours** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- User Story 1 is the MVP - can ship after completing Phase 3
- Backend endpoints (Phase 2) only block US2 and US3, not US1
