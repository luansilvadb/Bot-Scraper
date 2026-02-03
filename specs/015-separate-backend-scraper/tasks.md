# Tasks: Separate Backend from Scraper

**Feature**: Separate Backend from Scraper
**Spec**: [specs/015-separate-backend-scraper/spec.md](spec.md)
**Plan**: [specs/015-separate-backend-scraper/plan.md](plan.md)
**Branch**: `015-separate-backend-scraper`

## Phase 1: Communication & Contracts
*Goal: Ensure the backend and worker agree on how to exchange multiple results.*

- [x] T001 Update `ScrapingTask` prisma model to include `botId` in `backend/prisma/schema.prisma`
- [x] T002 Update `WS_EVENTS` and `TaskCompletedDto` to support `results: ScrapedProductData[]` in `backend/src/modules/workers/dto/ws-events.dto.ts`
- [x] T003 Synchronize `types.ts` in `worker/src/types.ts` with backend changes.

## Phase 2: Worker Enhancement
*Goal: Port listing scraper logic to the worker.*

- [x] T004 Implement `AmazonListScraper` in `worker/src/scraper/amazon-list.scraper.ts` (port logic from backend)
- [x] T005 Update `ScraperService.scrape` to handle listing URLs in `worker/src/scraper/scraper.service.ts`

## Phase 3: Backend Delegation
*Goal: Stop backend from scraping and start delegating.*

- [x] T006 Update `ScrapingProcessor` to create a `ScrapingTask` instead of scraping in `backend/src/modules/scraping/scraping.processor.ts`
- [x] T007 Update `WorkersGateway.handleTaskCompleted` to process bulk results and upsert `ScrapedProduct` entries in `backend/src/modules/workers/workers.gateway.ts`
- [x] T008 Move `ProfitFilter` logic usage to `WorkersGateway` or a shared service (implemented in TasksService)

## Phase 4: Cleanup & Verification
*Goal: Remove dead code and verify.*

- [x] T009 Remove `PlaywrightService` and legacy scrapers from `backend/src/modules/scraping/`
- [x] T010 Verify end-to-end flow: Bot Trigger -> Worker Scrape -> Backend Save.

## Dependencies

- Phase 1 must be completed before Phase 2 and 3 can be fully integrated.
- Phase 4 is the final cleanup.
