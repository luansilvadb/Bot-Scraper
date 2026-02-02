# Feature Specification: Fix Amazon Scraper Timeout Error

**Feature Branch**: `003-fix-scraper-timeout`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "Fix Amazon scraper timeout error (Timeout 60000ms exceeded) by changing navigation wait condition from 'networkidle' to 'domcontentloaded' to avoid hanging on background requests."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Optimize Navigation for Reliability (Priority: P1)

Amazon and other complex sites often have persistent background network activity (ads, tracking) that prevents the `networkidle` state from ever being reached, causing the scraper to time out even if the content is visible. The system should use a more robust navigation strategy.

**Why this priority**: Critical. The scraper is currently failing to retrieve data due to timeouts.

**Independent Test**: Trigger an Amazon scrape. It should complete without a timeout error within 60 seconds.

**Acceptance Scenarios**:

1. **Given** a scraping job for an Amazon product, **When** the scraper navigates to the page, **Then** it should consider navigation successful as soon as the DOM is ready (`domcontentloaded`), without waiting for all network activity to stop.
2. **Given** the page loads, **When** the scraper waits for the product selector, **Then** it should successfully find the element and extract data.

---

### Edge Cases

- What if the page loads but the product content (loaded via AJAX) is still missing after `domcontentloaded`? (Answer: We already have `waitForSelector` in place which handles this).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Amazon Scraper MUST use `waitUntil: 'domcontentloaded'` (or similar relaxed constraint) instead of `networkidle` for the initial navigation.
- **FR-002**: The Scraper MUST rely on explicit `waitForSelector` calls to ensure critical content is loaded, rather than relying on global network quiescence.

### Key Entities

- **AmazonScraper**: The class requiring modification.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: "Timeout 60000ms exceeded" errors during navigation are eliminated for valid Amazon URLs.
- **SC-002**: Scrape jobs complete successfully (return data) in valid test cases.
