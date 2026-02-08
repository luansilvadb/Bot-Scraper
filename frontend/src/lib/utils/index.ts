/**
 * Utilities Barrel Export
 * Centralized exports for all utility functions
 */

// String utilities
export {
  generateInitials,
  hashString,
  truncate,
  capitalize,
  camelToKebab,
  kebabToCamel,
  generateId,
} from './string';

// Date utilities
export {
  formatDate,
  formatDateTime,
  formatDateISO,
  getRelativeTime,
  isToday,
  isPast,
  isFuture,
  addDays,
  startOfDay,
  endOfDay,
} from './date';
