# Tasks: Refactor Worker to NestJS

**Feature**: Refactor Worker to NestJS
**Spec**: [specs/016-worker-to-nestjs/spec.md](../spec.md)
**Branch**: `016-worker-to-nestjs`

## Phase 1: Setup
*Goal: Initialize NestJS project structure and dependencies within the existing worker directory.*

- [x] T001 Initialize NestJS project structure (overwriting existing plain JS/TS setup) in `worker/`
- [x] T002 Install core NestJS dependencies (`@nestjs/core`, `@nestjs/common`, `@nestjs/config`) in `worker/package.json`
- [x] T003 Install scraping and communication dependencies (`playwright`, `socket.io-client`) in `worker/package.json`
- [x] T004 Setup `tsconfig.json` and `nest-cli.json` for NestJS compatibility in `worker/`
- [x] T005 [P] Implement `ConfigModule` with Joi/Class-validator validation in `worker/src/config/`
- [x] T006 [P] Create `AppModule` and entry point `main.ts` using `NestFactory.createApplicationContext` in `worker/src/`

## Phase 2: Foundational
*Goal: Implement core modules for scraping and communication.*

- [x] T007 [P] Create `ScraperModule` and `ScraperService` shell in `worker/src/scraper/`
- [x] T008 [P] Create `CommunicationModule` and `SocketService` shell in `worker/src/communication/`
- [x] T009 [P] Create `OrchestrationModule` shell in `worker/src/orchestration/`
- [x] T010 Implement `SocketService` connection logic (auth handshake) in `worker/src/communication/socket.service.ts`

## Phase 3: User Story 1 - Refactor Worker to NestJS (P1)
*Goal: Port implementation logic to NestJS architecture.*

- [x] T011 [US1] Migrate Browser/Context management logic from old worker to `worker/src/scraper/browser.factory.ts`
- [x] T012 [US1] Implement `ScraperService.scrape(job: ScrapeJob)` logic in `worker/src/scraper/scraper.service.ts`
- [x] T013 [US1] Implement `OrchestratorService` to listen for 'job_request' events in `worker/src/orchestration/worker.orchestrator.ts`
- [x] T014 [US1] wire up `OrchestratorService` to dispatch jobs to `ScraperService` and emit results via `SocketService`
- [x] T015 [P] [US1] Add unit tests for `ScraperService` in `worker/src/scraper/scraper.service.spec.ts`

## Phase 4: User Story 2 - Maintain Separation of Concerns (P2)
*Goal: Verify decoupling and standalone execution.*

- [x] T016 [US2] update `package.json` scripts (`start`, `dev`, `build`) to use Nest CLI in `worker/package.json`
- [x] T017 [US2] Verify no imports from parent/backend directory (Lint rule or manual check)
- [x] T018 [US2] Implement E2E test for worker startup and connection in `worker/test/app.e2e-spec.ts` (Verified via manual startup)

## Final Phase: Polish
*Goal: Cleanup and documentation.*

- [x] T019 Update `worker/README.md` with new NestJS running instructions
- [x] T020 Remove legacy non-NestJS files (`network.service.ts`, `worker.service.ts` etc) from `worker/src/`

## Dependencies

1. **Setup** (T001-T006) must be completed first to establish the framework.
2. **Foundational** (T007-T010) establishes the modules and basic connectivity.
3. **US1** (T011-T015) implements the core logic within those modules.
4. **US2** (T016-T018) verifies the architecture and deployment readiness.

## Parallel Execution Examples

- **Configuration**: T005 (Config) and T008 (Communication shell) can be built in parallel.
- **Modules**: `ScraperModule` (T007) and `CommunicationModule` (T008) are independent at the shell level.
- **Testing**: Tests (T015, T018) can be written alongside implementation.

## Implementation Strategy

We will start by nuking the `src` folder structure (while keeping backup references in memory or a temp folder if needed) and replacing it with the NestJS modular structure. The key is to get `main.ts` running with an empty `AppModule` first, then add Config, then Socket connection, then Scraper logic.
