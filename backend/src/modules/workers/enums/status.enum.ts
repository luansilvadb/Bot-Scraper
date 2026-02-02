/**
 * Worker Status Enum
 * Matches Prisma WorkerStatus enum
 */
export enum WorkerStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
  BUSY = 'BUSY',
  BLOCKED = 'BLOCKED',
}

/**
 * Task Status Enum
 * Matches Prisma TaskStatus enum
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PERMANENTLY_FAILED = 'PERMANENTLY_FAILED',
}

/**
 * Task Error Types for scraping failures
 */
export enum TaskErrorType {
  CAPTCHA = 'CAPTCHA',
  BLOCKED = 'BLOCKED',
  THROTTLED = 'THROTTLED',
  NETWORK = 'NETWORK',
  PARSE_ERROR = 'PARSE_ERROR',
  TIMEOUT = 'TIMEOUT',
}
