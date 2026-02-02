# Feature Specification: Fix Amazon Scraper Selector Timeout

**Feature Branch**: `004-fix-selector-timeout`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "Fix Amazon scraper error 'page.waitForSelector: Timeout 10000ms exceeded'. The scraper fails to find '.s-result-item' on the homepage. Update the scraper to handle homepage URLs gracefully (e.g. by logging a warning) or improve the selector strategy."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Graceful Handling of Non-Product Pages (Priority: P1)

When the scraper navigates to a URL that doesn't contain product listings (like the Amazon homepage `amazon.com.br`), it currently crashes with a timeout error waiting for the product grid selector. The system should detect this situation and return an empty result set (or a specific error) instead of crashing with a generic timeout.

**Why this priority**: High. Prevents processor crashes and provides meaningful feedback to the user about why no data was scraped.

**Independent Test**: Trigger a scrape with "https://amazon.com.br". The job should complete efficiently with 0 products found and a log message explaining why, rather than failing with a timeout exception.

**Acceptance Scenarios**:

1. **Given** a scraping job with a homepage URL (e.g., "https://amazon.com.br"), **When** the scraper runs, **Then** it should attempt to find the product grid but catch the timeout/failure gracefully, log a warning (e.g., "No product grid found"), and return an empty list `[]`.
2. **Given** a valid search URL, **When** the scraper runs, **Then** it should still successfully extract products.

---

### Edge Cases

- CAPTCHA pages: If Amazon shows a CAPTCHA, the selector will also be missing. This change should at least prevent the crash, though solving CAPTCHA is out of scope for this specific fix (unless basic detection is added).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `AmazonScraper` MUST handle the absence of the `.s-result-item` selector without throwing an unhandled exception.
- **FR-002**: If the product grid is not found, the system MUST log a warning indicating that no products could be extracted from the page.
- **FR-003**: The method MUST return an empty array `[]` instead of throwing in case of missing selectors on non-product pages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: "Timeout 10000ms exceeded" exceptions are eliminated when scraping the Amazon homepage.
- **SC-002**: Scraper returns `[]` (empty list) for homepage URLs.
