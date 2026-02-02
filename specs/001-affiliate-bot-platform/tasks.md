---
description: "Task list for Affiliate Bot Platform feature"
---

# Tasks: Affiliate Bot Platform

**Input**: Design documents from `/specs/001-affiliate-bot-platform/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan (Monorepo setup) in `backend/` and `frontend/`
- [X] T002 Initialize NestJS backend in `backend/`
- [X] T003 Initialize Vite React frontend in `frontend/`
- [X] T004 [P] Configure shared settings in `backend/.env.example` and `frontend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Scanning Engine & Database Foundation**

- [X] T005 Setup Prisma Schema with `Bot`, `Proxy` models in `backend/prisma/schema.prisma`
- [X] T006 [P] Configure BullMQ (Redis) module in `backend/src/common/queues/queue.module.ts`
- [X] T007 [P] Config Telegram Bot module (Telegraf) in `backend/src/modules/telegram/telegram.module.ts`
- [X] T008 [P] Implement `AuthGuard` (Single Password) in `backend/src/modules/auth/auth.guard.ts`
- [X] T009 [P] Create React `AppShell` (Sidebar/Layout) in `frontend/src/components/layout/AppShell.tsx`
- [X] T010 [P] Setup configured HTTP client (Axios/TanStack Query) in `frontend/src/lib/api.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Centralized Bot Management (Priority: P0 - MVP)

**Goal**: Admin can CREATE, PAUSE, and DELETE bots via Dashboard.

**Independent Test**: Create a bot in UI, see it in DB. Pause it, verify status updates.

### Implementation for User Story 1

- [X] T011 [US1] Create `BotService` (CRUD) in `backend/src/modules/bots/bots.service.ts`
- [X] T012 [US1] Create `BotController` in `backend/src/modules/bots/bots.controller.ts`
- [X] T013 [P] [US1] Create Frontend `BotList` component in `frontend/src/features/bots/BotList.tsx`
- [X] T014 [P] [US1] Create Frontend `CreateBotModal` form in `frontend/src/features/bots/CreateBotModal.tsx`
- [X] T015 [US1] Integrate `BotController` with `QueueService` to schedule/unschedule jobs in `backend/src/modules/bots/bots.service.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 4 - Proxy & Infra Management (Priority: P0 - MVP)

**Goal**: Configure proxies and ensure scraping works on ARM64.

**Independent Test**: Add a proxy. Run a manual test connection check.

### Implementation for User Story 4

- [X] T016 [US4] Create `ProxyService` (CRUD + Check) in `backend/src/modules/proxy/proxy.service.ts`
- [X] T017 [US4] Create `ProxyController` in `backend/src/modules/proxy/proxy.controller.ts`
- [X] T018 [P] [US4] Create Frontend `ProxyManager` view in `frontend/src/features/proxy/ProxyManager.tsx`
- [X] T019 [US4] Implement `PlaywrightService` (Browser Instance) in `backend/src/modules/scraping/playwright.service.ts`
- [X] T020 [US4] Create `Dockerfile.backend` with Playwright ARM64 support in `backend/`

**Checkpoint**: At this point, User Stories 1 AND 4 should both work independently

---

## Phase 5: User Story 2 - Automated Scraping (Priority: P0 - MVP)

**Goal**: System scrapes Amazon, filters by profit, and handles errors.

**Independent Test**: Trigger a bot. Verify logs show "Scraping... Found Item... Discount X%... Queued".

### Implementation for User Story 2

- [X] T021 [US2] Update Prisma Schema with `ScrapedProduct` in `backend/prisma/schema.prisma`
- [X] T022 [US2] Create `ScrapingProcessor` (BullMQ Worker) in `backend/src/modules/scraping/scraping.processor.ts`
- [X] T023 [US2] Implement Amazon Page Object Model (Selectors) in `backend/src/modules/scraping/scrapers/amazon.scraper.ts`
- [X] T024 [US2] Implement "Profit Filter" logic (>80% check) in `backend/src/modules/scraping/logic/profit-filter.ts`
- [X] T025 [US2] Create `TelegramAlertService` for errors/bans in `backend/src/modules/telegram/alert.service.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 3 - Approval Center (Priority: P0 - MVP)

**Goal**: Visual interface to Approve/Reject high-discount items.

**Independent Test**: Inject a dummy "Pending" item in DB. Open Dashboard. Approve it. Verify it moves to "Posted" state.

### Implementation for User Story 3

- [X] T026 [US3] Create `ProductController` (List Pending, Approve, Reject) in `backend/src/modules/products/products.controller.ts`
- [X] T027 [US3] Implement `TelegramPoster` service (Send to Channel) in `backend/src/modules/telegram/poster.service.ts`
- [X] T028 [P] [US3] Create Frontend `ApprovalGrid` component in `frontend/src/features/approval/ApprovalGrid.tsx`
- [X] T029 [P] [US3] Create Frontend `ProductCard` component in `frontend/src/features/approval/ProductCard.tsx`
- [X] T030 [US3] Wire Approval Actions (API Connect) in `frontend/src/features/approval/useApprovalActions.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T031 [D] Create `docker-compose.yml` for the entire stack in root
- [X] T032 [D] Create `Dockerfile.frontend` (Nginx/SPA) in `frontend/`
- [X] T033 [US3] Implement `SystemSettings` (Global Config) in `backend/src/modules/settings/settings.service.ts`
- [X] T034 [P] Create Frontend `SystemSettings` view in `frontend/src/features/settings/SettingsPage.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1
- **User Story 1 (Bot Mgmt)**: Depends on Foundation
- **User Story 4 (Infra)**: Depends on Foundation (Parallel with US1)
- **User Story 2 (Scraping)**: Depends on US4 (needs Proxies/Playwright) and US1 (needs Bot config)
- **User Story 3 (Approval)**: Depends on US2 (needs Scraped Items)

### Parallel Opportunities

- Frontend (T013, T014, T018, T028, T029) can currently run in parallel with Backend tasks once API contract is agreed
- US1 (Bots) and US4 (Proxies) are largely independent domains

## Implementation Strategy

### MVP First
1. Complete Setup & Foundation.
2. Build **US1 (Bots)** and **US4 (Proxies)** to allow configuration.
3. Build **US2 (Scraping)** to simply log found items.
4. Build **US3 (Approval)** to finalize the loop.
