# Data Model: Simplified Worker Configuration

**Feature**: 011-simplified-worker-config  
**Date**: 2026-02-02

## Entity Changes

### WorkerConfig (Modified)

The WorkerConfig entity remains structurally the same, but the source of the `serverUrl` field changes from user input to environment variable.

```typescript
interface WorkerConfig {
    /**
     * Backend server URL for WebSocket connection.
     * SOURCE: Environment variable (VITE_SERVER_URL) at build time
     * NOT editable by user via UI
     */
    serverUrl: string;
    
    /**
     * Authentication token for worker registration.
     * SOURCE: User input via configuration form
     * REQUIRED: Yes
     * VALIDATION: Non-empty string
     */
    workerToken: string;
    
    /**
     * Human-readable name for this worker instance.
     * SOURCE: User input via configuration form
     * REQUIRED: No
     * VALIDATION: None (empty string allowed)
     */
    workerName: string;
    
    /**
     * Whether to start the worker when Windows starts.
     * SOURCE: User input via configuration form
     * REQUIRED: No
     * DEFAULT: false
     */
    autoStart: boolean;
    
    /**
     * Whether to minimize to system tray instead of closing.
     * SOURCE: User input via configuration form
     * REQUIRED: No
     * DEFAULT: true
     */
    minimizeToTray: boolean;
}
```

### Default Values (Modified)

```typescript
const DEFAULT_WORKER_CONFIG: WorkerConfig = {
    serverUrl: '',      // Will be populated from env at runtime
    workerToken: '',    // User must provide
    workerName: '',     // Optional
    autoStart: false,   // Off by default
    minimizeToTray: true, // On by default
};
```

## State Transitions

### Configuration State Machine

```
┌─────────────────┐
│   UNCONFIGURED  │  (No token saved)
└────────┬────────┘
         │ User enters token
         │ and clicks "Conectar"
         ▼
┌─────────────────┐
│   VALIDATING    │  (Checking token format)
└────────┬────────┘
         │ Token valid
         ▼
┌─────────────────┐
│   CONFIGURED    │  (Token saved, connecting)
└────────┬────────┘
         │ User opens Settings
         │ and changes token
         ▼
┌─────────────────┐
│  RECONFIGURING  │  (Updating token)
└────────┬────────┘
         │ Save successful
         ▼
┌─────────────────┐
│   CONFIGURED    │  (Back to normal)
└─────────────────┘
```

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| workerToken | Not empty | "O token é obrigatório" |
| workerToken | Min length 10 | "Token inválido" |
| workerName | None | N/A |
| autoStart | Boolean | N/A |
| minimizeToTray | Boolean | N/A |

## Storage Format

The configuration is stored encrypted in electron-store with the following structure:

```json
{
    "serverUrl": "http://localhost:30001",
    "workerToken": "abc123...",
    "workerName": "PC-Escritório",
    "autoStart": false,
    "minimizeToTray": true
}
```

**Note**: `serverUrl` is stored but its value comes from the environment variable at save time, not from user input.

## Migration Considerations

**Backward Compatibility**: Existing configurations with a manually-entered `serverUrl` will continue to work. The stored URL will be overwritten with the environment-based URL on next configuration save.

**No Data Loss**: Token, worker name, and preference settings are preserved.
