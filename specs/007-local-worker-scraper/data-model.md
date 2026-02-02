# Data Model: Local Worker Scraper

**Feature**: 007-local-worker-scraper  
**Date**: 2026-02-01  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data entities required for the Local Worker Scraper feature. These models will be added to the existing Prisma schema.

---

## Entity Relationship Diagram (Conceptual)

```
┌─────────────────┐       ┌──────────────────┐
│   LocalWorker   │───────│   ScrapingTask   │
│                 │ 1   * │                  │
└─────────────────┘       └──────────────────┘
        │                          │
        │                          │ 1
        │                          ▼
        │                 ┌──────────────────┐
        │                 │  ScrapingResult  │
        │                 │                  │
        │                 └──────────────────┘
        │
        └─────► In-memory only (not persisted):
                - WebSocket connection state
                - Real-time heartbeat tracking
```

---

## Entities

### 1. LocalWorker

Represents a worker instance that connects from a home network.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (UUID) | PK, auto-generated | Unique identifier |
| name | String | Required, max 100 chars | Human-readable worker name |
| token | String | Required, unique, indexed | Pre-shared authentication token |
| ispName | String | Optional | Detected ISP (e.g., "Vivo", "Claro") |
| externalIp | String | Optional | Current external IPv4 address |
| status | Enum | Required, default DISCONNECTED | Connection status |
| lastHeartbeatAt | DateTime | Optional | Last successful heartbeat timestamp |
| tasksCompletedCount | Int | Required, default 0 | Total successful tasks |
| tasksFailedCount | Int | Required, default 0 | Total failed tasks |
| createdAt | DateTime | Auto, default now() | Registration timestamp |
| updatedAt | DateTime | Auto, updated on change | Last update timestamp |

**Status Enum Values**:
- `DISCONNECTED` - Not currently connected
- `CONNECTED` - WebSocket connected, idle
- `BUSY` - Currently processing a task
- `BLOCKED` - Detected as blocked by Amazon (manual intervention needed)

**Indexes**:
- `token` (unique) - Fast lookup during authentication
- `status` - Query connected workers

**Relationships**:
- Has many `ScrapingTask` (assignedWorker)

---

### 2. ScrapingTask

Represents a unit of work to scrape an Amazon product page.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (UUID) | PK, auto-generated | Unique identifier |
| productUrl | String | Required, max 2048 chars | Amazon product URL to scrape |
| status | Enum | Required, default PENDING | Current task status |
| priority | Int | Required, default 0 | Higher = processed first |
| attemptCount | Int | Required, default 0 | Number of attempts made |
| maxAttempts | Int | Required, default 3 | Maximum retry attempts |
| assignedWorkerId | String | Optional, FK to LocalWorker | Currently assigned worker |
| errorType | String | Optional | Last error type (CAPTCHA, BLOCKED, etc.) |
| errorMessage | String | Optional | Last error details |
| startedAt | DateTime | Optional | When processing started |
| completedAt | DateTime | Optional | When processing completed |
| createdAt | DateTime | Auto, default now() | Task creation timestamp |
| updatedAt | DateTime | Auto, updated on change | Last update timestamp |

**Status Enum Values**:
- `PENDING` - Waiting to be assigned
- `IN_PROGRESS` - Currently being processed
- `COMPLETED` - Successfully scraped
- `FAILED` - Failed temporarily (will retry)
- `PERMANENTLY_FAILED` - Exceeded max attempts

**Indexes**:
- `status` - Query pending tasks
- `assignedWorkerId` - Find tasks for a worker
- `createdAt` - Order by creation time (FIFO queue)
- Composite: `(status, priority, createdAt)` - Efficient task selection

**Relationships**:
- Belongs to `LocalWorker` (optional, via assignedWorkerId)
- Has one `ScrapingResult` (optional)

---

### 3. ScrapingResult

