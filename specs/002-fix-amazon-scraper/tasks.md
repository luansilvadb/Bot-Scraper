# Tasks: Fix Amazon Scraper Invalid URL Error

**Feature**: `002-fix-amazon-scraper`
**Status**: Completed

## Phase 1: Setup
*Initialize project logic and ensure test files exist.*

- [x] T001 Ensure `backend/src/modules/scraping/scrapers/amazon.scraper.spec.ts` exists, creating a skeleton if necessary, to support TDD.

## Phase 2: User Story 1 - Scrape Amazon Product with Validated URL
*Ensure scraper handles missing protocols (e.g., "amazon.com.br") by prepending "https://".*

**Goal**: Prevent "Protocol error" crashes by sanitizing URLs before navigation.
**Independent Test**: Unit test verifies "amazon.com.br" becomes "https://amazon.com.br" in `page.goto` call.

- [x] T002 [US1] Create unit test in `backend/src/modules/scraping/scrapers/amazon.scraper.spec.ts` that mocks `Page`, calls `scrape` with "amazon.com.br", and asserts `page.goto` receives "https://amazon.com.br".
- [x] T003 [US1] Implement URL sanitization logic in `backend/src/modules/scraping/scrapers/amazon.scraper.ts` (prepend `https://` if protocol missing) and add logging of the final URL.
- [x] T004 [US1] Run unit tests to verify the fix works as expected.

## Dependencies

- **US1** is independent.

## Parallel Execution Examples

- **US1**: T002 (Test Creation) and T003 (Implementation) can theoretically be done in parallel if TDD is strictly followed, but T003 depends on the logic defined in T002 for verification.

## Implementation Strategy

1. **Test First**: Create the failing unit test (T002) to reproduce the issue (conceptually) and define success.
2. **Fix**: Implement the simple string manipulation logic in the scraper (T003).
3. **Verify**: Run the test to confirm pass (T004).
