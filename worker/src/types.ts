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
    productUrl?: string;
}

export interface ScrapeJob {
    id: string;
    url: string;
    scrapers?: Record<string, string>;
}

export interface TaskAssignedPayload {
    taskId: string;
    productUrl: string;
    priority?: number;
    attemptNumber?: number;
    assignedAt?: string;
}

export interface TaskCompletedPayload {
    taskId: string;
    completedAt: string;
    result?: ScrapedProductData;
    results?: ScrapedProductData[];
    metrics: {
        scrapeDurationMs: number;
        pageLoadTimeMs: number;
    };
}

export const WS_EVENTS = {
    WORKER_REGISTERED: 'worker:registered',
    TASK_ASSIGNED: 'task:assigned',
    TASK_CANCELLED: 'task:cancelled',
    WORKER_HEARTBEAT: 'worker:heartbeat',
    TASK_STARTED: 'task:started',
    TASK_COMPLETED: 'task:completed',
    TASK_FAILED: 'task:failed',
    ERROR: 'error',
} as const;