Stores the extracted product data from a successful scrape.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (UUID) | PK, auto-generated | Unique identifier |
| taskId | String | Required, FK to ScrapingTask, unique | Parent task |
| productTitle | String | Required, max 500 chars | Product title |
| price | Decimal | Optional | Current price (null if unavailable) |
| currency | String | Optional, default "BRL" | Price currency code |
| originalPrice | Decimal | Optional | Original/list price if on sale |
| rating | Decimal | Optional | Average rating (0-5) |
| reviewCount | Int | Optional | Number of reviews |
| availability | String | Optional | Availability text |
| isAvailable | Boolean | Required, default true | In stock flag |
| imageUrls | String[] | Optional | Array of image URLs |
| asin | String | Optional, max 20 chars | Amazon Standard ID |
| scrapedAt | DateTime | Required, default now() | When data was captured |
| createdAt | DateTime | Auto, default now() | Record creation timestamp |

**Indexes**:
- `taskId` (unique) - One result per task
- `asin` - Lookup by ASIN
- `scrapedAt` - Query by scrape date

**Relationships**:
- Belongs to `ScrapingTask` (via taskId)

---

## Prisma Schema Additions

```prisma
// Add to backend/prisma/schema.prisma

enum WorkerStatus {
  DISCONNECTED
  CONNECTED
  BUSY
  BLOCKED
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
  PERMANENTLY_FAILED
}

model LocalWorker {
  id                  String       @id @default(uuid())
  name                String       @db.VarChar(100)
  token               String       @unique
  ispName             String?      @db.VarChar(50)
  externalIp          String?      @db.VarChar(45) // IPv6 compatible
  status              WorkerStatus @default(DISCONNECTED)
  lastHeartbeatAt     DateTime?
  tasksCompletedCount Int          @default(0)
  tasksFailedCount    Int          @default(0)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  // Relations
  tasks ScrapingTask[]

  @@index([status])
}

model ScrapingTask {
  id               String     @id @default(uuid())
  productUrl       String     @db.VarChar(2048)
  status           TaskStatus @default(PENDING)
  priority         Int        @default(0)
  attemptCount     Int        @default(0)
  maxAttempts      Int        @default(3)
  assignedWorkerId String?
  errorType        String?    @db.VarChar(50)
  errorMessage     String?
  startedAt        DateTime?
  completedAt      DateTime?
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  // Relations
  assignedWorker LocalWorker?    @relation(fields: [assignedWorkerId], references: [id])
  result         ScrapingResult?

  @@index([status])
  @@index([assignedWorkerId])
  @@index([status, priority, createdAt])
}

model ScrapingResult {
  id            String   @id @default(uuid())
  taskId        String   @unique
  productTitle  String   @db.VarChar(500)
  price         Decimal? @db.Decimal(10, 2)
  currency      String   @default("BRL") @db.VarChar(3)
  originalPrice Decimal? @db.Decimal(10, 2)
  rating        Decimal? @db.Decimal(2, 1)
  reviewCount   Int?
  availability  String?
  isAvailable   Boolean  @default(true)
  imageUrls     String[] @default([])
  asin          String?  @db.VarChar(20)
  scrapedAt     DateTime @default(now())
  createdAt     DateTime @default(now())

  // Relations
  task ScrapingTask @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([asin])
  @@index([scrapedAt])
}
```

---

## State Transitions

### Worker Status Transitions

```
DISCONNECTED ──[WS connect]──► CONNECTED
CONNECTED ────[task assigned]──► BUSY
BUSY ─────────[task complete]──► CONNECTED
BUSY ─────────[block detected]─► BLOCKED
BLOCKED ──────[manual reset]───► CONNECTED
CONNECTED ────[heartbeat timeout]─► DISCONNECTED
BUSY ─────────[heartbeat timeout]─► DISCONNECTED (task reassigned)
```

### Task Status Transitions

```
PENDING ──────[worker assigned]──► IN_PROGRESS
IN_PROGRESS ──[success]──────────► COMPLETED
IN_PROGRESS ──[failure, retries left]──► FAILED ──[retry]──► PENDING
IN_PROGRESS ──[failure, no retries]──► PERMANENTLY_FAILED
IN_PROGRESS ──[worker disconnects]──► PENDING (reassign)
```

---

## Validation Rules

### LocalWorker
- `name`: 1-100 characters, alphanumeric with spaces/hyphens
- `token`: 32+ characters, generated server-side

### ScrapingTask
- `productUrl`: Must match Amazon URL pattern (`amazon.com.br/dp/` or `/gp/product/`)
- `priority`: 0-100 range
- `maxAttempts`: 1-10 range

### ScrapingResult
- `rating`: 0.0-5.0 range
- `price` and `originalPrice`: Positive values only
