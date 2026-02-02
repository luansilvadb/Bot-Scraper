# Tasks: Fix Amazon Scraper Timeout Error

**Feature**: `003-fix-scraper-timeout`
**Status**: Completed

## Phase 1: Setup
*No setup required as this is an incremental fix to an existing file.*

## Phase 2: User Story 1 - Optimize Navigation for Reliability
*Modify navigation strategy to avoid waiting for network silence.*

**Goal**: Eliminate 60s timeout errors by switching to `domcontentloaded`.
**Independent Test**: Unit test verifies `page.goto` is called with `{ waitUntil: 'domcontentloaded', ... }`.

- [x] T001 [US1] Update `backend/src/modules/scraping/scrapers/amazon.scraper.ts` to use `domcontentloaded` instead of `networkidle`.
- [x] T002 [US1] Update unit tests in `backend/src/modules/scraping/scrapers/amazon.scraper.spec.ts` to expect the new `domcontentloaded` parameter.
- [x] T003 [US1] Run unit tests to verify the change.

## Dependencies

- **US1** is independent.

## Parallel Execution Examples

- **US1**: T001 and T002 must correspond, so sequential execution is safer to avoid test/code mismatch.

## Implementation Strategy

1. **Modify**: Change the code and the test.
2. **Verify**: Run the test.
3. **Verify**: Manual check (optional but recommended in quickstart).
