# Data Model: Worker Entities

**Feature**: [Refactor Worker to NestJS](spec.md)

## Entities

### ScrapeJob
*Represents a unit of work received from the backend.*

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (UUID) | Unique identifier for the job. |
| `url` | `string` | The target URL to scrape. |
| `scrapers` | `Record<string, string>` | Map of field names to CSS selectors (e.g., `{ title: 'h1', price: '.price' }`). |
| `config` | `ScrapeConfig` (Optional) | Specific runtime settings (wait time, headers). |

### ScrapeResult
*Represents the output produced by the worker.*

| Field | Type | Description |
|-------|------|-------------|
| `jobId` | `string` (UUID) | Reference to the original job. |
| `data` | `Record<string, any>` | The scraped key-value pairs. |
| `metadata` | `object` | Execution time, worker ID, timestamp. |
| `error` | `string` (Optional) | Error message if failed. |

### WorkerConfig
*Internal configuration.*

| Field | Type | Source |
|-------|------|--------|
| `backendUrl` | `string` | ENV: `BACKEND_URL` |
| `workerToken` | `string` | ENV: `WORKER_TOKEN` |
| `headless` | `boolean` | ENV: `HEADLESS` (default true) |
