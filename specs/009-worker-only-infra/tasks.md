# Tasks: Worker-Only Infrastructure & Proxy Removal

**Input**: Design documents from `/specs/009-worker-only-infra/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment preparation

- [x] T001 Update `backend/.env.example` to emphasize `REDIS_URL` and cloud database connection strings
- [x] T002 [P] Configure `.env` with cloud PostgreSQL and Redis credentials for local testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure changes that MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update `backend/prisma/schema.prisma` to remove `Proxy` model, `ProxyProtocol` enum, and references in `Bot` model
- [x] T004 Create and run Prisma migration: `npx prisma migrate dev --name remove_proxy_infrastructure`
- [x] T005 [P] Update `docker-compose.yml` to remove `db` and `redis` services and volumes

**Checkpoint**: Foundation ready - Docker now only manages application services, and DB schema is cleaned.

---

## Phase 3: User Story 1 - Simplified Deployment (Priority: P1) 🎯 MVP

**Goal**: Deploy application using Docker Compose connecting to cloud services exclusively.

**Independent Test**: Running `docker compose up` starts only backend/frontend, and backend logs confirm successful connection to Redis/DB.

### Implementation for User Story 1

- [x] T006 [US1] Clean up `backend/src/common/queues/queue.module.ts` to strictly require `REDIS_URL` (optional but recommended for clarity)
- [x] T007 [US1] Update `backend/src/app.module.ts` (or relevant config) to ensure all environment variables for cloud services are correctly loaded
- [x] T008 [US1] Verify backend container boots and connects to cloud PostgreSQL/Redis via `docker logs backend`

**Checkpoint**: At this point, the application is successfully decoupled from local infrastructure containers.

---

## Phase 4: User Story 2 - Proxy Removal (Priority: P2)

**Goal**: Remove all proxy-related logic, routes, and UI elements.

**Independent Test**: Proxy menu is gone from Frontend, and scraping tasks are successfully processed by Local Workers without proxy fallback errors.

### Implementation for User Story 2

- [x] T009 [US2] Delete the `backend/src/modules/proxy` directory and all its contents
- [x] T010 [US2] Remove `ProxyModule` import from `backend/src/app.module.ts`
- [x] T011 [US2] Remove proxy related logic from `backend/src/modules/bots/bots.service.ts` (findAll, update, create)
- [x] T012 [US2] Update `backend/src/modules/bots/dto/create-bot.dto.ts` and `update-bot.dto.ts` to remove `proxyId`
- [x] T013 [US2] Remove proxy injection and context creation in `backend/src/modules/scraping/scraping.processor.ts`
- [x] T014 [US2] Cleanup `backend/src/modules/scraping/playwright.service.ts` to remove `createProxyContext` if unused, or simplify it
- [x] T015 [P] [US2] Remove "Proxies" navigation item from `frontend/src/components/layout/AppShell.tsx`
- [x] T016 [P] [US2] Remove proxy routes and component imports from `frontend/src/App.tsx`
- [x] T017 [US2] Delete `frontend/src/features/proxy` directory
- [x] T018 [US2] Remove proxy-related fields and state from `frontend/src/features/bots/BotForm.tsx`
- [x] T019 [US2] Update `Bot` type and API mutations in `frontend/src/features/bots/api.ts`

**Checkpoint**: Proxy functionality is completely purged from both backend and frontend.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [x] T020 [P] Run `npx prisma generate` to update client types
- [x] T021 Search for all remaining "Proxy" or "proxy" strings across the project to ensure 100% removal
- [x] T022 Run `quickstart.md` validation checklist
- [x] T023 Documentation update: Mention that the project now relies exclusively on Local Workers

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 - MUST complete before US1/US2.
- **User Stories (Phase 3+)**: US1 (Infrastructure) should ideally be verified before US2 (Code cleanup).
- **Polish (Final Phase)**: Depends on US1 and US2.

### Parallel Opportunities

- T002 can run in parallel with T001.
- T015 and T016 can run in parallel with backend tasks in Phase 4.
- Once Phase 2 is done, US1 and US2 can theoretically start together, but it's safer to verify US1 first.

---

## Implementation Strategy

### MVP First (User Story 1 & Foundation)

1. Complete Phase 1 & 2.
2. Complete US1.
3. **STOP and VALIDATE**: Verify Docker Compose and Cloud connectivity.

### Incremental Delivery

1. Foundation + US1 → "Cloud-Ready Infrastructure"
2. US2 (Backend) → "Clean Backend (No Proxy logic)"
3. US2 (Frontend) → "Clean Frontend (Simplified UI)"
