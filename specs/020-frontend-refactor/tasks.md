# Tasks: Frontend Architecture Refactoring

**Feature**: 020-frontend-refactor  
**Branch**: `020-frontend-refactor`  
**Input**: Design documents from `/specs/020-frontend-refactor/`  
**Date**: 2025-02-08

---

## Phase 1: Setup (Analysis & Baseline)

**Purpose**: Establish baseline metrics and prepare refactoring environment

**Note**: Tests are not explicitly requested but implied by "Ensure Testability" requirement. Tests will be included as they are critical for refactoring safety.

- [X] T001 [P] Run baseline metrics: count total LoC in frontend/src using `find frontend/src -name "*.ts" -o -name "*.tsx" | xargs wc -l > specs/020-frontend-refactor/baseline-loc.txt`
- [X] T002 [P] Analyze component tree depth: identify deepest nesting in `frontend/src/**/*.tsx` files
- [X] T003 [P] Catalog existing hooks usage: search for patterns in `frontend/src/hooks/`
- [X] T004 [P] Catalog existing utilities: list all util files in `frontend/src/lib/`
- [X] T005 Document current ESLint violations: run `cd frontend && npm run lint 2>&1 | tee specs/020-frontend-refactor/baseline-eslint.txt`
- [X] T006 Document current test coverage: run `cd frontend && npm run test:coverage 2>&1 | tee specs/020-frontend-refactor/baseline-coverage.txt`
- [X] T007 [P] Document current npm audit: run `cd frontend && npm audit --json > specs/020-frontend-refactor/baseline-audit.json 2>/dev/null || true`

**Checkpoint**: ✅ Baseline established - all metrics documented before refactoring

---

## Phase 2: Foundational (Centralized Infrastructure)

**Purpose**: Create centralized type system and utility module structure (blocking prerequisite for all user stories)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create `frontend/src/types/entities.ts` with consolidated Entity interfaces (extends from data-model.md)
- [X] T009 Create `frontend/src/types/form.ts` with FormErrors and ValidationRule types
- [X] T010 Create `frontend/src/types/api.ts` with ApiResponse, PaginatedResponse, AsyncState types
- [X] T011 Update `frontend/src/types/index.ts` to export all consolidated types
- [X] T012 Create `frontend/src/lib/utils/index.ts` barrel export structure for utilities
- [X] T013 [P] Create `frontend/src/lib/utils/string.ts` for string manipulation utilities
- [X] T014 [P] Create `frontend/src/lib/utils/date.ts` for date formatting utilities
- [X] T015 Consolidate existing utilities: move common functions from `frontend/src/context/theme-utils.ts` and `frontend/src/lib/avatar-colors.ts` into appropriate utils modules
- [X] T016 Update all imports to use new utils barrel export structure in `frontend/src/lib/utils/`

**Checkpoint**: ✅ Foundation ready - types and utilities centralized

---

## Phase 3: User Story 1 - Abstract Redundant Patterns (Priority: P1) 🎯 MVP

**Goal**: Expand useEntityApi hook to cover all entity CRUD operations and create standardized API patterns

**Independent Test**: Run metrics comparison - LoC should decrease by 200-300 lines in API files, useEntityApi usage should cover 4+ entities

### Tests for User Story 1

- [X] T017 [P] [US1] Write contract test for useEntityApi hook in `frontend/src/hooks/__tests__/useEntityApi.test.tsx` (verify generic typing)
- [X] T018 [P] [US1] Write test for expanded useEntityApi with pagination in `frontend/src/hooks/__tests__/useEntityApi.test.tsx`
- [ ] T019 [P] [US1] Write integration test for Worker CRUD flow in `frontend/src/features/workers/WorkerList.test.tsx`

### Implementation for User Story 1

