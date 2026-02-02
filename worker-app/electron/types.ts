// === Connection State Enum ===
export type ConnectionState =
    | 'DISCONNECTED'
    | 'CONNECTING'
    | 'CONNECTED'
    | 'WORKING'
    | 'ERROR'
    | 'RECONNECTING';

// === Server URL from Environment ===
// This is injected at build time via Vite environment variables
// Development: http://localhost:30001 (from .env.development)
// Production: https://api.example.com (from .env.production)
export const SERVER_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SERVER_URL)
    || 'http://localhost:30001';

// === Worker Configuration (Persisted) ===
export interface WorkerConfig {
    /**
     * Backend server URL for WebSocket connection.
     * SOURCE: Environment variable (VITE_SERVER_URL) - NOT user input
     * This field is auto-populated from SERVER_URL constant.
     */
    serverUrl: string;

    /**
     * Authentication token for worker registration.
     * SOURCE: User input via configuration form
     * REQUIRED: Yes
     */
    workerToken: string;

    /**
     * Human-readable name for this worker instance.
     * SOURCE: User input via configuration form
     * REQUIRED: No
     */
    workerName: string;

    /**
     * Whether to start the worker when Windows starts.
     * SOURCE: User input via configuration form
     */
    autoStart: boolean;

    /**
     * Whether to minimize to system tray instead of closing.
     * SOURCE: User input via configuration form
     */
    minimizeToTray: boolean;
}

// === Current Task Info ===
export interface CurrentTask {
    taskId: string;
    productUrl: string;
    startedAt: string; // ISO date string
    progress: string;
}

// === Worker Status (Runtime State) ===
export interface WorkerStatus {
    connectionState: ConnectionState;
    workerId: string | null;
    tasksCompleted: number;
    tasksFailed: number;
    currentTask: CurrentTask | null;
    lastError: string | null;
    connectedAt: string | null; // ISO date string
    externalIp: string | null;
    ispName: string | null;
    isPaused: boolean;
}

// === Config Validation Result ===
export interface ConfigValidationResult {
    valid: boolean;
    errors: string[];
}

// === Tray State (Derived) ===
export interface TrayState {
    iconPath: string;
    tooltip: string;
    isAnimating: boolean;
}

// === IPC Event Payloads ===
export interface TaskProgressPayload {
    taskId: string;
    progress: string;
}

export interface NotificationPayload {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
}

// === Protocol Types (from original worker) ===

export const WS_EVENTS = {
    WORKER_REGISTERED: 'worker:registered',
    TASK_ASSIGNED: 'task:assigned',
    TASK_CANCELLED: 'task:cancelled',
    CONFIG_UPDATE: 'worker:config_update',

    WORKER_HEARTBEAT: 'worker:heartbeat',
    TASK_STARTED: 'task:started',
    TASK_COMPLETED: 'task:completed',
    TASK_FAILED: 'task:failed',
    NETWORK_CHANGED: 'worker:network_changed',
    BLOCK_DETECTED: 'worker:block_detected',

    ERROR: 'error',
} as const;

export interface WorkerRegisteredPayload {
    workerId: string;
    serverTime: string;
    config: {
        heartbeatInterval: number;
        taskTimeout: number;
    };
}

export interface TaskAssignedPayload {
    taskId: string;
    productUrl: string;
    priority: number;
    attemptNumber: number;
    assignedAt: string;
}

export interface WorkerHeartbeatDto {
    status: 'idle' | 'busy' | 'blocked';
    currentTaskId?: string;
    networkInfo: {
        externalIp: string;
        ispName: string;
        lastCheckedAt: string;
    };
    stats: {
        tasksCompleted: number;
        tasksFailed: number;
        uptime: number;
    };
}

export enum TaskErrorType {
    CAPTCHA = 'CAPTCHA',
    BLOCKED = 'BLOCKED',
    THROTTLED = 'THROTTLED',
    NETWORK = 'NETWORK',
    PARSE_ERROR = 'PARSE_ERROR',
    TIMEOUT = 'TIMEOUT',
}

export interface ScrapedProductData {
    productTitle: string;
    price: number | null;
    currency: string;
    originalPrice: number | null;
    rating: number | null;
    reviewCount: number | null;
    availability: string | null;
    isAvailable: boolean;
    imageUrls: string[];
    asin: string | null;
}

export interface TaskCompletedDto {
    taskId: string;
    completedAt: string;
    result: ScrapedProductData;
    metrics: {
        scrapeDurationMs: number;
        pageLoadTimeMs: number;
    };
}

export interface TaskFailedDto {
    taskId: string;
    failedAt: string;
    error: {
        type: TaskErrorType;
        message: string;
        details?: string;
    };
    metrics?: {
        attemptDurationMs: number;
    };
}

// === Default Values ===
export const DEFAULT_WORKER_STATUS: WorkerStatus = {
    connectionState: 'DISCONNECTED',
    workerId: null,
    tasksCompleted: 0,
    tasksFailed: 0,
    currentTask: null,
    lastError: null,
    connectedAt: null,
    externalIp: null,
    ispName: null,
    isPaused: false,
};

export const DEFAULT_WORKER_CONFIG: WorkerConfig = {
    serverUrl: '',
    workerToken: '',
    workerName: '',
    autoStart: false,
    minimizeToTray: true,
};
