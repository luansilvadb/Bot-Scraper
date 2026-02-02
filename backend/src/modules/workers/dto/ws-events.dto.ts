import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskErrorType } from '../enums';

/**
 * Payload when worker is registered successfully
 */
export class WorkerRegisteredPayload {
  workerId: string;
  serverTime: string;
  config: {
    heartbeatInterval: number;
    taskTimeout: number;
  };
}

/**
 * Payload when server assigns a task to worker
 */
export class TaskAssignedPayload {
  taskId: string;
  productUrl: string;
  priority: number;
  attemptNumber: number;
  assignedAt: string;
}

/**
 * Payload when server cancels a task
 */
export class TaskCancelledPayload {
  taskId: string;
  reason: string;
}

export class NetworkInfoDto {
  @IsOptional()
  @IsString()
  externalIp?: string;

  @IsOptional()
  @IsString()
  ispName?: string;

  @IsOptional()
  @IsString()
  lastCheckedAt?: string;
}

export class WorkerStatsDto {
  @IsOptional()
  @IsNumber()
  tasksCompleted?: number;

  @IsOptional()
  @IsNumber()
  tasksFailed?: number;

  @IsOptional()
  @IsNumber()
  uptime?: number;
}

/**
 * Payload for worker heartbeat
 */
export class WorkerHeartbeatDto {
  @IsEnum(['idle', 'busy', 'blocked'])
  status: 'idle' | 'busy' | 'blocked';

  @IsOptional()
  @IsString()
  currentTaskId?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NetworkInfoDto)
  networkInfo?: NetworkInfoDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WorkerStatsDto)
  stats?: WorkerStatsDto;
}

/**
 * Payload when task starts processing
 */
export class TaskStartedDto {
  @IsString()
  taskId: string;

  @IsString()
  startedAt: string;
}

/**
 * Scraped product data
 */
export class ScrapedProductData {
  @IsString()
  productTitle: string;

  @IsOptional()
  @IsNumber()
  price: number | null;

  @IsString()
  currency: string;

  @IsOptional()
  @IsNumber()
  originalPrice: number | null;

  @IsOptional()
  @IsNumber()
  rating: number | null;

  @IsOptional()
  @IsNumber()
  reviewCount: number | null;

  @IsOptional()
  @IsString()
  availability: string | null;

  @IsBoolean()
  isAvailable: boolean;

  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @IsOptional()
  @IsString()
  asin: string | null;
}

/**
 * Payload when task completes successfully
 */
export class TaskCompletedDto {
  @IsString()
  taskId: string;

  @IsString()
  completedAt: string;

  result: ScrapedProductData;

  metrics: {
    scrapeDurationMs: number;
    pageLoadTimeMs: number;
  };
}

/**
 * Payload when task fails
 */
export class TaskFailedDto {
  @IsString()
  taskId: string;

  @IsString()
  failedAt: string;

  error: {
    type: TaskErrorType;
    message: string;
    details?: string;
  };

  @IsOptional()
  metrics?: {
    attemptDurationMs: number;
  };
}

/**
 * Payload for network change notification
 */
export class NetworkChangedDto {
  previousIp: string;
  currentIp: string;
  previousIsp: string;
  currentIsp: string;
  changedAt: string;
}

/**
 * Payload for block detection
 */
export class BlockDetectedDto {
  detectedAt: string;
  reason: string;
  suggestedAction: 'wait' | 'change_network' | 'manual_intervention';
  failedTaskIds: string[];
}

/**
 * Generic error payload
 */
export class ErrorPayload {
  code: string;
  message: string;
  timestamp: string;
}

/**
 * WebSocket event names
 */
export const WS_EVENTS = {
  // Server -> Worker
  WORKER_REGISTERED: 'worker:registered',
  TASK_ASSIGNED: 'task:assigned',
  TASK_CANCELLED: 'task:cancelled',
  CONFIG_UPDATE: 'worker:config_update',

  // Worker -> Server
  WORKER_HEARTBEAT: 'worker:heartbeat',
  TASK_STARTED: 'task:started',
  TASK_COMPLETED: 'task:completed',
  TASK_FAILED: 'task:failed',
  NETWORK_CHANGED: 'worker:network_changed',
  BLOCK_DETECTED: 'worker:block_detected',

  // Bidirectional
  ERROR: 'error',
} as const;