- [X] T020 [US1] Expand useEntityApi hook in `frontend/src/hooks/useEntityApi.ts` to support full CRUD (create, update, remove mutations)
- [X] T021 [P] [US1] Refactor workers API: migrate `frontend/src/features/workers/api.ts` to use useEntityApi<Worker>
- [X] T022 [P] [US1] Refactor bots API: migrate `frontend/src/features/bots/api.ts` to use useEntityApi<Bot>
- [X] T023 [P] [US1] Refactor products API: migrate `frontend/src/features/products/api.ts` to use useEntityApi<Product>
- [X] T024 [P] [US1] Refactor settings API: migrate `frontend/src/features/settings/api.ts` to use useEntityApi<Setting>
- [X] T025 [US1] Update useEntityApi barrel export in `frontend/src/hooks/index.ts` if new exports added
- [X] T026 [US1] Create `frontend/src/lib/api/entity-api.ts` with standardized CRUD utilities
- [ ] T027 [US1] Refactor WorkerList component in `frontend/src/features/workers/WorkerList.tsx` to use useEntityApi
- [ ] T028 [US1] Refactor BotList component in `frontend/src/features/bots/BotList.tsx` to use useEntityApi
- [ ] T029 [US1] Update imports in refactored components to use barrel exports
- [ ] T030 [US1] Run tests and verify no regressions in Worker/Bot features

**Checkpoint**: At this point, US1 should be complete - useEntityApi expanded, 4 entity APIs refactored

---

## Phase 4: User Story 2 - Simplify Component Tree (Priority: P2)

**Goal**: Reduce component tree depth by 30% using Container/Presentational pattern

**Independent Test**: Measure component tree depth before/after - depth should reduce by 30%, Container/Presentational pattern applied

### Tests for User Story 2

- [ ] T031 [P] [US2] Write test for refactored WorkerCard in `frontend/src/features/workers/WorkerCard.test.tsx`
- [ ] T032 [P] [US2] Write test for refactored ProductCard in `frontend/src/features/products/ProductCard.test.tsx`
- [ ] T033 [P] [US2] Write integration test for simplified approval flow in `frontend/src/features/approval/ApprovalGrid.test.tsx`

### Implementation for User Story 2

- [ ] T034 [US2] Analyze component tree depth in `frontend/src/features/workers/WorkerList.tsx`
- [ ] T035 [US2] Refactor WorkerCard component in `frontend/src/features/workers/WorkerCard.tsx` to Presentational pattern
- [ ] T036 [US2] Create WorkerListContainer in `frontend/src/features/workers/WorkerListContainer.tsx` (data fetching logic)
- [ ] T037 [US2] Refactor WorkerList in `frontend/src/features/workers/WorkerList.tsx` to use new container/presentational split
- [ ] T038 [US2] Analyze ProductCard component in `frontend/src/features/products/ProductCard.tsx`
- [ ] T039 [US2] Refactor ProductCard to Presentational pattern in `frontend/src/features/products/ProductCard.tsx`
- [ ] T040 [US2] Analyze ApprovalGrid component in `frontend/src/features/approval/ApprovalGrid.tsx`
- [ ] T041 [US2] Refactor ApprovalGrid in `frontend/src/features/approval/ApprovalGrid.tsx` to reduce nesting
- [ ] T042 [US2] Consolidate React Query cache configuration in `frontend/src/lib/api/query-client.ts` (create if not exists)
- [ ] T043 [US2] Remove redundant state management in refactored components
- [ ] T044 [US2] Update `frontend/src/features/workers/index.ts` exports
- [ ] T045 [US2] Update `frontend/src/features/products/index.ts` exports
- [ ] T046 [US2] Run component tree depth analysis after refactoring

**Checkpoint**: At this point, US2 should be complete - component depth reduced, patterns applied

---

## Phase 5: User Story 3 - Maintain Security and Type Safety (Priority: P3)

**Goal**: Ensure no new vulnerabilities and 100% type safety maintained

**Independent Test**: Run npm audit and ESLint - zero new vulnerabilities, zero type errors

### Tests for User Story 3

- [ ] T047 [P] [US3] Write type safety test for all entity types in `frontend/src/types/__tests__/entities.test.ts`
- [ ] T048 [P] [US3] Write security validation test for FormModal in `frontend/src/components/FormModal/FormModal.test.tsx` (XSS prevention)
- [ ] T049 [P] [US3] Write type coverage test: verify no `any` usage in `frontend/src/**/*.ts` and `frontend/src/**/*.tsx`

### Implementation for User Story 3

