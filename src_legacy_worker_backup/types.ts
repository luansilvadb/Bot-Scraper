// Copied from backend DTOs, stripped of decorators for client-side use

export enum WorkerStatus {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTED = 'CONNECTED',
    BUSY = 'BUSY',
    BLOCKED = 'BLOCKED',
}

export enum TaskErrorType {
    CAPTCHA = 'CAPTCHA',
    BLOCKED = 'BLOCKED',
    THROTTLED = 'THROTTLED',
    NETWORK = 'NETWORK',
    PARSE_ERROR = 'PARSE_ERROR',
    TIMEOUT = 'TIMEOUT',
}

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

export interface TaskCancelledPayload {
    taskId: string;
    reason: string;
}

export interface NetworkInfo {
    externalIp: string;
    ispName: string;
    lastCheckedAt: string;
}

export interface WorkerHeartbeatDto {
    status: 'idle' | 'busy' | 'blocked';
    currentTaskId?: string;
    networkInfo: NetworkInfo;
    stats: {
        tasksCompleted: number;
        tasksFailed: number;
        uptime: number;
    };
}

export interface TaskStartedDto {
    taskId: string;
    startedAt: string;
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

export interface NetworkChangedDto {
    previousIp: string;
    currentIp: string;
    previousIsp: string;
    currentIsp: string;
    changedAt: string;
}

export interface BlockDetectedDto {
    detectedAt: string;
    reason: string;
    suggestedAction: 'wait' | 'change_network' | 'manual_intervention';
    failedTaskIds: string[];
}

export interface ErrorPayload {
    code: string;
    message: string;
    timestamp: string;
}

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
