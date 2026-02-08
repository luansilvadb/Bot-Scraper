/**
 * Date Utilities
 * Date formatting and manipulation utilities
 */

/**
 * Formats a date to locale string
 */
export const formatDate = (
  date: Date | string | number,
  locale: string = 'pt-BR'
): string => {
  const d = new Date(date);
  return d.toLocaleDateString(locale);
};

/**
 * Formats a date with time
 */
export const formatDateTime = (
  date: Date | string | number,
  locale: string = 'pt-BR'
): string => {
  const d = new Date(date);
  return d.toLocaleString(locale);
};

/**
 * Formats a date to ISO string (for API)
 */
export const formatDateISO = (date: Date | string | number): string => {
  return new Date(date).toISOString();
};

/**
 * Returns relative time (e.g., "há 2 horas")
 */
export const getRelativeTime = (
  date: Date | string | number,
  locale: string = 'pt-BR'
): string => {
  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
};

/**
 * Checks if date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Checks if date is in the past
 */
export const isPast = (date: Date | string | number): boolean => {
  return new Date(date) < new Date();
};

/**
 * Checks if date is in the future
 */
export const isFuture = (date: Date | string | number): boolean => {
  return new Date(date) > new Date();
};

/**
 * Adds days to a date
 */
export const addDays = (date: Date | string | number, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Gets start of day
 */
export const startOfDay = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Gets end of day
 */
export const endOfDay = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};
