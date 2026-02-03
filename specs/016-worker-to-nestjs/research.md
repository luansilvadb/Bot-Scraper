# Research: Refactor Worker to NestJS

**Feature**: [Refactor Worker to NestJS](spec.md)
**Status**: Researching
**Created**: 2026-02-02

## 1. NestJS Logic for Standalone Workers

**Context**: The worker application does not need to accept incoming HTTP requests. It acts as a client connecting to the backend.

**Decision**: Use `NestFactory.createApplicationContext(AppModule)`.

**Rationale**:
- `createApplicationContext` initializes the DI container and calls `onModuleInit` hooks but does not start an HTTP server.
- This is lightweight and appropriate for background workers or client-side agents.
- **Process Keep-Alive**: Since `createApplicationContext` initializes and finishes, we need to ensure the process doesn't exit. The `Socket.IO` client connection will naturally keep the event loop active. If using other methods, we might need a keep-alive mechanism, but active sockets usually suffice.

**Implementation**:
```typescript
// main.ts
const app = await NestFactory.createApplicationContext(AppModule);
app.enableShutdownHooks();
// The app stays alive as long as the Socket.IO connection is active
```

**Alternatives Considered**:
- `NestFactory.create(AppModule)`: Starts an HTTP server (Express/Fastify). Rejected because we don't need to bind a port or serve traffic, reducing firewall noise on user machines.

## 2. Communication Module (Socket.IO Client)

**Context**: Managing the socket connection lifecycle and event handling within NestJS.

**Decision**: Create a `SocketService` that wraps `socket.io-client`.

**Rationale**:
- Encapsulates the external library.
- Allows mocking `SocketService` in tests.
- Can use `onModuleInit` to connect and `onModuleDestroy` to disconnect.

**Pattern**:
- `SocketService` implements `OnModuleInit`.
- Events are handled by registering callbacks or using an internal `EventEmitter` to dispatch to the `OrchestrationService`.

## 3. Scraper Resource Management

**Context**: Playwright browsers are heavy resources.

**Decision**: Use a scoped `BrowserFactory` or manage instances in `ScraperService`.

**Rationale**:
- We likely want to reuse the Browser *instance* (to save launch time) but create new *Contexts* per job (for isolation).
- `ScraperService` should manage this lifecycle.

## 4. Configuration and Validation

**Context**: Environment variables (`backend_url`, `headless`, etc.).

**Decision**: Use `@nestjs/config` with `joi` or `class-validator`.

**Rationale**:
- Standard NestJS practice.
- Ensures the worker fails fast if config is missing.
