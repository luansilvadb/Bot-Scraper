# Implementation Plan: Local Worker Scraper for MVP

**Branch**: `007-local-worker-scraper` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-local-worker-scraper/spec.md`

## Summary

This feature implements a **distributed scraping architecture** where Local Workers running on home networks connect to the main application via WebSocket. Workers use their residential IPs (Vivo/Claro/Tim) to scrape Amazon product pages, avoiding blocks and CAPTCHAs. The goal is to achieve 3 qualified sales to unlock Amazon's official API—a Zero Cost strategy eliminating proxy expenses before revenue generation.

**Technical Approach**: 
- WebSocket Gateway on NestJS backend for real-time bidirectional communication
- Worker management module (registration, heartbeat, task assignment)
- Task queue with persistence (Prisma/PostgreSQL) and automatic retry (3 attempts)
- Standalone Local Worker application (Node.js executable) for home network deployment
- Rate limiting (10-15 seconds between requests) built into worker logic

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) / Node.js LTS  
**Primary Dependencies**: NestJS 11, Prisma ORM, @nestjs/websockets, @nestjs/platform-socket.io, Playwright  
**Storage**: PostgreSQL (existing via Prisma)  
**Testing**: Jest (unit), Supertest (E2E)  
**Target Platform**: Windows (Local Worker), Linux server (main app)  
**Project Type**: Web application (backend + frontend + standalone worker)  
**Performance Goals**: Process tasks with 10-15s rate limit; detect worker disconnection within 30 seconds  
**Constraints**: No Docker locally; native Node.js/PostgreSQL/Redis on Windows  
**Scale/Scope**: 1-3 Local Workers initially; 100+ consecutive scrapes without blocks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Arquitetura Modular e Tipagem** | ✅ PASS | New `workers` module (domain-specific), strict TS, DTOs for WebSocket messages |
| **II. Padrões de Teste** | ✅ PASS | Unit tests for services, E2E for WebSocket events, Dry Run mode in worker |
| **III. Experiência do Usuário e Consistência** | ✅ PASS | Real-time feedback via WebSocket; standard API envelope for REST endpoints |
| **IV. Escalabilidade e Assincronia** | ✅ PASS | Stateless API; heavy scraping offloaded to external Workers (not blocking main app) |
| **Tecnologias Principais** | ✅ PASS | NestJS + Prisma + Playwright (existing stack) |
| **Restrições do Ambiente Local** | ✅ PASS | No Docker; native Windows execution for Local Worker |

**Overall Gate Status**: ✅ **PASSED** - No violations

## Project Structure

### Documentation (this feature)

```text
specs/007-local-worker-scraper/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── websocket-events.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── modules/
│   │   ├── workers/                 # NEW: Worker management module
│   │   │   ├── workers.module.ts
│   │   │   ├── workers.gateway.ts   # WebSocket gateway
│   │   │   ├── workers.service.ts   # Worker registry, heartbeat logic
│   │   │   ├── workers.controller.ts # REST endpoints for dashboard
│   │   │   ├── dto/
│   │   │   │   ├── register-worker.dto.ts
│   │   │   │   ├── worker-heartbeat.dto.ts
│   │   │   │   ├── task-result.dto.ts
│   │   │   │   └── worker-status.dto.ts
│   │   │   └── entities/
│   │   │       └── worker.entity.ts
│   │   ├── tasks/                   # NEW: Task queue module
│   │   │   ├── tasks.module.ts
│   │   │   ├── tasks.service.ts     # Queue management, retry logic
│   │   │   ├── tasks.controller.ts  # REST endpoints
│   │   │   └── dto/
│   │   │       ├── create-task.dto.ts
│   │   │       └── task-status.dto.ts
│   │   └── scraping/                # EXISTING: Extend with worker integration
│   └── prisma/
│       └── schema.prisma            # ADD: Worker, ScrapingTask models

frontend/
├── src/
│   ├── pages/
│   │   └── workers/                 # NEW: Worker management UI
│   │       └── index.tsx
│   └── components/
│       └── workers/                 # NEW: Worker status components
│           ├── WorkerList.tsx
│           ├── WorkerCard.tsx
│           └── TaskQueue.tsx

worker/                              # NEW: Standalone Local Worker app
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts                      # Entry point
│   ├── worker.service.ts            # Core worker logic
│   ├── scraper.service.ts           # Playwright scraping
│   ├── network.service.ts           # ISP/IP detection
│   └── websocket.client.ts          # WS connection to server
└── README.md                        # Installation & usage
```

**Structure Decision**: Web application with backend + frontend + NEW standalone `worker/` directory for the Local Worker application. This keeps the worker deployable independently on home networks.

## Complexity Tracking

> No violations detected - no complexity justification needed.

---

## Phase Status

| Phase | Status | Artifacts |
|-------|--------|-----------|
| Phase 0: Research | ✅ Complete | [research.md](./research.md) |
| Phase 1: Design | ✅ Complete | [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md) |
| Phase 2: Tasks | ✅ Complete | [tasks.md](./tasks.md) |
| Phase 3: MVP Scraper | ✅ Complete | (Backend/Worker implementation) |
| Phase 4: Registration | ✅ Complete | (Backend/Worker implementation) |
| Phase 5: Queue | ✅ Complete | (Backend/Worker implementation) |
| Phase 6: Network Info | ✅ Complete | (Backend/Worker implementation) |
| Phase 7: Frontend | 🚧 Ready | UI Implementation |

---

## Generated Artifacts Summary

1. **research.md** - Technical decisions for WebSocket, worker architecture, rate limiting, authentication
2. **data-model.md** - Prisma schema additions (LocalWorker, ScrapingTask, ScrapingResult)
3. **contracts/websocket-events.md** - Full WebSocket event definitions and REST API endpoints
4. **quickstart.md** - Development setup guide and verification checklist
5. **tasks.md** - Detailed implementation task list

## Next Step

Begin implementation of Phase 7: Frontend Dashboard (WorkerList, TaskQueue components) to visualize the workers.
