# Tasks: Fix Amazon Scraper Selector Timeout

**Feature**: `004-fix-selector-timeout`
**Status**: Completed

## Phase 1: Setup
*No setup required as this is an incremental fix to an existing file.*

## Phase 2: User Story 1 - Graceful Handling of Non-Product Pages
*Ensure scraper catches selector timeouts and returns empty result.*

**Goal**: Prevent job crashes on homepage/captchas by returning `[]`.
**Independent Test**: Unit test mocks `waitForSelector` throwing error, asserts `scrape` returns `[]`.

- [x] T001 [US1] Create failure case unit test in `backend/src/modules/scraping/scrapers/amazon.scraper.spec.ts` that mocks `waitForSelector` rejection and expects empty array.
- [x] T002 [US1] Wrap `waitForSelector` in try/catch block in `backend/src/modules/scraping/scrapers/amazon.scraper.ts`.
- [x] T003 [US1] run unit tests to verify the fix works as expected.

## Dependencies

- **US1** is independent.

## Parallel Execution Examples

- **US1**: T001 and T002 should follow TDD order (Test first).

## Implementation Strategy

1. **Test**: Write the test that expects a clean `[]` return when selector fails.
2. **Implement**: Add the try/catch logic.
3. **Verify**: Ensure the test passes.
