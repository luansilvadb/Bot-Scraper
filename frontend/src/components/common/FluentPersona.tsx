/**
 * FluentPersona Component
 * Teams-style persona component combining Avatar, name, email, and presence
 * Uses Fluent UI v9 Persona component with custom styling
 */

import * as React from 'react';
import {
  Persona,
  Avatar,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  generateAvatarFallback,
  mapPresenceToBadgeStatus,
  type PresenceState,
} from '../../lib/avatar-colors';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0, // Allow text truncation
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0, // Allow text truncation
    overflow: 'hidden',
  },
  primaryText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  secondaryText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tertiaryText: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export type FluentPersonaSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge';

interface User {
  id: string;
  name: string;
  email?: string;
  role?: string;
  photoUrl?: string;
  presence?: PresenceState;
}

interface FluentPersonaProps {
  /** User to display */
  user: User;
  /** Persona size variant */
  size?: FluentPersonaSize;
  /** Show presence badge on avatar */
  showPresence?: boolean;
  /** Override secondary text (defaults to email or role) */
  secondaryText?: string;
  /** Override tertiary text (defaults to role if secondaryText is email) */
  tertiaryText?: string;
  /** Custom CSS class */
  className?: string;
  /** Text position relative to avatar: 'after' | 'below' */
  textPosition?: 'after' | 'below';
  /** Maximum width for the persona (prevents overflow) */
  maxWidth?: string | number;
}

const sizeMap: Record<FluentPersonaSize, 16 | 24 | 32 | 48 | 72> = {
  tiny: 16,
  small: 24,
  medium: 32,
  large: 48,
  huge: 72,
};

const presenceSizeMap: Record<FluentPersonaSize, 'tiny' | 'small' | 'medium'> = {
  tiny: 'tiny',
  small: 'small',
  medium: 'small',
  large: 'medium',
  huge: 'medium',
};

export const FluentPersona: React.FC<FluentPersonaProps> = ({
  user,
  size = 'medium',
  showPresence = false,
  secondaryText: customSecondaryText,
  tertiaryText: customTertiaryText,
  className,
  textPosition = 'after',
  maxWidth,
}) => {
  const styles = useStyles();

  // Check if user has a name (for placeholder mode)
  const hasName = user.name && user.name.trim().length > 0;

  // Generate avatar fallback data
  const fallbackData = React.useMemo(() => {
    return generateAvatarFallback(user.name || 'User', user.id);
  }, [user.name, user.id]);

  // Determine text content (only show if hasName)
  const secondary = hasName ? (customSecondaryText ?? user.email ?? user.role ?? '') : '';
  const tertiary = hasName
    ? (customTertiaryText ??
      (customSecondaryText && user.role ? user.role : undefined))
    : undefined;

  const avatarSize = sizeMap[size];
  const presenceStatus = mapPresenceToBadgeStatus(user.presence || 'unknown');
  const presenceSize = presenceSizeMap[size];

  // When no name, render just the Avatar without Persona wrapper
  if (!hasName) {
    return (
      <div
        className={`${styles.root} ${className || ''}`}
        style={{ maxWidth, gap: '0' }}
        aria-label="User avatar"
      >
        <Avatar
          image={user.photoUrl ? { src: user.photoUrl } : undefined}
          initials={user.photoUrl ? undefined : fallbackData.initials}
          color="colorful"
          size={avatarSize}
          name=" "
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.root} ${className || ''}`}
      style={{
        maxWidth,
        gap: tokens.spacingHorizontalS,
      }}
      aria-label={`${user.name}${user.presence ? ` - ${user.presence}` : ''}`}
    >
      <Persona
        name={user.name}
        avatar={{
          image: user.photoUrl ? { src: user.photoUrl } : undefined,
          initials: user.photoUrl ? undefined : fallbackData.initials,
          color: 'colorful',
          size: avatarSize,
        }}
        presence={showPresence ? { status: presenceStatus, size: presenceSize } : undefined}
        textPosition={textPosition}
        primaryText={{ children: user.name }}
        secondaryText={
          secondary ? { children: secondary } : undefined
        }
        tertiaryText={
          tertiary ? { children: tertiary } : undefined
        }
      />
    </div>
  );
};

FluentPersona.displayName = 'FluentPersona';

export type { User as PersonaUser };
