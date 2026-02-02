# Implementation Plan - Fix Worker Heartbeat Crash

## Technical Context

The backend crashes with `TypeError: Cannot read properties of undefined (reading 'externalIp')` when processing a heartbeat payload from a connected worker. This is caused by unsafe access to nested validation properties (`networkInfo.externalIp`) in `WorkersService.processHeartbeat`.

**Current Issue:**
```typescript
// Likely current implementation
const ip = payload.networkInfo.externalIp; // CRASH if networkInfo is undefined
```

**Proposed Fix:**
We need to validate the payload structure before access, and use optional chaining/check for existence. This will ensure server stability even if workers send partial data (e.g. legacy clients or during network transitions).

**Technologies:**
- NestJS (Backend)
- TypeScript (Strict Mode)
- Class-Validator (DTO Validation)

## Constitution Check

### I. Arquitetura Modular e Tipagem
- **Compliance:** We will enforce stricter typing on `WorkerHeartbeatDto` and safe access patterns. No `any` will be introduced.

### IV. Escalabilidade e Assincronia
- **Compliance:** Ensuring the WebSocket gateway doesn't crash the entire process is critical for horizontal scalability and reliability.

## Phase 0: Research & Unknowns

No research required. The error is a standard "Object is possibly undefined" runtime exception. We know exactly where and why it happens.

[ ] Confirm exact file line from user logs: `D:\Bot-Scraper\backend\src\modules\workers\workers.service.ts`

## Phase 1: Design & Contracts

### Data Model Changes

No database schema changes.
We will update the `WorkerHeartbeatDto` class to ensure `networkInfo` is properly validated or handled as optional.

### API Contracts

**WS Event: `worker:heartbeat`**
Payload structure remains the same, but implementation becomes robust:
```typescript
interface WorkerHeartbeatDto {
  status: 'idle' | 'busy' | 'blocked';
  networkInfo?: { // Treat as optional for robustness
    externalIp?: string;
    ispName?: string;
  };
  // ...
}
```

### Artifacts to Generate
- `spec.md` (Already done)
- `plan.md` (This file)

## Phase 2: Implementation Steps

1.  **Modify DTO**: Update `WorkerHeartbeatDto` in `backend/src/modules/workers/dto/ws-events.dto.ts` to allow optional fields if strictly necessary, or better, keep it strict but handle validation errors in the Gateway before Service.
    *   *Correction*: The log shows the crash is in `WorkersService`, meaning the payload *passed* the gateway processing (or bypassed validation). We must harden the `WorkersService` method.
2.  **Safety Check**: Update `backend/src/modules/workers/workers.service.ts` method `processHeartbeat`.
    *   Add check: `const externalIp = payload.networkInfo?.externalIp ?? null;`
    *   Add check: `const ispName = payload.networkInfo?.ispName ?? null;`
3.  **Verification**: Restart backend and ensure no crash when running local worker (which might be sending incomplete data).

## Phase 3: Validation
- Run backend and worker.
- Verify heartbeat logs in backend console.
- Confirm no `TypeError` stack traces.
