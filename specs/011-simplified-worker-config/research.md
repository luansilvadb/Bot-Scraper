# Research: Simplified Worker Configuration

**Feature**: 011-simplified-worker-config  
**Date**: 2026-02-02

## Research Topics

### 1. Vite Environment Variables in Electron

**Decision**: Use `VITE_` prefixed environment variables that are statically replaced at build time.

**Rationale**: 
- Vite only exposes env variables prefixed with `VITE_` to client-side code for security
- Variables are replaced at build time, not runtime, which is ideal for desktop apps
- Works seamlessly with electron-vite which we already use

**Alternatives Considered**:
- Runtime config file: Rejected - requires file system access from renderer, security concerns
- Command-line arguments: Rejected - not user-friendly for non-technical users
- Electron's `process.env`: Works in main process but requires IPC for renderer access

**Implementation**:
```typescript
// In renderer or main process
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:30001';
```

### 2. Environment File Structure

**Decision**: Create three environment files following Vite conventions.

**Rationale**:
- `.env.development` - loaded during `npm run dev`
- `.env.production` - loaded during `npm run build`
- `.env.example` - template for documentation (not loaded)

**File Contents**:
```env
# .env.development
VITE_SERVER_URL=http://localhost:30001

# .env.production  
VITE_SERVER_URL=https://api.example.com

# .env.example
# Server URL for the Bot-Scraper backend
# Development: http://localhost:30001
# Production: https://your-production-server.com
VITE_SERVER_URL=
```

### 3. WorkerConfig Type Modification

**Decision**: Keep `serverUrl` in the type but mark it as optional/internal.

**Rationale**:
- Existing code references `config.serverUrl`
- Minimal code changes - just change where the value comes from
- Type still documents the configuration shape

**Updated Type**:
```typescript
export interface WorkerConfig {
    serverUrl: string;       // Now populated from env, not user input
    workerToken: string;     // User input - required
    workerName: string;      // User input - optional
    autoStart: boolean;      // User input - optional
    minimizeToTray: boolean; // User input - optional
}
```

### 4. Form Validation Changes

**Decision**: Simplify validation to only check token field.

**Rationale**:
- Server URL no longer user-provided, so no validation needed
- Token must be non-empty (basic check)
- Future: Could add token format validation (e.g., UUID pattern)

**Validation Rules**:
- Token: Required, non-empty string
- Worker Name: Optional, no validation
- Auto-Start: Boolean, no validation
- Minimize to Tray: Boolean, no validation

## Resolved Clarifications

No NEEDS CLARIFICATION markers were present in the specification. All requirements are clear and implementable.

## Dependencies

| Dependency | Version | Purpose | Already Installed |
|------------|---------|---------|-------------------|
| electron-vite | ^5.0.0 | Handles env variable injection | ✅ Yes |
| vite | ^7.3.1 | Build tool with env support | ✅ Yes |

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Env var not set in production build | Low | High | Build script validation + fallback URL |
| User confusion about token location | Medium | Low | Add helper text linking to dashboard |
| Breaking existing configurations | Low | Medium | Graceful migration - URL field ignored if present |
