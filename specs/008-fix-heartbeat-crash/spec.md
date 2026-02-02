# Feature Specification: Fix Worker Heartbeat Crash

**Feature Branch**: `008-fix-heartbeat-crash`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Fix TypeError: Cannot read properties of undefined (reading 'externalIp') in WorkersService.processHeartbeat"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Robust Heartbeat Processing (Priority: P1)

As a System Operator, I want the backend to gracefully handle malformed or partial heartbeat payloads from workers so that the server remains stable and doesn't crash during worker communication.

**Why this priority**: Crashing the backend server disrupts all operations and requires manual intervention to restart. Stability is critical.

**Independent Test**: Can be tested by sending valid, partial, and malformed start/heartbeat payloads via WebSocket and verifying the server logs an error (or ignores it) but stays running.

**Acceptance Scenarios**:

1. **Given** a connected worker sending a valid heartbeat with full `networkInfo`, **When** the heartbeat is processed, **Then** the worker's data is updated in the database and no error occurs.
2. **Given** a connected worker sending a heartbeat with missing `networkInfo` (undefined/null), **When** the heartbeat is processed, **Then** the server logs a warning and does NOT crash, and optionally updates other available fields.
3. **Given** a connected worker sending a heartbeat with missing properties inside `networkInfo` (e.g. `externalIp` missing), **When** the heartbeat is processed, **Then** the server uses default values or skips updating those specific fields, without crashing.

---

### Edge Cases

- **Empty Payload**: Worker sends an empty JSON object `{}`.
- **Null Payload**: Worker sends `null` as payload.
- **Wrong Types**: Worker sends strings where numbers are expected.
- **Disconnect during processing**: Worker disconnects immediately after sending heartbeat.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST validate incoming WebSocket heartbeat payloads before processing them.
- **FR-002**: The system MUST handle optional or missing `networkInfo` properties gracefully without throwing unchecked exceptions.
- **FR-003**: The `WorkersService.processHeartbeat` method MUST use safe access patterns (e.g., optional chaining) when reading properties from the payload `networkInfo`.
- **FR-004**: If `networkInfo` is missing or incomplete, the system SHOULD default to existing values or safe fallbacks (e.g., "Unknown") rather than failing.
- **FR-005**: The system MUST log a warning or error with context (worker ID) if a malformed heartbeat is received, instead of crashing the process.

### Key Entities *(include if feature involves data)*

- **WorkerHeartbeatDto**: The data structure received via WebSocket, which needs stricter validation or optional designation for nested objects.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Server uptime remains 100% when receiving malformed heartbeat payloads during stress testing.
- **SC-002**: Workers with legacy or buggy clients (missing fields) can still maintain a connection without causing server instability.
- **SC-003**: Error logs show handled exceptions (warn/error level) for bad payloads instead of stack traces leading to process exit.
