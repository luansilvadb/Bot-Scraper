# Tasks: Local Worker Scraper for MVP

**Input**: Design documents from `/specs/007-local-worker-scraper/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: No explicit test tasks requested in specification. Tests can be added in Polish phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`
- **Worker**: `worker/` (new standalone application)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and database schema

- [x] T001 Install WebSocket dependencies: `npm install @nestjs/websockets @nestjs/platform-socket.io` in backend/
- [x] T002 [P] Add Prisma schema for LocalWorker, ScrapingTask, ScrapingResult models in backend/prisma/schema.prisma
- [x] T003 Run Prisma migration: `npx prisma migrate dev --name add-local-worker-scraper` in backend/
- [x] T004 [P] Add WORKER_AUTH_TOKEN to backend/.env and backend/.env.example
- [x] T005 [P] Initialize worker project: create worker/package.json with socket.io-client, playwright, axios, typescript
- [x] T006 [P] Create worker/tsconfig.json with strict TypeScript configuration
- [x] T007 Install Playwright browser: `npx playwright install chromium` in worker/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create workers module structure in backend/src/modules/workers/workers.module.ts
- [x] T009 [P] Create shared DTO types for WebSocket events in backend/src/modules/workers/dto/ws-events.dto.ts
- [x] T010 [P] Create WorkerStatus and TaskStatus enums in backend/src/modules/workers/enums/status.enum.ts
- [x] T011 Create tasks module structure in backend/src/modules/tasks/tasks.module.ts
- [x] T012 [P] Create base worker WebSocket client skeleton in worker/src/websocket.client.ts
- [x] T013 Register workers and tasks modules in backend/src/app.module.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Execute Product Scraping via Local Worker (Priority: P1) 🎯 MVP

**Goal**: Operator submits product URL, system routes to worker, worker scrapes and returns results

**Independent Test**: Submit a single Amazon product URL and verify product details (title, price, images, rating) are returned successfully

### Implementation for User Story 1

#### Backend: Task & Result Handling

- [x] T014 [P] [US1] Create CreateTaskDto with productUrl, priority validation in backend/src/modules/tasks/dto/create-task.dto.ts
- [x] T015 [P] [US1] Create TaskStatusDto for response formatting in backend/src/modules/tasks/dto/task-status.dto.ts
- [x] T016 [P] [US1] Create TaskResultDto for scraping result data in backend/src/modules/tasks/dto/task-result.dto.ts
- [x] T017 [US1] Implement TasksService with create, findOne, updateStatus, saveResult methods in backend/src/modules/tasks/tasks.service.ts
- [x] T018 [US1] Implement TasksController with POST /api/tasks, GET /api/tasks/:id endpoints in backend/src/modules/tasks/tasks.controller.ts

#### Backend: WebSocket Task Distribution

- [x] T019 [US1] Implement WorkersGateway with task:assigned event emission in backend/src/modules/workers/workers.gateway.ts
- [x] T020 [US1] Add handleTaskCompleted event handler in WorkersGateway to receive results in backend/src/modules/workers/workers.gateway.ts
- [x] T021 [US1] Add handleTaskFailed event handler in WorkersGateway for error handling in backend/src/modules/workers/workers.gateway.ts

#### Worker: Scraping Engine

- [x] T022 [US1] Implement ScraperService with scrapeProduct method using Playwright in worker/src/scraper.service.ts
- [x] T023 [US1] Add Amazon product page selectors (title, price, rating, images, availability) in worker/src/scraper.service.ts
- [x] T024 [US1] Implement rate limiting (10-15s random delay) in ScraperService in worker/src/scraper.service.ts
- [x] T025 [US1] Implement CAPTCHA/block detection logic in ScraperService in worker/src/scraper.service.ts

#### Worker: Task Processing

- [x] T026 [US1] Implement WorkerService with handleTaskAssigned method in worker/src/worker.service.ts
- [x] T027 [US1] Add task:started, task:completed, task:failed event emissions in worker/src/worker.service.ts
- [x] T028 [US1] Wire scraper to WebSocket client for end-to-end flow in worker/src/main.ts

**Checkpoint**: At this point, User Story 1 should be fully functional - a product URL can be scraped via a connected worker

---

## Phase 4: User Story 2 - Local Worker Registration & Heartbeat (Priority: P1)

**Goal**: Worker registers on startup, maintains heartbeat, server tracks connection status

**Independent Test**: Start worker instance, verify it appears in worker list with "connected" status, stop it and verify "disconnected"

### Implementation for User Story 2

#### Backend: Worker Registration

