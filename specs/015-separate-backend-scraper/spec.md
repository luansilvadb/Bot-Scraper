# Feature Specification: Separate Backend from Scraper by Updating Worker

**Feature Branch**: `015-separate-backend-scraper`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "quero separar o backend de scraper atualizando o worker"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Decouple Scraping from Backend (Priority: P1)

As a system architect, I want the backend to delegate all scraping operations to the worker service, so that the backend remains lightweight and responsive, and scraping logic is isolated.

**Why this priority**: Core architectural change requested. Crucial for system scalability and stability.

**Independent Test**: Trigger a scraping task from the backend (e.g., via API or UI) and verify that the backend **does not** launch a browser instance itself but successfully dispatches the job to the worker, which then executes it.

**Acceptance Scenarios**:

1. **Given** a new scrape request, **When** processed by the backend, **Then** the backend enqueues the job or sends a signal to the worker.
2. **Given** the backend code, **When** analyzed, **Then** it should not contain direct calls to Playwright/Puppeteer launch methods for production scraping (implementation detail check).
3. **Given** the worker receives a job, **When** it executes, **Then** it successfully navigates to the target site and extracts data.

---

### User Story 2 - enhance Worker Capabilities (Priority: P2)

As a developer, I want the worker to be fully capable of handling complex scraping implementation details (selectors, navigation logic) independently, so that the backend only deals with high-level job management.

**Why this priority**: Required to enable the separation defined in P1. The worker must be "smart" enough to take over.

**Independent Test**: Verify the worker can accept a job payload (e.g., URL, product ID) and complete the scrape without requesting logic/code from the backend during execution.

**Acceptance Scenarios**:

1. **Given** a worker instance, **When** provided with valid job parameters, **Then** it completes the scrape and produces the expected data structure.
2. **Given** a scraping error (e.g., timeout), **When** it occurs in the worker, **Then** the worker reports the specific error back to the backend/monitoring.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Backend MUST NOT execute scraping logic directly (i.e., launching browsers for data extraction).
- **FR-002**: The Backend MUST dispatch scraping tasks to the Worker service via the existing communication channel (Socket.IO/Queue).
- **FR-003**: The Worker MUST contain all necessary logic (selectors, navigation steps, captcha handling if any) to scrape the target websites.
- **FR-004**: The Worker MUST receive job parameters (URLs, config) from the Backend.
- **FR-005**: The Worker MUST return scraped data or error statuses to the Backend upon completion.
- **FR-006**: The Worker MUST support the specific scraping features currently implemented in the Backend (if any are being moved).

### Key Entities

- **ScrapeJob**: Represents a unit of work (URL, status, result) passed from Backend to Worker.
- **ScrapeResult**: The data extracted by the worker (Title, Price, Stock status, etc.).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of new scrape requests are executed by the Worker service.
- **SC-002**: Backend CPU usage remains stable during high-volume scraping (since the load is shifted).
- **SC-003**: Worker successfully processes valid jobs and returns data to the backend with < 1% protocol error rate.
- **SC-004**: System successfully completes an end-to-end scrape flow (Request -> Backend -> Worker -> Scrape -> Backend -> DB) in the new architecture.

## Assumptions

- The current communication channel (likely Socket.IO based on `package.json`) is sufficient for job dispatch.
- The `worker` codebase is already structured to support this, but needs logic updates/migration.
- "Separating" implies moving logic, not just infrastructure changes.
