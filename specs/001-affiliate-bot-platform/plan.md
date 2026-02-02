# Implementation Plan: 001-affiliate-bot-platform

**Branch**: `001-affiliate-bot-platform` | **Date**: 2026-02-01 | **Spec**: [specs/001-affiliate-bot-platform/spec.md](specs/001-affiliate-bot-platform/spec.md)
**Input**: Feature specification from `/specs/001-affiliate-bot-platform/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a unified "Affiliate Bot Platform" consisting of a NestJS backend (handling scraping logic via Playwright + BullMQ) and a Vite+React frontend (Admin Dashboard). The system will run on Oracle Cloud (ARM64) managed by Easypanel, using PostgreSQL for data and Redis for queues. Key features include bot CRUD, automated scraping with profit filters, and a visual approval center.

## Technical Context

**Language/Version**: Node.js 20+ (LTS), TypeScript 5+ (Strict Mode)
**Primary Dependencies**: 
- Backend: NestJS 10, Prisma (ORM), BullMQ (Queue), Playwright (Scraping), Telegraf (Telegram)
- Frontend: Vite, React 18, TanStack Query, TailwindCSS (with Fluent UI/Radix primitives), Recharts
**Storage**: PostgreSQL (Data), Redis (Queues/Cache)
**Testing**: Jest (Backend unit/e2e), Vitest (Frontend)
**Target Platform**: Oracle Cloud Ampere (ARM64) via Docker/Easypanel
**Project Type**: Monorepo (Frontend + Backend)
**Performance Goals**: Support concurrent crawling (~20 bots); Dashboard load <500ms
**Constraints**: 
- Must run natively on ARM64 (Playwright specific Docker images)
- Local dev must work without Docker (Windows native)
- single-password auth for simpler MVP
**Scale/Scope**: ~50 active bots, ~10k daily items scraped

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Modular Architecture & Typing**: ✅ Plan uses NestJS modular architecture and strict TypeScript.
- **II. Testing Standards**: ✅ Jest/Vitest included. Dry-run mode for scrapers to be implemented.
- **III. UX & Consistency**: ✅ Fluent Design 2 specified. Websockets/Polling for job status.
- **IV. Scalability & Asynchrony**: ✅ BullMQ separates API from Scraping. Stateless API design.
- **Tech Stack**: ✅ Node, NestJS, Prisma, Redis, Playwright all match constitution.
- **Local Env**: ✅ Local dev is native; Docker used only for cloud deployment.

## Project Structure

### Documentation (this feature)

```text
specs/001-affiliate-bot-platform/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Monorepo Structure
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/             # Interceptors, Decorators, DTOs
│   ├── modules/
│   │   ├── bots/           # Bot CRUD
│   │   ├── scraping/       # BullMQ Processors + Playwright
│   │   ├── products/       # Scraped Items + Approval
│   │   ├── proxy/          # Proxy management
│   │   ├── telegram/       # Bot messaging
│   │   └── auth/           # Simple password guard
│   └── prisma/             # Schema & Client
├── test/
└── package.json

frontend/
├── src/
│   ├── components/         # Shared UI (Fluent Design)
│   ├── features/           # Dashboard, BotList, ApprovalCenter
│   ├── hooks/              # API queries
│   ├── lib/                # Utils
│   └── main.tsx
├── public/
└── package.json

docker-compose.yml          # For Easypanel (Prod)
Dockerfile.backend          # ARM64 ready
Dockerfile.frontend         # Nginx/Serve build
```

**Structure Decision**: Selected "Monorepo" style layout with explicit `backend` and `frontend` implementation directories to align with the separate frameworks (NestJS/Vite) while keeping them in one repo for easier solo-dev management.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | | |
