/**
 * Core Entity Types
 * Base interfaces for all entities in the system
 */

/**
 * Base interface for all entities
 */
export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entity with name and description
 */
export interface NamedEntity extends Entity {
  name: string;
  description?: string;
}

/**
 * Entity with status field
 */
export interface StatusEntity extends Entity {
  status: 'active' | 'inactive' | 'pending' | 'error';
}

/**
 * Worker entity
 */
export interface Worker extends NamedEntity {
  token?: string;
  lastSeen?: Date;
  capabilities?: string[];
  status: 'CONNECTED' | 'DISCONNECTED' | 'BLOCKED';
}

/**
 * Bot entity
 */
export interface Bot extends NamedEntity {
  config: Record<string, unknown>;
  schedule?: string;
  lastRun?: Date;
  nextRun?: Date;
  status: 'active' | 'inactive' | 'pending' | 'error';
}

/**
 * Product entity
 */
export interface Product extends NamedEntity {
  price: number;
  currency: string;
  url?: string;
  imageUrl?: string;
  source: string;
  metadata?: Record<string, unknown>;
}

/**
 * Setting entity
 */
export interface Setting extends NamedEntity {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'json';
  category?: string;
  isSecret?: boolean;
}

/**
 * Worker Task entity
 */
export interface WorkerTask {
  id: string;
  workerId: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

/**
 * Branded types for type-safe IDs
 */
export type WorkerId = string & { __brand: 'WorkerId' };
export type BotId = string & { __brand: 'BotId' };
export type ProductId = string & { __brand: 'ProductId' };
export type SettingId = string & { __brand: 'SettingId' };
export type TaskId = string & { __brand: 'TaskId' };