- [ ] T050 [US3] Audit all refactored files for XSS vulnerabilities: check `frontend/src/components/FormModal/FormModal.tsx` sanitization
- [ ] T051 [US3] Audit input sanitization in `frontend/src/hooks/useForm.ts` - ensure values are escaped
- [ ] T052 [US3] Run TypeScript strict check: `cd frontend && npx tsc --noEmit --strict`
- [ ] T053 [US3] Fix any type errors in refactored components - target files: `frontend/src/features/workers/*.tsx`
- [ ] T054 [US3] Fix any type errors in `frontend/src/features/bots/*.tsx`
- [ ] T055 [US3] Fix any type errors in `frontend/src/features/products/*.tsx`
- [ ] T056 [US3] Fix any type errors in `frontend/src/features/settings/*.tsx`
- [ ] T057 [US3] Add branded types for IDs in `frontend/src/types/entities.ts` (e.g., `type WorkerId = string & { __brand: 'WorkerId' }`)
- [ ] T058 [US3] Update entity interfaces to use branded types for ID fields
- [ ] T059 [US3] Verify no `any` usage in new utility files: `frontend/src/lib/utils/*.ts`
- [ ] T060 [US3] Run ESLint security rules: `cd frontend && npm run lint 2>&1 | grep -i security`
- [ ] T061 [US3] Run npm audit: `cd frontend && npm audit` - verify zero new vulnerabilities

**Checkpoint**: At this point, US3 should be complete - security verified, 100% type safety

---

## Phase 6: User Story 4 - Ensure Testability and Code Quality (Priority: P4)

**Goal**: Maintain or increase test coverage, zero ESLint violations

**Independent Test**: Run full test suite and linter - coverage maintained, zero ESLint violations

### Tests for User Story 4

- [ ] T062 [P] [US4] Write comprehensive test for useForm hook in `frontend/src/hooks/__tests__/useForm.test.ts` (if not exists)
- [ ] T063 [P] [US4] Write comprehensive test for useModal hook in `frontend/src/hooks/__tests__/useModal.test.ts` (if not exists)
- [ ] T064 [P] [US4] Write test for consolidated utils in `frontend/src/lib/utils/__tests__/string.test.ts`
- [ ] T065 [P] [US4] Write test for consolidated utils in `frontend/src/lib/utils/__tests__/date.test.ts`
- [ ] T066 [P] [US4] Write integration test for Worker feature in `frontend/src/features/workers/WorkerList.test.tsx`

### Implementation for User Story 4

- [ ] T067 [US4] Run full test suite: `cd frontend && npm test`
- [ ] T068 [US4] Fix any failing tests from refactoring
- [ ] T069 [US4] Run ESLint: `cd frontend && npm run lint` - fix all violations
- [ ] T070 [US4] Verify test coverage: `cd frontend && npm run test:coverage` - ensure coverage maintained
- [ ] T071 [US4] Add missing tests for new hooks/components if coverage dropped
- [ ] T072 [US4] Verify all barrel exports work correctly: `cd frontend && npx tsc --noEmit` check imports
- [ ] T073 [US4] Update AGENTS.md with new patterns and abstractions (document in `AGENTS.md`)
- [ ] T074 [US4] Create refactoring summary document at `specs/020-frontend-refactor/REFACTORING-SUMMARY.md`

**Checkpoint**: At this point, US4 should be complete - tests passing, quality maintained

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, metrics comparison, and documentation

- [ ] T075 [P] Run final LoC count: `find frontend/src -name "*.ts" -o -name "*.tsx" | xargs wc -l > specs/020-frontend-refactor/final-loc.txt`
- [ ] T076 [P] Compare metrics: generate report showing LoC reduction percentage
- [ ] T077 Verify component tree depth reduction: measure and compare
- [ ] T078 [P] Run final ESLint check: verify zero violations
- [ ] T079 [P] Run final npm audit: verify zero new vulnerabilities
- [ ] T080 [P] Run final test coverage: verify maintained or improved
- [ ] T081 Verify all imports follow convention: check barrel exports usage
- [ ] T082 Update README.md with new patterns if applicable
- [ ] T083 Verify quickstart.md is accurate: test examples work
- [ ] T084 Run quickstart validation: verify all examples in quickstart.md compile
- [ ] T085 Clean up any TODO comments: search `frontend/src/**/*.{ts,tsx}` for "TODO"
- [ ] T086 Final code review: ensure all files follow naming conventions
- [ ] T087 Verify build: `cd frontend && npm run build` - no errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories CAN run in parallel after Foundational (different files, different domains)
  - Or sequentially in priority order (P1 → P2 → P3 → P4) if single developer
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May reference refactored components from US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1/US2 being in progress or complete (validates types/security)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Validates all previous work

