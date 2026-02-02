# Feature Specification: Local Worker Scraper for MVP

**Feature Branch**: `007-local-worker-scraper`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "MVP phase - Local Worker on home network for Amazon scraping using residential IPs (Vivo/Claro/Tim) to achieve 3 qualified sales and unlock Amazon's official API. Zero Cost strategy eliminating proxy expenses before revenue generation."

## Context & Business Rationale

### MVP Goal
The primary objective is to achieve **3 qualified sales** on Amazon to unlock access to the official Amazon Product Advertising API. This is a prerequisite before any revenue generation.

### Why Local Worker (Zero Cost Strategy)
- **Eliminate Proxy Costs**: Residential proxies are expensive and wasteful before generating revenue
- **Maximum Amazon Trust**: Real residential IPs from Brazilian ISPs (Vivo, Claro, Tim) have the highest trust level with Amazon
- **Avoid Blocks & CAPTCHAs**: Home network IPs face fewer restrictions than even paid residential proxies
- **Bootstrap Phase**: Most robust approach to start from zero without capital expenditure

## Clarifications

### Session 2026-02-01

- Q: What rate limiting strategy should be used between scraping requests? → A: Moderate (1 request every 10-15 seconds) - balanced speed/safety
- Q: How should Workers communicate with the server? → A: WebSocket (persistent connection, server pushes tasks to worker, real-time bidirectional)
- Q: How many retry attempts for failed scraping tasks? → A: 3 retries (standard approach, handles most transient failures)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Execute Product Scraping via Local Worker (Priority: P1)

The operator initiates a product scraping task from the main application. The system routes this request to an available Local Worker running on the home network. The Local Worker executes the scrape using its residential IP, extracts product data, and returns results to the main application.

**Why this priority**: This is the core functionality required. Without successful scraping, no affiliate links can be generated and no sales achieved. This directly impacts the goal of 3 qualified sales.

**Independent Test**: Can be fully tested by submitting a single Amazon product URL and verifying that product details (title, price, images, rating) are returned successfully without blocks or CAPTCHAs.

**Acceptance Scenarios**:

1. **Given** the Local Worker is connected and available, **When** a product URL is submitted for scraping, **Then** the system returns complete product information within the expected timeframe
2. **Given** the Local Worker is connected, **When** multiple sequential requests are made, **Then** each request completes successfully without triggering Amazon blocking mechanisms
3. **Given** the Local Worker encounters a CAPTCHA or block, **When** the request fails, **Then** the system logs the failure with diagnostic information and marks the request for retry

---

### User Story 2 - Local Worker Registration & Heartbeat (Priority: P1)

The Local Worker application registers itself with the main application upon startup. It maintains a regular heartbeat to signal availability. The main application can view connected workers and their status.

**Why this priority**: Essential for the system to know which workers are available to receive tasks. Without registration and health monitoring, task distribution cannot function reliably.

**Independent Test**: Can be tested by starting a Local Worker instance and verifying it appears in the main application's worker list with "connected" status, and disappears when stopped.

**Acceptance Scenarios**:

1. **Given** the Local Worker starts up, **When** it connects to the main application, **Then** it is registered and visible in the worker management interface
2. **Given** a Local Worker is registered, **When** it sends regular heartbeats, **Then** its status shows as "active" with last heartbeat timestamp
3. **Given** a Local Worker stops sending heartbeats, **When** the timeout threshold is exceeded, **Then** its status changes to "disconnected" and it is not assigned new tasks

---

### User Story 3 - Task Queue Management (Priority: P2)

The operator can queue multiple scraping tasks. The system distributes tasks to available Local Workers. Completed tasks update their status and store results. Failed tasks are automatically retried based on configured rules.

**Why this priority**: Enables batch operations and resilience, but the system can function with manual single-task execution first. Important for efficiency but not blocking for initial sales.

**Independent Test**: Can be tested by queuing 5 product URLs and verifying all are processed, with success/failure status visible in the interface.

**Acceptance Scenarios**:

