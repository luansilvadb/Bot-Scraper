# Implementation Plan: Refactor Worker to NestJS

**Branch**: `016-worker-to-nestjs` | **Date**: 2026-02-02 | **Spec**: [specs/016-worker-to-nestjs/spec.md](../spec.md)
**Input**: Feature specification from `specs/016-worker-to-nestjs/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor the existing `local-worker` TypeScript application into a modular **NestJS** application. This involves transforming independent service classes (`ScraperService`, `WebsocketClient`) into NestJS Modules and Providers (`ScraperModule`, `CommunicationModule`), leveraging Dependency Injection, and ensuring strict type safety and architectural consistency with the backend while executing as a standalone process.

## Technical Context

**Language/Version**: TypeScript 5.3+ (Node.js 18+ Iron/Hydrogen)
**Primary Framework**: NestJS 10+ (Standalone Application mode)
**Key Dependencies**: 
- `playwright` (Scraping)
- `socket.io-client` (Communication with Backend)
- `@nestjs/config` (Configuration)
- `@nestjs/common`, `@nestjs/core`
**Storage**: N/A (Stateless worker, sends data back to backend)
**Testing**: Jest (Unit), Supertest (E2E mocks)
**Target Platform**: Windows (Local execution), Docker (Deployment)
**Project Type**: Standalone Node.js Service (Worker)
**Performance Goals**: Low overhead wrapper around Playwright; Stable socket connection.
**Constraints**: Must run locally on user machines (Windows) without requiring local Redis/Docker.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Modular Architecture**: ✅ **Plan**: Split functionality into `ScraperModule`, `CommunicationModule`, `ConfigModule`.
- **II. Test Standards**: ✅ **Plan**: Add `*.spec.ts` for all services.
- **IV. Scalability**: ✅ **Plan**: Worker is stateless and can be scaled horizontally (multiple local workers).
- **Tech Stack**: ✅ **Plan**: Using NestJS + TypeScript (Strict) + Playwright.
- **Local Environment**: ✅ **Plan**: No local Docker required; runs via `npm run start`.
- **Warning/Clarification**: Constitution mentions "Redis + BullMQ" for workers.
    - *Justification*: This is a "Local Worker" (edge device), not a server-side worker. It connects via Socket.IO. We will retain Socket.IO for connectivity but use clean NestJS architecture. The "Redis + BullMQ" rule applies to backend-internal job processing.

## Project Structure

### Documentation (this feature)

```text
specs/016-worker-to-nestjs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
worker/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   ├── env.validation.ts
│   │   └── configuration.ts
│   ├── communication/
│   │   ├── communication.module.ts
│   │   ├── socket-client.provider.ts
│   │   └── socket.service.ts
│   ├── scraper/
│   │   ├── scraper.module.ts
│   │   ├── scraper.service.ts
│   │   └── browser.factory.ts
│   └── orchestration/
│       ├── orchestration.module.ts
│       └── worker.orchestrator.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── package.json
├── tsconfig.json
└── nest-cli.json
```

**Structure Decision**: Refactor `worker` to follow standard NestJS CLI structure (`src/`, `test/`) with domain-driven modules.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Socket.IO instead of BullMQ | Worker runs on remote/local user machines without direct Redis access | BullMQ requires direct Redis connection which is not feasible for edge/local workers |
