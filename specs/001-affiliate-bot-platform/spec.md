# Feature Specification: Plataforma de Gestão de Bots de Afiliação

**Feature Branch**: `001-affiliate-bot-platform`
**Created**: 31/01/2026
**Status**: Draft
**Input**: User description maps to PRD v1.4

## User Scenarios & Testing *(mandatory)*

<!--
  Prioritized user journeys.
-->

## Clarifications

### Session 2026-02-01
- Q: Amazon Authentication Strategy? -> A: Guest Mode (No Login). Scrape publicly; append affiliate tag.
- Q: Profit Algorithm Logic? -> A: Discount % Only (MVP).
- Q: Telegram Posting Structure? -> A: 1 Bot = 1 Channel.
- Q: Approval Center Capability? -> A: Approve/Reject Only (No Editing).
- Q: Proxy Assignment Strategy? -> A: One-to-One (Dedicated).
- Q: Database Technology? -> A: PostgreSQL (Dockerized).
- Q: Primary Dashboard Metric? -> A: Items Scraped vs. Posted (Conversion Funnel).
- Q: Critical Alert Mechanism? -> A: Telegram message (Admin Channel).
- Q: Dashboard Authentication? -> A: Single Password Auth (Simple Admin Login).
- Q: Backend Technology Stack? -> A: Node.js (TypeScript).
- Q: Specialized Frameworks? -> A: NestJS (Backend) + Vite React (Frontend).
- Q: Job Queue System? -> A: BullMQ (Redis).
- Q: Scraping Engine? -> A: Playwright (ARM64 Compatible).
- Q: Deployment Strategy? -> A: Docker Compose (Easypanel Stack).

### User Story 1 - Centralized Bot Management (Priority: P0 - MVP)

As an Affiliate Manager (Admin), I want to view and manage all my affiliation bots (initially Amazon) in a single dashboard so that I can monitor their status and intervene quickly without editing configuration files.

**Why this priority**: Essential for the core value proposition of reducing operational overhead and replacing manual .env editing.

**Independent Test**: Can be tested by creating a bot, seeing it in the list, pausing it, and verifying it stops running.

**Acceptance Scenarios**:

1. **Given** the dashboard is open, **When** I view the home screen, **Then** I see a summary of active/paused bots and a graph of performance.
2. **Given** the bot list, **When** I select a bot and click "Pause", **Then** the bot status changes to "Paused" and no new scraping jobs are scheduled for it.
3. **Given** the "Create Bot" modal, **When** I enter target (Amazon), Affiliate Tag, Telegram Token, and schedule, **Then** a new bot instance is created.

---

### User Story 2 - Automated Scraping with Safety Limits (Priority: P0 - MVP)

As a Business Owner, I want the system to scrape products automatically while mimicking human behavior and filtering strictly by profit potential, so that I generate revenue without getting banned.

**Why this priority**: Core revenue-generating activity. Without this, the platform does nothing.

**Independent Test**: Can be tested by triggering a bot run and verifying it fetches products, respects the "80% discount" safety lock, and posts valid results.

**Acceptance Scenarios**:

1. **Given** a configured bot, **When** the scheduled time arrives, **Then** the system initiates a stealth scraping session using the assigned proxy.
2. **Given** a product with >80% discount is found, **When** the profit algorithm runs, **Then** the product is NOT posted immediately but sent to the "Approval Center".
3. **Given** a scraping session, **When** the bot navigates, **Then** it applies random delays (jitter) and rotates user agents to avoid detection.

---

### User Story 3 - Visual Approval of Risky Offers (Priority: P0 - MVP)

As a Manager, I want to manually approve offers that look "too good to be true" (e.g., >80% off) via a visual interface, so that I don't damage my reputation by posting pricing errors or scams.

**Why this priority**: Critical risk mitigation feature defined in business objectives.

**Independent Test**: Can be tested by mocking a high-discount item and verifying it appears in the Approval Center and can be acted upon.

**Acceptance Scenarios**:

1. **Given** items in the Approval Center, **When** I select multiple items and click "Approve", **Then** they are queued for posting.
2. **Given** an item stays in the Approval Center for more than 12 hours, **When** the timeout expires, **Then** the item is automatically discarded to prevent stale offers.
3. **Given** the Approval Grid, **When** I view an item, **Then** I see the product image, price comparison, and calculated discount clearly.

---

### User Story 4 - Proxy & Infra Management (Priority: P0 - MVP)

As an Admin, I want to configure residential proxies and ensure the system runs on my ARM64 infrastructure, so that I can utilize low-cost hardware/cloud tiers without being blocked.

**Why this priority**: Enables the zero-cost infrastructure model (Oracle Free Tier) and scraping viability.

**Independent Test**: Can be tested by configuring a proxy and verifying the scraper uses that IP address.

**Acceptance Scenarios**:

1. **Given** the Proxy Manager, **When** I add a new residential proxy tunnel, **Then** the scraper uses this connection for requests.
2. **Given** the system is deployed, **When** it runs on an ARM64 environment, **Then** all services (scraping, backend) function correctly without emulation errors.
3. **Given** a proxy failure, **When** the scraper detects connectivity loss, **Then** the bot pauses and alerts the admin (failover).

---

### Edge Cases

- **Proxy/Network Failure**: If the proxy connection drops during a scrape, the bot MUST pause execution, log the error, and alert the admin (via Telegram) instead of retrying indefinitely (which exploits local IP or causes bans).
- **Target Site DOM Changes**: If the scraper cannot find expected elements (selectors fail), it MUST abort the session and mark the bot as "Check Needed" to prevent error spam.
- **Authentication Failure**: If Proxy or Telegram credentials fail, the bot MUST pause and request manual intervention. (Note: Amazon Login is not used/required).
- **Empty Search Results**: If a search yields zero results, the bot MUST NOT post any message and simply log the event.
- **Rate Limiting (429)**: If the target site returns 429 status, the bot MUST stop immediately and sleep for a configurable "cool-down" period before next run attempt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a web-based Dashboard with summary widgets for "Pending Approvals" and a "Performance Graph" displaying Items Scraped vs. Successfully Posted over time.
- **FR-002**: System MUST allow CRUD operations for Bots (Create, Read, Update, Delete) with status indicators (Active/Paused).
- **FR-003**: System MUST support configurable scheduling per bot (e.g., every 8h, 12h, 24h).
- **FR-004**: System MUST securely encrypt and store Telegram Bot Tokens and Amazon Affiliate Tags. Amazon Login credentials are NOT required (Guest Mode).
- **FR-005**: System MUST implement an "Approval Center" for review. Actions are limited to "Approve" (queue for post) or "Reject" (discard). Editing of item details is NOT supported in MVP.
- **FR-006**: System MUST allow management of Proxies (add/remove) and REQUIRE manual assignment of 1 Proxy per Bot instance.
- **FR-007**: System MUST use advanced stealth techniques (e.g., browser fingerprinting protection, user-agent rotation) to evade bot detection.
- **FR-008**: System MUST sort/filter scraped results based on Discount Percentage only (MVP). Commission calculation is deferred.
- **FR-009**: System MUST enforce a defined posting flow: Scrape -> Filter -> Safety Check (>80% off goes to Approval) -> Queue -> Post.
- **FR-010**: System MUST implement throttling and jitter (randomized delays) between actions to mimic human behavior (e.g., max 20 msgs/min).
- **FR-011**: System MUST automatically clean up logs (Debug/Info after 24h, Error/Sales after 30 days) to manage storage.
- **FR-012**: System MUST support Spintax templates for message generation to ensure variation in posted content.
- **FR-013**: System MUST protect Dashboard access via a simple "Single Password" login screen (no multi-user registration required).

### Non-Functional Requirements

- **NFR-001**: System MUST be compatible with ARM64 architecture (specifically for Oracle Cloud Ampere instances).
- **NFR-002**: UI MUST follow the "Microsoft Fluent Design 2" aesthetic (Mica effects, native Windows 11 look and feel).
- **NFR-003**: Scraping and Posting processes MUST be decoupled (e.g., via queues) to ensure system stability.
- **NFR-004**: Sensitive data (tokens, passwords) MUST be stored encrypted at rest.
- **NFR-005**: System MUST use PostgreSQL as the persistent data store (run via Docker).
- **NFR-006**: System MUST use Node.js (TypeScript) with **NestJS** for the backend to handle long-running processes (Scheduler/Cron).
- **NFR-007**: Frontend MUST be a Single Page Application (SPA) built with **Vite + React**.
- **NFR-008**: System MUST use **Redis** (Dockerized) to handle job queues (BullMQ) for scraping tasks.
- **NFR-009**: System MUST use **Playwright** for scraping, ensuring compatibility with ARM64 architecture (Oracle Cloud).
- **NFR-010**: System deployment MUST be defined via a `docker-compose.yml` stack compatible with Easypanel, ensuring Frontend and Backend run as separate, isolated services.

### Key Entities *(include if feature involves data)*

- **Bot**: A configuration instance mapping 1 target (Amazon) to 1 Telegram Channel and 1 Dedicated Proxy. Contains Schedule, Affiliate Tag, and Telegram Token.
- **ScrapedItem**: A product found during scraping, containing meta-data (price, image, link, commissions).
- **Proxy**: Network configuration used by bots to route traffic.
- **ApprovalQueueItem**: A ScrapedItem that triggered a safety rule and awaits manual intervention.
- **Template**: A text pattern (Spintax) used to generate the final telegram message.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero bot accounts blocked due to Rate Limits or Anti-bot detection during the validation period.
- **SC-002**: System maintains 99% uptime for scheduled scraping jobs (excluding external network failures).
- **SC-003**: Configuration of a new bot instance takes less than 5 minutes.
- **SC-004**: "Approval Center" items are processed (approved/expired) within 12 hours of detection (system logic enforcement).
