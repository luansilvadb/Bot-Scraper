# WebSocket Events Contract

**Feature**: 007-local-worker-scraper  
**Date**: 2026-02-01  
**Protocol**: Socket.IO over WebSocket

## Connection

### Endpoint
```
wss://{server}/workers
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | Yes | Pre-shared worker authentication token |

### Connection Handshake
```typescript
// Client connects with:
const socket = io('wss://server/workers', {
  query: { token: 'worker-auth-token-here' }
});
```

### Connection Response
- **Success**: Connection established, `worker:registered` event emitted
- **Failure**: Connection rejected with `error` event

---

## Events: Server → Worker

### `worker:registered`
Confirms successful registration after connection.

```typescript
interface WorkerRegisteredPayload {
  workerId: string;      // Assigned worker UUID
  serverTime: string;    // ISO 8601 timestamp
  config: {
    heartbeatInterval: number;  // Recommended interval in ms (default: 10000)
    taskTimeout: number;        // Max task execution time in ms (default: 60000)
  };
}
```

### `task:assigned`
Server pushes a new task to the worker.

```typescript
interface TaskAssignedPayload {
  taskId: string;           // Task UUID
  productUrl: string;       // Amazon product URL to scrape
  priority: number;         // Task priority (0-100)
  attemptNumber: number;    // Current attempt (1, 2, or 3)
  assignedAt: string;       // ISO 8601 timestamp
}
```

### `task:cancelled`
Server cancels a previously assigned task (e.g., operator action).

```typescript
interface TaskCancelledPayload {
  taskId: string;
  reason: string;
}
```

### `worker:config_update`
Server sends updated configuration (e.g., rate limit change).

```typescript
interface ConfigUpdatePayload {
  rateLimit?: {
    minDelayMs: number;
    maxDelayMs: number;
  };
  headless?: boolean;
}
```

---

## Events: Worker → Server

### `worker:heartbeat`
Worker sends periodic heartbeat with status update.

```typescript
interface WorkerHeartbeatPayload {
  status: 'idle' | 'busy' | 'blocked';
  currentTaskId?: string;      // If busy, which task
  networkInfo: {
    externalIp: string;
    ispName: string;
    lastCheckedAt: string;     // ISO 8601
  };
  stats: {
    tasksCompleted: number;    // Since connection
    tasksFailed: number;       // Since connection
    uptime: number;            // Seconds since connection
  };
}
```

**Expected Interval**: Every 10 seconds  
**Timeout**: 30 seconds without heartbeat = DISCONNECTED

### `task:started`
Worker acknowledges task receipt and begins processing.

```typescript
interface TaskStartedPayload {
  taskId: string;
  startedAt: string;   // ISO 8601 timestamp
}
```

### `task:completed`
Worker reports successful scrape with extracted data.

```typescript
interface TaskCompletedPayload {
  taskId: string;
  completedAt: string;
  result: {
    productTitle: string;
    price: number | null;
    currency: string;
    originalPrice: number | null;
    rating: number | null;
    reviewCount: number | null;
    availability: string | null;
    isAvailable: boolean;
    imageUrls: string[];
    asin: string | null;
  };
  metrics: {
    scrapeDurationMs: number;
    pageLoadTimeMs: number;
  };
}
```

### `task:failed`
Worker reports scrape failure.

```typescript
interface TaskFailedPayload {
  taskId: string;
  failedAt: string;
  error: {
    type: 'CAPTCHA' | 'BLOCKED' | 'THROTTLED' | 'NETWORK' | 'PARSE_ERROR' | 'TIMEOUT';
    message: string;
    details?: string;    // Stack trace or additional info
  };
  metrics?: {
    attemptDurationMs: number;
  };
}
```

### `worker:network_changed`
Worker reports IP/ISP change (detected during operation).

```typescript
interface NetworkChangedPayload {
  previousIp: string;
  currentIp: string;
  previousIsp: string;
  currentIsp: string;
  changedAt: string;
}
```

### `worker:block_detected`
Worker reports suspected block (multiple failures or CAPTCHA).

```typescript
interface BlockDetectedPayload {
  detectedAt: string;
  reason: string;
  suggestedAction: 'wait' | 'change_network' | 'manual_intervention';
  failedTaskIds: string[];
}
```

---

## Events: Bidirectional

### `error`
Generic error event.

```typescript
interface ErrorPayload {
  code: string;          // Error code (e.g., 'AUTH_FAILED', 'INVALID_PAYLOAD')
  message: string;       // Human-readable message
  timestamp: string;     // ISO 8601
}
```

---

## REST API Endpoints

These endpoints complement WebSocket for dashboard operations.

### Workers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workers` | List all workers with status |
| GET | `/api/workers/:id` | Get single worker details |
| POST | `/api/workers` | Create new worker (generates token) |
| DELETE | `/api/workers/:id` | Delete worker |
| POST | `/api/workers/:id/reset` | Reset blocked worker status |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (with filters) |
| GET | `/api/tasks/:id` | Get task details with result |
| POST | `/api/tasks` | Create new scraping task |
| POST | `/api/tasks/batch` | Create multiple tasks |
| DELETE | `/api/tasks/:id` | Cancel/delete task |
| POST | `/api/tasks/:id/retry` | Force retry a failed task |

### Task Filters (GET /api/tasks)

| Query Param | Type | Description |
|-------------|------|-------------|
| status | string | Filter by status (comma-separated) |
| workerId | string | Filter by assigned worker |
| from | string | Created after (ISO 8601) |
| to | string | Created before (ISO 8601) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |

---

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_FAILED | Invalid or missing authentication token |
| WORKER_NOT_FOUND | Referenced worker does not exist |
| TASK_NOT_FOUND | Referenced task does not exist |
| INVALID_PAYLOAD | Malformed event payload |
| RATE_LIMITED | Too many requests |
| INTERNAL_ERROR | Server-side error |

---

## Type Definitions (TypeScript)

```typescript
// Shared between backend and worker

export type WorkerStatus = 'idle' | 'busy' | 'blocked';

export type TaskErrorType = 
  | 'CAPTCHA' 
  | 'BLOCKED' 
  | 'THROTTLED' 
  | 'NETWORK' 
  | 'PARSE_ERROR' 
  | 'TIMEOUT';

export interface NetworkInfo {
  externalIp: string;
  ispName: string;
  lastCheckedAt: string;
}

export interface ScrapedProduct {
  productTitle: string;
  price: number | null;
  currency: string;
  originalPrice: number | null;
  rating: number | null;
  reviewCount: number | null;
  availability: string | null;
  isAvailable: boolean;
  imageUrls: string[];
  asin: string | null;
}

export interface ScrapeMetrics {
  scrapeDurationMs: number;
  pageLoadTimeMs: number;
}
```
