# Data Model: System Tray Configuration UX

**Feature**: 013-tray-config-ux  
**Date**: 2026-02-02

## Overview

This feature primarily involves UI component state, not persistent data. The data model focuses on:
1. Component state management
2. View transition states
3. Configuration form state

## Component State Models

### TrayContainer State

The main container managing view transitions and visibility.

```typescript
interface TrayContainerState {
    /** Currently active view */
    activeView: 'status' | 'config';
    
    /** Transition state for animations */
    isTransitioning: boolean;
    
    /** Whether the popup is visible */
    isVisible: boolean;
}
```

**State Transitions**:
```
┌─────────────────────────────────────────────────────────┐
│                    TrayContainer                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   [Click Tray Icon]                                      │
│         │                                                │
│         ▼                                                │
│   ┌──────────┐                                           │
│   │ isVisible │ ◄─────────── [Click Outside / Blur]     │
│   │   true    │ ───────────► isVisible: false           │
│   └──────────┘                                           │
│         │                                                │
│         ▼                                                │
│   ┌──────────────────┐      ┌──────────────────┐        │
│   │   StatusView     │ ←──► │   ConfigView     │        │
│   │ activeView:status│      │ activeView:config│        │
│   └──────────────────┘      └──────────────────┘        │
│         │                          │                     │
│         │    [Settings Click]      │                     │
│         └──────────────────────────┘                     │
│                    │                                     │
│            isTransitioning: true                         │
│                    │                                     │
│            (250ms animation)                             │
│                    │                                     │
│            isTransitioning: false                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### ConfigView State

State for the configuration form.

```typescript
interface ConfigViewState {
    /** Form submission state */
    status: 'idle' | 'validating' | 'connecting' | 'success' | 'error';
    
    /** Form field values */
    formData: WorkerConfig;
    
    /** Validation errors per field */
    fieldErrors: Record<keyof WorkerConfig, string | undefined>;
    
    /** Global error message */
    globalError: string | null;
}

interface WorkerConfig {
    workerToken: string;
    workerName: string;
    autoStart: boolean;
    minimizeToTray: boolean;
}
```

**State Transitions**:
```
idle ──[Submit]──► validating ──[Valid]──► connecting
  ▲                    │                       │
  │                    │                       ▼
  │              [Invalid]               ┌───────────┐
  │                    │                 │  success  │
  │                    ▼                 └─────┬─────┘
  │              ┌─────────┐                   │
  └──────────────┤  error  │◄──[API Error]─────┘
                 └─────────┘
```

---

### StatusView State

State for the status display (existing, for reference).

```typescript
interface StatusViewState {
    /** Connection status from worker */
    connectionState: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 
                     'RECONNECTING' | 'WORKING' | 'ERROR';
    
    /** Pause state */
    isPaused: boolean;
    
    /** Task statistics */
    tasksCompleted: number;
    tasksFailed: number;
    
    /** Current task info */
    currentTask: {
        productUrl: string;
        progress: string;
    } | null;
    
    /** Network info */
    externalIp: string | null;
    ispName: string | null;
}
```

---

## Validation Rules

### WorkerConfig Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| workerToken | Required, non-empty | "Token é obrigatório" |
| workerToken | Valid format (alphanumeric, 64 chars) | "Token inválido" |
| workerName | Optional, max 50 chars | "Nome muito longo" |
| autoStart | Boolean | N/A (checkbox) |
| minimizeToTray | Boolean | N/A (checkbox) |

---

## Animation Timing

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| View transition (Status ↔ Config) | 250ms | ease-out | Settings click / Save |
| Popup show | 150ms | ease-out | Tray click |
| Popup hide | 100ms | ease-in | Blur event |
| Button hover | 100ms | ease | Mouse enter/leave |
| Input focus | 150ms | ease | Focus event |
| Error shake | 400ms | cubic-bezier | Validation error |
| Success checkmark | 300ms | spring | Connection success |

---

## No Backend Changes

This feature is entirely frontend (Electron renderer). No API endpoints are added or modified.

The existing IPC channels remain unchanged:
- `worker:getConfig` - Get stored configuration
- `worker:saveConfig` - Save configuration
- `worker:getStatus` - Get worker status
- `worker:connect` - Initiate connection
