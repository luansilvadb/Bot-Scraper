# Feature Specification: Fix Amazon Scraper Invalid URL Error

**Feature Branch**: `002-fix-amazon-scraper`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "Fix the Amazon scraper error: Protocol error (Page.navigate): Cannot navigate to invalid URL 'amazon.com.br'. The scraper should ensure URLs are valid (e.g. valid protocol) before navigation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scrape Amazon Product with Validated URL (Priority: P1)

The scraping bot encounters URLs that may lack the protocol (e.g., "amazon.com.br"). The system must handle these gracefully by ensuring a valid protocol is present before attempting navigation, preventing crashes.

**Why this priority**: High. Currently, the scraper crashes when encountering such URLs, blocking the core functionality of the bot.

**Independent Test**: Can be tested by triggering an Amazon scrape job with a target URL stripped of its protocol and verifying successful navigation.

**Acceptance Scenarios**:

1. **Given** a scraping job with a target URL "amazon.com.br" (missing protocol), **When** the `AmazonScraper` attempts to navigate, **Then** it should automatically prepend "https://" and successfully navigate to "https://amazon.com.br".
2. **Given** a scraping job with a target URL "https://amazon.com.br" (valid protocol), **When** the scraper navigates, **Then** it should proceed without modification.

---

### Edge Cases

- What happens when the URL is empty?
- How does the system handle URLs that are malformed beyond just missing the protocol (e.g., "htttp://...")?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Amazon Scraper MUST sanitize the target URL before passing it to the browser navigation method.
- **FR-002**: If the target URL is missing a protocol scheme (i.e., does not start with `http://` or `https://`), the system MUST prepend `https://` to the URL.
- **FR-003**: The system MUST log the final URL being navigated to for debugging purposes.

### Key Entities *(include if feature involves data)*

- **ScrapingJob**: Contains the `url` to be scraped.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Scraper successfully navigates to Amazon URLs provided without a protocol (e.g., "amazon.com.br") 100% of the time.
- **SC-002**: "Protocol error (Page.navigate)" errors are eliminated for Amazon scrape jobs caused by missing protocols.