1. **Given** multiple tasks are queued, **When** a Local Worker is available, **Then** tasks are assigned in order and processed sequentially
2. **Given** a task fails, **When** retry limit is not exceeded, **Then** the task is re-queued with incremented attempt count
3. **Given** a task exceeds retry limit, **When** checking task status, **Then** it shows as "permanently failed" with failure reason logged

---

### User Story 4 - Worker Network Information Display (Priority: P3)

The operator can view network information from each Local Worker, including the detected ISP (Vivo, Claro, Tim), external IP address, and connection quality metrics. This helps verify residential IP usage.

**Why this priority**: Useful for monitoring and troubleshooting but not essential for core scraping functionality. Provides confidence that residential IPs are being used correctly.

**Independent Test**: Can be tested by connecting a Local Worker and viewing its network details panel showing ISP name and IP address.

**Acceptance Scenarios**:

1. **Given** a Local Worker is connected, **When** viewing worker details, **Then** the ISP name and external IP are displayed
2. **Given** network information is displayed, **When** the worker's network changes, **Then** the displayed information updates within acceptable delay

---

### Edge Cases

- What happens when no Local Workers are available? → Tasks remain queued with "pending" status; operator sees warning about no available workers
- How does the system handle network disconnection during active scraping? → Partial results are discarded; task is marked for retry
- What if Amazon blocks the residential IP? → Worker status includes block detection; operator is alerted to switch network or wait
- How are tasks handled if the main application restarts? → Pending tasks persist in database and resume processing when workers reconnect

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Local Worker applications to register with the main application via WebSocket connection (persistent, bidirectional)
- **FR-002**: System MUST maintain worker connection status through periodic heartbeat mechanism
- **FR-003**: System MUST queue scraping tasks and assign them to available Local Workers
- **FR-004**: Local Worker MUST execute Amazon product page scraping and extract: product title, price, images, ratings, and availability
- **FR-005**: System MUST receive and store scraping results from Local Workers
- **FR-006**: System MUST detect and log scraping failures including CAPTCHAs and access blocks
- **FR-007**: System MUST automatically retry failed tasks up to 3 attempts (configurable) before marking as permanently failed
- **FR-008**: System MUST display connected workers with their status (active/disconnected)
- **FR-009**: Local Worker MUST detect and report its ISP name and external IP address
- **FR-010**: System MUST persist task queue and results to survive application restarts

### Key Entities

- **Local Worker**: A worker instance running on a home network. Attributes: identifier, connection status, ISP name, external IP, last heartbeat timestamp, tasks completed count
- **Scraping Task**: A unit of work to scrape a product. Attributes: product URL, status (pending/in-progress/completed/failed), assigned worker, attempt count, created timestamp, result data
- **Scraping Result**: Data extracted from an Amazon product page. Attributes: product title, price, images URLs, rating, availability status, scraped timestamp
- **Task Queue**: Ordered collection of pending tasks awaiting worker assignment. Relationships: contains many Tasks, assigns to Workers

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: System successfully scrapes 100 consecutive Amazon product pages without encountering blocks or CAPTCHAs using residential IPs
- **SC-002**: Local Worker registration and heartbeat mechanism maintains 99% uptime awareness (detects disconnection within 30 seconds)
- **SC-003**: Task queue processes all submitted tasks with clear completion or failure status within expected timeframes
- **SC-004**: Operator can identify connected workers and their network information within 5 seconds of dashboard load
- **SC-005**: Failed tasks are automatically retried, achieving 95% eventual success rate for transient failures
- **SC-006**: System reaches production-ready state to support generating affiliate links for 3 qualified sales (business goal)

## Assumptions

- The operator has at least one home network connection with a Brazilian residential ISP (Vivo, Claro, or Tim)
- The home network allows outbound HTTPS connections to Amazon.com.br
- The operator can run the Local Worker application on a device within their home network (PC, laptop, or similar)
- Scraping activity will use moderate rate limiting (1 request every 10-15 seconds) to balance throughput with block avoidance
- The main application has a database for persisting tasks and results (existing infrastructure)
