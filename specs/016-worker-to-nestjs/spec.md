# Feature Specification: Refactor Worker to NestJS

**Feature Branch**: `016-worker-to-nestjs`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "quero que seja refatorado para nestjs mas separado do backend"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Refactor Worker to NestJS (Priority: P1)

As a developer, I want the scraper worker service to be built using the NestJS framework, so that it shares the same dependency injection system, architectural patterns, and testing capabilities as the backend, while remaining a physically separate deployment.

**Why this priority**: Unifies the tech stack and improves maintainability of the worker service.

**Independent Test**: Start the `worker` service independently and verify it initializes a NestJS application context, connects to the necessary communication channels (e.g., Socket.IO/Redis), and can handle a dummy task.

**Acceptance Scenarios**:

1. **Given** the `worker` directory, **When** `npm run start` is executed, **Then** a NestJS application successfully starts.
2. **Given** the new worker structure, **When** the code is inspected, **Then** it follows NestJS module/controller/service patterns (no loose script files like `main.ts` with direct logic).
3. **Given** the worker and backend running, **When** the worker starts, **Then** it does NOT share the same process or runtime as the backend (it runs as a separate service).

### User Story 2 - Maintain Separation of Concerns (Priority: P2)

As a system architect, I want to ensure that despite using the same framework (NestJS), the `backend` and `worker` projects remain decoupled, so that they can be scaled independently.

**Why this priority**: Explicit user requirement ("separado do backend"). Prevents monolithic coupling.

**Independent Test**: Stop the `backend` service. The `worker` service should still be able to start (though it might retry connections). It should not crash primarily because of missing shared code references that assume a monorepo structure unless explicitly designed as a shared library.

**Acceptance Scenarios**:

1. **Given** the `worker` project, **When** compiled, **Then** it does not import modules directly from the `backend/src` directory (it should match strict separation).
2. **Given** the system deployment, **When** deployed, **Then** the worker is run as a distinct command/container from the backend.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The worker service MUST be a valid NestJS application (using `@nestjs/core`, `@nestjs/common`, etc.).
- **FR-002**: The worker MUST retain all existing scraping capabilities (Playwright) after refactoring.
- **FR-003**: The worker MUST execute as a standalone process, separate from the main backend API.
- **FR-004**: The worker configuration (ConfigModule) MUST be independent of the backend's configuration (though they may share env structure).
- **FR-005**: communication logic (Socket.IO client or Queue consumer) MUST be encapsulated in NestJS services/modules.

### Key Entities

- **ScraperModule**: The main NestJS module encapsulating the scraper logic.
- **WorkerService**: The service responsible for orchestrating the scraping jobs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Worker starts successfully using `nest start` or equivalent NestJS command.
- **SC-002**: 100% of existing test cases (if any) or a baseline sanity check passes on the new NestJS implementation.
- **SC-003**: Code duplication between Backend and Worker is minimized (via shared libraries if absolutely necessary, but preferably completely separate implementations for this scope).
- **SC-004**: Deployment size/complexity remains manageable (Worker docker image building successfully).

## Assumptions

- The user wants a standard NestJS structure for the worker.
- The `worker` folder can be completely replaced or heavily modified.
- We will reuse the existing `backend` NestJS expertise/patterns.