- [x] T029 [P] [US2] Create RegisterWorkerDto with name, token validation in backend/src/modules/workers/dto/register-worker.dto.ts
- [x] T030 [P] [US2] Create WorkerHeartbeatDto with status, networkInfo, stats in backend/src/modules/workers/dto/worker-heartbeat.dto.ts
- [x] T031 [P] [US2] Create WorkerStatusDto for response formatting in backend/src/modules/workers/dto/worker-status.dto.ts
- [x] T032 [US2] Implement WorkersService with register, findAll, findByToken, updateStatus methods in backend/src/modules/workers/workers.service.ts
- [x] T033 [US2] Add handleConnection with token authentication in WorkersGateway in backend/src/modules/workers/workers.gateway.ts
- [x] T034 [US2] Add handleDisconnect with status update in WorkersGateway in backend/src/modules/workers/workers.gateway.ts

#### Backend: Heartbeat Monitoring

- [x] T035 [US2] Add handleHeartbeat event handler in WorkersGateway in backend/src/modules/workers/workers.gateway.ts
- [x] T036 [US2] Implement heartbeat timeout detection (30s) with status update in WorkersService in backend/src/modules/workers/workers.service.ts
- [x] T037 [US2] Add scheduled job for heartbeat timeout checks using @nestjs/schedule in backend/src/modules/workers/workers.service.ts

#### Worker: Connection & Heartbeat

- [x] T038 [US2] Implement WebSocket connection with token auth in WebSocketClient in worker/src/websocket.client.ts
- [x] T039 [US2] Add auto-reconnection logic on disconnect in WebSocketClient in worker/src/websocket.client.ts
- [x] T040 [US2] Implement heartbeat interval (10s) with worker:heartbeat emission in worker/src/websocket.client.ts
- [x] T041 [US2] Handle worker:registered event and store config in worker/src/websocket.client.ts

#### Backend: Worker REST API

- [x] T042 [US2] Implement WorkersController with GET /api/workers, GET /api/workers/:id in backend/src/modules/workers/workers.controller.ts
- [x] T043 [US2] Add POST /api/workers to create worker and generate token in backend/src/modules/workers/workers.controller.ts
- [x] T044 [US2] Add DELETE /api/workers/:id endpoint in backend/src/modules/workers/workers.controller.ts

**Checkpoint**: Workers can connect, maintain heartbeat, and server tracks their status in real-time

---

## Phase 5: User Story 3 - Task Queue Management (Priority: P2)

**Goal**: Operator queues multiple tasks, system distributes to workers, handles retries automatically

**Independent Test**: Queue 5 product URLs, verify all are processed with success/failure status visible

### Implementation for User Story 3

#### Backend: Queue Logic

- [x] T045 [US3] Implement getNextPendingTask with priority ordering in TasksService in backend/src/modules/tasks/tasks.service.ts
- [x] T046 [US3] Implement assignTaskToWorker with status update in TasksService in backend/src/modules/tasks/tasks.service.ts
- [x] T047 [US3] Implement retry logic with attemptCount increment in TasksService in backend/src/modules/tasks/tasks.service.ts
- [x] T048 [US3] Add reassignOrphanedTasks for tasks from disconnected workers in TasksService in backend/src/modules/tasks/tasks.service.ts

#### Backend: Task Distribution

- [x] T049 [US3] Implement task dispatcher that assigns pending tasks to idle workers in WorkersService in backend/src/modules/workers/workers.service.ts
- [x] T050 [US3] Trigger task distribution on worker:heartbeat (idle status) in WorkersGateway in backend/src/modules/workers/workers.gateway.ts
- [x] T051 [US3] Trigger task distribution on task creation in TasksController in backend/src/modules/tasks/tasks.controller.ts

#### Backend: Task REST API

- [x] T052 [P] [US3] Create BatchCreateTaskDto for multiple URLs in backend/src/modules/tasks/dto/batch-create-task.dto.ts
- [x] T053 [US3] Add POST /api/tasks/batch endpoint for batch creation in TasksController in backend/src/modules/tasks/tasks.controller.ts
- [x] T054 [US3] Add GET /api/tasks with pagination and filters in TasksController in backend/src/modules/tasks/tasks.controller.ts
- [x] T055 [US3] Add DELETE /api/tasks/:id and POST /api/tasks/:id/retry endpoints in TasksController in backend/src/modules/tasks/tasks.controller.ts

**Checkpoint**: Task queue fully operational with automatic distribution and retry

---

## Phase 6: User Story 4 - Worker Network Information Display (Priority: P3)

**Goal**: Operator can view ISP name and external IP for each connected worker

**Independent Test**: Connect worker, view network details panel showing ISP name and IP address

### Implementation for User Story 4

#### Worker: Network Detection

