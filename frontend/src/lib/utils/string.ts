/**
 * String Utilities
 * String manipulation and formatting utilities
 */

/**
 * Generates initials from a name
 * Example: "John Doe" -> "JD"
 * Example: "Alice" -> "A"
 */
export const generateInitials = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return '?';
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return '?';
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
};

/**
 * Simple hash function for deterministic generation
 */
export const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Truncates text to specified length with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalizes first letter of string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts camelCase to kebab-case
 */
export const camelToKebab = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

/**
 * Converts kebab-case to camelCase
 */
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Generates a random ID
 */
export const generateId = (prefix?: string): string => {
  const id = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${id}` : id;
};