**Recommended**: Sequential execution (single developer) or US1+US2 in parallel, then US3+US4 in parallel (team)

### Within Each User Story

- Tests should be written first (TDD style) or at least during implementation
- Models/types before services/hooks
- Services/hooks before component usage
- Core implementation before integration

---

## Parallel Opportunities

### Parallel by User Story (Team of 4)

```bash
# After Foundational phase complete:

# Developer A - US1 (P1): API Abstraction
Task: T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030

# Developer B - US2 (P2): Component Tree
Task: T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T041, T042, T043, T044, T045, T046

# Developer C - US3 (P3): Security & Types
Task: T047, T048, T049, T050, T051, T052, T053, T054, T055, T056, T057, T058, T059, T060, T061

# Developer D - US4 (P4): Quality & Tests
Task: T062, T063, T064, T065, T066, T067, T068, T069, T070, T071, T072, T073, T074
```

### Parallel Within User Story

```bash
# Example: US1 Tasks that can run in parallel:
Task: T017 [P] - Test
Task: T018 [P] - Test
Task: T019 [P] - Test
Task: T021 [P] - Refactor workers
Task: T022 [P] - Refactor bots
Task: T023 [P] - Refactor products
Task: T024 [P] - Refactor settings
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (baseline metrics)
2. Complete Phase 2: Foundational (types/utilities)
3. Complete Phase 3: US1 (API abstraction)
4. **STOP and VALIDATE**: 
   - Check LoC reduction: target 200-300 lines
   - Verify useEntityApi works for all entities
   - Run tests - all passing
5. **MVP Achieved**: Core refactoring pattern established

### Incremental Delivery (Recommended)

1. **Sprint 1**: Setup + Foundational + US1
   - Establish patterns
   - Major LoC reduction
   - Prove abstraction works

2. **Sprint 2**: US2
   - Component tree simplification
   - Container/Presentational pattern
   - Deeper nesting reduction

3. **Sprint 3**: US3 + US4
   - Security validation
   - Type safety verification
   - Test coverage maintenance
   - Quality gates

4. **Sprint 4**: Polish
   - Final metrics
   - Documentation
   - Performance validation

### Refactoring Safety

- **Never break main branch**: Feature branch only
- **Commit after each task**: Small, focused commits
- **Run tests frequently**: After every 2-3 tasks
- **Validate types continuously**: Use IDE/TypeScript
- **Stop at any checkpoint**: Feature is always deployable

---

## Success Criteria Validation

| Criterion | Validation Task | Target |
|-----------|-----------------|--------|
| SC-001: 15%+ LoC reduction | T076 - Compare metrics | ≥15% reduction |
| SC-002: 5+ patterns abstracted | Research + Implementation | 5 patterns (CRUD, Forms, Modals, Loading, Utils) |
| SC-003: 30% tree depth reduction | T046 + T077 | ≥30% reduction |
| SC-004: 80% utilities consolidated | T015 + T016 | ≥80% consolidated |
| SC-005: Zero new vulnerabilities | T061 + T079 | npm audit clean |
| SC-006: 100% type coverage | T052 + T053-056 | No type errors, no `any` |
| SC-007: Coverage maintained | T070 | ≥ baseline coverage |
| SC-008: Zero ESLint violations | T069 + T078 | Zero violations |
| SC-009: Build time < 10% increase | T087 | <10% increase |
| SC-010: AGENTS.md updated | T073 | Documentation updated |

---

## Task Summary

**Total Tasks**: 87  
**Tasks per User Story**:
- Setup (Phase 1): 7 tasks
- Foundational (Phase 2): 9 tasks
- US1 (P1 - MVP): 14 tasks (3 tests + 11 impl)
- US2 (P2): 16 tasks (3 tests + 13 impl)
- US3 (P3): 12 tasks (3 tests + 9 impl)
- US4 (P4): 13 tasks (5 tests + 8 impl)
- Polish (Phase 7): 13 tasks

**Parallel Opportunities**: 
- Setup tasks: 5 parallel
- Foundational tasks: 3 parallel (after T008-T012)
- US1 tests: 3 parallel
- US1 impl: 4 parallel (entity migrations)
- US2 tests: 3 parallel
- US3 tests: 3 parallel
- US4 tests: 5 parallel
- Polish: 7 parallel

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1 only) = 30 tasks

**Suggested Start**: T001 (baseline metrics)
