/**
 * Deterministic color generation for avatar fallbacks
 * Generates consistent colors based on user ID or name hash
 */

// Presence badge status type from Fluent UI
export type PresenceBadgeStatus =
  | 'available'
  | 'away'
  | 'busy'
  | 'offline'
  | 'do-not-disturb'
  | 'out-of-office'
  | 'unknown';

export type PresenceState =
  | 'available'
  | 'away'
  | 'busy'
  | 'offline'
  | 'dnd'
  | 'out-of-office'
  | 'unknown';

/**
 * Maps presence state to Fluent UI PresenceBadge status
 */
export const mapPresenceToBadgeStatus = (
  presence: PresenceState,
): PresenceBadgeStatus => {
  const statusMap: Record<PresenceState, PresenceBadgeStatus> = {
    available: 'available',
    away: 'away',
    busy: 'busy',
    offline: 'offline',
    dnd: 'do-not-disturb',
    'out-of-office': 'out-of-office',
    unknown: 'offline',
  };

  return statusMap[presence] || 'offline';
};

/**
 * Avatar color options from Fluent UI v9 color palette
 * Using Teams-appropriate colors
 */
export const avatarColors = [
  'dark-red',
  'cranberry',
  'red',
  'pumpkin',
  'peach',
  'marigold',
  'gold',
  'brass',
  'brown',
  'forest',
  'seafoam',
  'dark-green',
  'light-teal',
  'teal',
  'steel',
  'blue',
  'royal-blue',
  'cornflower',
  'navy',
  'lavender',
  'purple',
  'mauve',
  'grape',
  'berry',
  'pink',
  'hot-pink',
  'magenta',
  'plum',
] as const;

export type AvatarColor = (typeof avatarColors)[number];

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
    // Single name - take first character
    return parts[0].charAt(0).toUpperCase();
  }

  // Multiple names - take first char of first and last names
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
};

/**
 * Simple hash function for deterministic color generation
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Gets deterministic avatar color based on input string (user ID or name)
 * Same input always returns the same color
 */
export const getDeterministicColor = (
  input: string,
): AvatarColor => {
  if (!input || typeof input !== 'string') {
    return avatarColors[0];
  }

  const hash = hashString(input.trim().toLowerCase());
  const index = hash % avatarColors.length;

  return avatarColors[index];
};

/**
 * Interface for avatar data
 */
export interface AvatarData {
  initials: string;
  colorId: number;
}

/**
 * Gets deterministic color ID for 'colorful' avatar preset
 * Returns a number 1-25 for Fluent UI's colorful preset
 */
export const getDeterministicColorId = (input: string): number => {
  if (!input || typeof input !== 'string') {
    return 1;
  }

  const hash = hashString(input.trim().toLowerCase());
  // Fluent UI v9 has 25 colorful presets (1-25)
  return (hash % 25) + 1;
};

/**
 * Complete avatar fallback data generation
 * Returns initials and deterministic color for colorful preset
 */
export const generateAvatarFallback = (
  name: string,
  userId?: string,
): { initials: string; colorId: number } => {
  const initials = generateInitials(name);
  // Use userId for color if available, otherwise use name
  const colorInput = userId || name || 'unknown';
  const colorId = getDeterministicColorId(colorInput);

  return {
    initials,
    colorId,
  };
};
