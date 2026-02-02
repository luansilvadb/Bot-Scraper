# Contracts: System Tray Configuration UX

**Feature**: 013-tray-config-ux  
**Date**: 2026-02-02

## Overview

This feature does **not modify any backend APIs**. All changes are frontend-only (Electron renderer process).

## Existing IPC Contracts (No Changes)

The following Electron IPC channels are used but NOT modified:

### worker:getConfig

**Direction**: Renderer → Main → Renderer

```typescript
// Request (no payload)
ipcRenderer.invoke('worker:getConfig'): Promise<WorkerConfig | null>

// Response
interface WorkerConfig {
    serverUrl: string;
    workerToken: string;
    workerName: string;
    autoStart: boolean;
    minimizeToTray: boolean;
}
```

---

### worker:saveConfig

**Direction**: Renderer → Main → Renderer

```typescript
// Request
ipcRenderer.invoke('worker:saveConfig', config: WorkerConfig): Promise<ConfigValidationResult>

// Response
interface ConfigValidationResult {
    valid: boolean;
    errors: string[];
}
```

---

### worker:getStatus

**Direction**: Main → Renderer (via IPC)

```typescript
// Pushed from main process
interface WorkerStatus {
    connectionState: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 
                     'RECONNECTING' | 'WORKING' | 'ERROR';
    isPaused: boolean;
    tasksCompleted: number;
    tasksFailed: number;
    currentTask: {
        productUrl: string;
        progress: string;
    } | null;
    externalIp: string | null;
    ispName: string | null;
}
```

---

## New Component Contracts

### TrayContainer Props

```typescript
interface TrayContainerProps {
    // No props - manages its own state
}
```

### ViewTransition Props

```typescript
interface ViewTransitionProps {
    /** Currently active view identifier */
    activeView: 'status' | 'config';
    
    /** Two children: [StatusView, ConfigView] */
    children: [React.ReactNode, React.ReactNode];
    
    /** Callback when transition completes */
    onTransitionEnd?: () => void;
}
```

### ConfigWindow Props (Updated)

```typescript
interface ConfigWindowProps {
    /** Called when config is saved successfully */
    onSaved: () => void;
    
    /** Called when user cancels (only shown if already configured) */
    onCancel?: () => void;
    
    /** NEW: Style variant for embedded appearance */
    embedded?: boolean;
}
```

### StatusWindow Props (Updated)

```typescript
interface StatusWindowProps {
    /** Worker status data */
    status: WorkerStatus | null;
    
    /** Handler for opening settings view */
    onOpenSettings: () => void;
    
    /** NEW: Style variant for embedded appearance */
    embedded?: boolean;
}
```

---

## CSS Contract (Design Tokens)

The following CSS custom properties must be synchronized with `frontend/src/index.css`:

```css
:root {
    /* Colors - synced with frontend */
    --color-bg-primary: #242424;
    --color-bg-secondary: #1a1a1a;
    --color-text-primary: rgba(255, 255, 255, 0.87);
    --color-text-secondary: rgba(255, 255, 255, 0.6);
    --color-accent: #646cff;
    --color-success: #22c55e;
    --color-warning: #eab308;
    --color-error: #ef4444;
    --color-border: rgba(255, 255, 255, 0.1);
    
    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    
    /* Border radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    
    /* Transitions */
    --transition-fast: 100ms ease;
    --transition-normal: 250ms ease;
    --transition-slow: 400ms ease;
    
    /* Shadows */
    --shadow-popup: 0 10px 25px -3px rgba(0, 0, 0, 0.4);
}
```

---

## No Backend API Changes

This feature is entirely contained within the `worker-app` Electron application. No modifications to:
- `backend/src/modules/workers/workers.controller.ts`
- `backend/src/modules/workers/workers.service.ts`
- Any backend DTOs or endpoints
