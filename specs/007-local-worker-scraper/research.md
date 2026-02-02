# Research: Local Worker Scraper

**Feature**: 007-local-worker-scraper  
**Date**: 2026-02-01  
**Phase**: 0 - Outline & Research

## Research Summary

All technical unknowns have been researched and resolved. This document captures decisions, rationale, and alternatives considered.

---

## 1. WebSocket Implementation in NestJS

**Decision**: Use `@nestjs/websockets` with `@nestjs/platform-socket.io` (Socket.IO adapter)

**Rationale**:
- Native NestJS integration with decorators and DI
- Socket.IO provides automatic reconnection, room management, and fallback transports
- Proven at scale; handles NAT traversal naturally (worker initiates outbound connection)
- Built-in heartbeat mechanism via `pingInterval` and `pingTimeout`

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Raw WebSocket (`ws` library) | Lower-level; requires manual reconnection, heartbeat, and error handling |
| `@nestjs/platform-ws` | Fewer features than Socket.IO; no auto-reconnection |
| Long Polling | Higher latency; more server resources for same functionality |

**Implementation Notes**:
- Configure `pingInterval: 10000` (10s) and `pingTimeout: 20000` (20s) for 30s disconnection detection
- Use rooms to organize workers by status or ISP if needed later
- Emit typed events using DTOs for type safety

---

## 2. Standalone Worker Application Architecture

**Decision**: Node.js CLI application with TypeScript, packaged as executable via `pkg` or run via `npx ts-node`

**Rationale**:
- Same language as backend (code sharing opportunities)
- Playwright works natively on Windows without Docker
- Can be distributed as single executable for non-technical operators
- TypeScript provides type safety matching backend DTOs

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Electron app | Overkill for headless tasks; larger bundle size |
| Python + Selenium | Different stack; no code sharing with NestJS backend |
| Browser extension | Limited control; can't use Playwright stealth patches |

**Implementation Notes**:
- Use `socket.io-client` for WebSocket connection
- Share DTO types between backend and worker via npm package or direct copy
- Include Playwright with rebrowser-patches for stealth (per constitution)
- Environment variables for server URL, worker name, headless mode

---

## 3. Rate Limiting Strategy Implementation

**Decision**: Worker-side delay with configurable interval (default: 10-15 seconds randomized)

**Rationale**:
- Rate limiting at worker level is simpler and more effective (each worker has its own IP)
- Random jitter (10-15s) prevents detection patterns
- Server doesn't need to manage timing; just dispatches tasks

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Server-side rate limiting | Adds complexity; worker already knows its own state |
| Fixed interval (exactly 10s) | Predictable patterns easier to detect |
| Adaptive based on response time | Over-engineering for MVP; revisit post-API unlock |

**Implementation Notes**:
- `await delay(randomBetween(10000, 15000))` before each scrape
- Log actual delay for debugging
- Make min/max configurable via environment variables

---

## 4. ISP/IP Detection on Local Worker

**Decision**: Query external IP detection service (e.g., `https://ipinfo.io/json`) on startup and periodically

**Rationale**:
- Simple HTTP request; no dependencies
- ipinfo.io returns ISP name (`org` field) and external IP
- Free tier sufficient for occasional checks (worker startup + every 30 min)

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Local network interface inspection | Only shows internal IP; no ISP info |
| Multiple fallback services | Adds complexity; single reliable service sufficient for MVP |
| DNS-based detection | Less reliable; doesn't provide ISP name |

**Implementation Notes**:
- Fetch `https://ipinfo.io/json` with timeout (5s)
- Parse `ip` and `org` fields
- Cache result; refresh every 30 minutes or on demand
- Report to server during registration and heartbeat

---

## 5. Task Persistence and Retry Logic

**Decision**: Prisma models for `ScrapingTask` with status enum and attempt counter; service handles retry logic

**Rationale**:
- Prisma already in use (constitution compliance)
- PostgreSQL provides ACID guarantees for task state
- Status enum: `PENDING | IN_PROGRESS | COMPLETED | FAILED`
- Retry limit (3) stored in task; incremented on failure

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| BullMQ for task queue | Already have BullMQ; but adds complexity for simple sequential worker processing |
| Redis-only storage | Less durable; Prisma already provides persistence |
| In-memory queue | Doesn't survive restarts; violates FR-010 |

**Implementation Notes**:
- `ScrapingTask.attemptCount` incremented on each failure
- When `attemptCount >= 3`, status changes to `PERMANENTLY_FAILED`
- Tasks assigned to workers via `assignedWorkerId` field
- On worker disconnect, reassign in-progress tasks (set back to `PENDING`)

---

## 6. CAPTCHA and Block Detection

**Decision**: Detect via page content analysis (keyword matching + HTTP status codes)

**Rationale**:
- Amazon blocks typically show specific page structures
- HTTP 503/429 status codes indicate throttling
- CAPTCHA pages have identifiable elements

**Detection Signals**:
| Signal | Detection Method |
|--------|------------------|
| CAPTCHA page | Check for `#captchacharacters` selector or "Enter the characters" text |
| Access Denied | HTTP 403 or "Access Denied" in body |
| Throttled | HTTP 429 or 503 |
| Robot Check | "robot check" or "automated access" keywords |

**Implementation Notes**:
- Return structured error with `type: 'CAPTCHA' | 'BLOCKED' | 'THROTTLED' | 'NETWORK'`
- Worker reports error type to server for dashboard display
- Worker can optionally pause on repeated blocks (configurable)

---

## 7. Worker Authentication

**Decision**: Pre-shared token authentication; worker sends token on connection

**Rationale**:
- Simple and sufficient for MVP (single operator)
- Token stored in worker's environment variable
- Server validates token on WebSocket handshake

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| No authentication | Security risk; anyone could connect workers |
| OAuth2 / JWT | Over-engineering for single-operator MVP |
| Certificate-based (mTLS) | Complex setup for home network deployment |

**Implementation Notes**:
- Generate random token, store in `.env` on both server and worker
- Pass token as query param during WS connection: `?token=xxx`
- Reject connection if token mismatch
- Consider worker registration flow post-MVP (dashboard UI to generate tokens)

---

## Resolved NEEDS CLARIFICATION Items

| Item | Resolution |
|------|------------|
| Rate limiting strategy | Moderate: 10-15s randomized delay, worker-side |
| Worker-Server communication | Socket.IO WebSocket (bidirectional, auto-reconnect) |
| Retry attempts | 3 retries before permanent failure |
| Worker authentication | Pre-shared token in environment variable |
| ISP detection | ipinfo.io API call on startup + periodic refresh |
| Block detection | Page content analysis + HTTP status codes |

---

## Dependencies to Add

### Backend (backend/package.json)
```json
{
  "@nestjs/websockets": "^11.x",
  "@nestjs/platform-socket.io": "^11.x"
}
```

### Worker (worker/package.json)
```json
{
  "socket.io-client": "^4.x",
  "playwright": "^1.58.x",
  "axios": "^1.x"
}
```

---

## Next Steps

Proceed to **Phase 1: Design & Contracts** to generate:
- `data-model.md` - Prisma schema additions
- `contracts/` - WebSocket event definitions
- `quickstart.md` - Local development setup
