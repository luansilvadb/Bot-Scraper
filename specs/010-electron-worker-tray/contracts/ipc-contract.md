# IPC Contract: Electron Worker Tray Application

**Feature**: 010-electron-worker-tray  
**Date**: 2026-02-02  
**Type**: Inter-Process Communication (Main ↔ Renderer)

## Overview

Este documento define o contrato de comunicação entre o **Main Process** (Electron/Node.js) e o **Renderer Process** (React UI) usando Electron's IPC via Context Bridge.

---

## Type Definitions

```typescript
// === Enums ===

type ConnectionState = 
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'WORKING'
  | 'ERROR'
  | 'RECONNECTING';

// === Interfaces ===

interface WorkerConfig {
  serverUrl: string;
  workerToken: string;
  workerName: string;
  autoStart: boolean;
  minimizeToTray: boolean;
}

interface CurrentTask {
  taskId: string;
  productUrl: string;
  startedAt: string; // ISO date string
  progress: string;
}

interface WorkerStatus {
  connectionState: ConnectionState;
  workerId: string | null;
  tasksCompleted: number;
  tasksFailed: number;
  currentTask: CurrentTask | null;
  lastError: string | null;
  connectedAt: string | null; // ISO date string
  externalIp: string | null;
  ispName: string | null;
}

interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}
```

---

## Renderer → Main (Invoke Methods)

Methods exposed via `window.workerAPI` that return Promises.

### `getStatus(): Promise<WorkerStatus>`

Returns the current worker status.

**Request**: None  
**Response**: `WorkerStatus` object

---

### `getConfig(): Promise<WorkerConfig | null>`

Returns saved configuration or null if not configured.

**Request**: None  
**Response**: `WorkerConfig | null`

---

### `saveConfig(config: WorkerConfig): Promise<ConfigValidationResult>`

Validates and saves the worker configuration.

**Request**: 
```typescript
{
  serverUrl: string;    // Required, valid URL
  workerToken: string;  // Required, min 10 chars
  workerName: string;   // Required, max 50 chars
  autoStart: boolean;   // Optional, default false
  minimizeToTray: boolean; // Optional, default true
}
```

**Response**:
```typescript
{
  valid: boolean;
  errors: string[]; // Empty if valid
}
```

**Validation Rules**:
- `serverUrl`: Must match `^https?://` pattern
- `workerToken`: Length >= 10
- `workerName`: Length <= 50, not empty

---

### `connect(): Promise<void>`

Initiates connection to the backend server using saved configuration.

**Request**: None  
**Response**: void (status updates via events)

**Preconditions**: 
- Configuration must be saved
- Must not be already connected

---

### `disconnect(): Promise<void>`

Disconnects from the backend server.

**Request**: None  
**Response**: void

---

### `togglePause(): Promise<boolean>`

Toggles the worker pause state. When paused, worker won't accept new tasks.

**Request**: None  
**Response**: `boolean` - new pause state (true = paused)

---

### `openSettings(): Promise<void>`

Opens the settings/configuration window.

**Request**: None  
**Response**: void

---

### `quitApp(): Promise<void>`

Gracefully shuts down the application.

**Request**: None  
**Response**: void (app will close)

---

## Main → Renderer (Events)

Events sent from Main Process that Renderer listens to.

### `worker:status-changed`

Emitted whenever the worker status changes.

**Payload**: `WorkerStatus`

**Trigger Conditions**:
- Connection state changes
- Task starts/completes
- Counter updates
- Error occurs

---

### `worker:config-loaded`

Emitted on app startup with loaded configuration.

**Payload**: `WorkerConfig | null`

---

### `worker:task-progress`

Emitted during task execution with progress updates.

**Payload**:
```typescript
{
  taskId: string;
  progress: string; // Human-readable progress message
}
```

**Example Progress Messages**:
- "Iniciando navegador..."
- "Carregando página..."
- "Extraindo dados do produto..."
- "Enviando resultados..."

---

### `worker:notification`

Emitted when a system notification should be shown.

**Payload**:
```typescript
{
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}
```

---

## Context Bridge Declaration

```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

export interface WorkerAPI {
  // Invoke methods (Renderer → Main)
  getStatus: () => Promise<WorkerStatus>;
  getConfig: () => Promise<WorkerConfig | null>;
  saveConfig: (config: WorkerConfig) => Promise<ConfigValidationResult>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  togglePause: () => Promise<boolean>;
  openSettings: () => Promise<void>;
  quitApp: () => Promise<void>;
  
  // Event listeners (Main → Renderer)
  onStatusChange: (callback: (status: WorkerStatus) => void) => void;
  onConfigLoaded: (callback: (config: WorkerConfig | null) => void) => void;
  onTaskProgress: (callback: (data: { taskId: string; progress: string }) => void) => void;
  onNotification: (callback: (data: { type: string; title: string; message: string }) => void) => void;
  
  // Cleanup
  removeAllListeners: () => void;
}

contextBridge.exposeInMainWorld('workerAPI', {
  getStatus: () => ipcRenderer.invoke('worker:get-status'),
  getConfig: () => ipcRenderer.invoke('worker:get-config'),
  saveConfig: (config) => ipcRenderer.invoke('worker:save-config', config),
  connect: () => ipcRenderer.invoke('worker:connect'),
  disconnect: () => ipcRenderer.invoke('worker:disconnect'),
  togglePause: () => ipcRenderer.invoke('worker:toggle-pause'),
  openSettings: () => ipcRenderer.invoke('worker:open-settings'),
  quitApp: () => ipcRenderer.invoke('worker:quit'),
  
  onStatusChange: (callback) => {
    ipcRenderer.on('worker:status-changed', (_, status) => callback(status));
  },
  onConfigLoaded: (callback) => {
    ipcRenderer.on('worker:config-loaded', (_, config) => callback(config));
  },
  onTaskProgress: (callback) => {
    ipcRenderer.on('worker:task-progress', (_, data) => callback(data));
  },
  onNotification: (callback) => {
    ipcRenderer.on('worker:notification', (_, data) => callback(data));
  },
  
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('worker:status-changed');
    ipcRenderer.removeAllListeners('worker:config-loaded');
    ipcRenderer.removeAllListeners('worker:task-progress');
    ipcRenderer.removeAllListeners('worker:notification');
  },
} as WorkerAPI);
```

---

## TypeScript Declaration for Renderer

```typescript
// global.d.ts (in renderer/src/)
import type { WorkerAPI } from '../electron/preload';

declare global {
  interface Window {
    workerAPI: WorkerAPI;
  }
}
```

---

## Error Handling

All invoke methods may throw errors. Renderer should wrap calls in try/catch.

**Common Error Codes**:
- `CONFIG_NOT_FOUND`: No configuration saved
- `ALREADY_CONNECTED`: Trying to connect when already connected
- `VALIDATION_FAILED`: Config validation failed
- `CONNECTION_FAILED`: WebSocket connection failed
- `AUTH_FAILED`: Invalid worker token