- [x] T056 [P] [US4] Implement NetworkService with getExternalIp using ipinfo.io API in worker/src/network.service.ts
- [x] T057 [US4] Add periodic network info refresh (every 30 min) in NetworkService in worker/src/network.service.ts
- [x] T058 [US4] Include network info in heartbeat payload in WorkerService in worker/src/worker.service.ts
- [x] T059 [US4] Emit worker:network_changed event on IP/ISP change in WorkerService in worker/src/worker.service.ts

#### Backend: Network Info Storage

- [x] T060 [US4] Update worker ispName and externalIp on heartbeat in WorkersService in backend/src/modules/workers/workers.service.ts
- [x] T061 [US4] Handle worker:network_changed event in WorkersGateway in backend/src/modules/workers/workers.gateway.ts
- [x] T062 [US4] Include network info in GET /api/workers and GET /api/workers/:id responses in backend/src/modules/workers/workers.controller.ts

#### Frontend: Worker Dashboard

- [x] T063 [P] [US4] Create WorkerCard component showing status, IP, ISP in frontend/src/components/workers/WorkerCard.tsx
- [x] T064 [P] [US4] Create WorkerList component fetching from /api/workers in frontend/src/components/workers/WorkerList.tsx
- [x] T065 [US4] Create workers page using WorkerList component in frontend/src/pages/workers/index.tsx
- [x] T066 [US4] Add real-time updates via WebSocket or polling to WorkerList in frontend/src/components/workers/WorkerList.tsx

**Checkpoint**: Dashboard shows connected workers with network information

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, documentation, and validation

- [x] T067 [P] Create worker/README.md with installation and usage instructions
- [x] T068 [P] Create TaskQueue component showing pending/completed tasks in frontend/src/components/workers/TaskQueue.tsx
- [x] T069 Add TaskQueue to workers page for complete dashboard in frontend/src/pages/workers/index.tsx
- [x] T070 [P] Add POST /api/workers/:id/reset endpoint to reset blocked worker status in WorkersController
- [x] T071 Add logging for all WebSocket events in WorkersGateway
- [x] T072 Add validation error handling for all REST endpoints
- [x] T073 Run quickstart.md verification checklist
- [x] T074 Test end-to-end flow: create task → worker scrapes → result saved → displayed in dashboard

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Phase 2 completion
  - US1 and US2 can proceed in parallel (both P1 priority)
  - US3 depends on US1 (task execution) and US2 (worker connection) being functional
  - US4 can start after US2 (uses heartbeat infrastructure)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 2 (Foundational)
       │
       ├─────────────┬─────────────┐
       ▼             ▼             │
    [US1: Scraping] [US2: Registration]
       │             │             │
       └──────┬──────┘             │
              ▼                    │
         [US3: Queue]              │
              │                    │
              └────────────────────┘
                       │
                       ▼
              [US4: Network Display]
```

### Within Each User Story

- DTOs before services
- Services before controllers/gateways
- Backend before worker for contract alignment
- Gateway events before worker implementation

### Parallel Opportunities

- All [P] marked tasks can run in parallel within their phase
- T001-T007: All setup tasks except T003 (needs T002)
- T009, T010, T012: Foundational DTOs and enums can be parallel
- T014-T016: All US1 DTOs can be parallel
- T029-T031: All US2 DTOs can be parallel
- T063-T064: Frontend components can be parallel

---

## Parallel Example: User Story 1 DTOs

```bash
# Launch all US1 DTOs together:
Task: "T014 [P] [US1] Create CreateTaskDto in backend/src/modules/tasks/dto/create-task.dto.ts"
Task: "T015 [P] [US1] Create TaskStatusDto in backend/src/modules/tasks/dto/task-status.dto.ts"
Task: "T016 [P] [US1] Create TaskResultDto in backend/src/modules/tasks/dto/task-result.dto.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Scraping) + Phase 4: User Story 2 (Registration) in parallel
4. **STOP and VALIDATE**: Test scraping a real Amazon product via connected worker
5. Deploy/demo if ready - this is the minimum viable product!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 + US2 → Test end-to-end scraping → Deploy (MVP!)
3. Add US3 → Test batch operations and retry → Deploy
4. Add US4 → Test dashboard with network info → Deploy
5. Each story adds value without breaking previous stories

### Suggested MVP Scope

**For achieving 3 qualified sales goal**: 
- Phase 1 (Setup) ✓
- Phase 2 (Foundational) ✓
- Phase 3 (US1: Scraping) ✓
- Phase 4 (US2: Registration) ✓

This provides: working scraper with connected worker. Manual task creation is acceptable for MVP.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- US1 and US2 are both P1 priority and can be developed in parallel
- Worker application (worker/) is a separate Node.js project from backend
