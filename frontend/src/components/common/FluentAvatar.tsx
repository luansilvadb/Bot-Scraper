/**
 * FluentAvatar Component
 * Teams-style avatar with initials fallback and presence badge
 * Uses Fluent UI v9 Avatar and PresenceBadge components
 */

import * as React from 'react';
import {
  Avatar,
  PresenceBadge,
  makeStyles,
  type AvatarSize,
} from '@fluentui/react-components';
import {
  generateAvatarFallback,
  mapPresenceToBadgeStatus,
  type PresenceState,
} from '../../lib/avatar-colors';

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    position: 'relative',
  },
  avatar: {
    // Fluent UI Avatar styling is handled by the component
  },
});

export type FluentAvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge';

interface FluentAvatarProps {
  /** User name for initials generation */
  name: string;
  /** User ID for deterministic color generation */
  userId?: string;
  /** Avatar image URL (optional) */
  photoUrl?: string;
  /** User presence status */
  presence?: PresenceState;
  /** Avatar size variant */
  size?: FluentAvatarSize;
  /** Show presence badge */
  showPresence?: boolean;
  /** Custom initials (auto-generated if not provided) */
  initials?: string;
  /** Use deterministic color for fallback (default: true) */
  useDeterministicColor?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
}

const sizeMap: Record<FluentAvatarSize, AvatarSize> = {
  tiny: 16,
  small: 24,
  medium: 32,
  large: 48,
  huge: 72,
};

export const FluentAvatar: React.FC<FluentAvatarProps> = ({
  name,
  userId,
  photoUrl,
  presence = 'unknown',
  size = 'medium',
  showPresence = false,
  initials: customInitials,
  useDeterministicColor = true,
  className,
  ariaLabel,
}) => {
  const styles = useStyles();

  // Generate initials and color ID
  const fallbackData = React.useMemo(() => {
    if (useDeterministicColor) {
      return generateAvatarFallback(name, userId);
    }
    return {
      initials: customInitials || name.charAt(0).toUpperCase(),
      colorId: 1,
    };
  }, [name, userId, customInitials, useDeterministicColor]);

  const avatarSize = sizeMap[size];
  const presenceStatus = mapPresenceToBadgeStatus(presence);

  return (
    <div className={`${styles.root} ${className || ''}`}>
      <Avatar
        name={name}
        image={{
          src: photoUrl,
        }}
        initials={fallbackData.initials}
        color={useDeterministicColor ? ('colorful' as const) : undefined}
        size={avatarSize}
        aria-label={ariaLabel || name}
        className={styles.avatar}
      >
        {showPresence && (
          <PresenceBadge
            status={presenceStatus}
            size={size === 'tiny' ? 'tiny' : size === 'small' ? 'small' : 'medium'}
            outOfOffice={presence === 'offline'}
          />
        )}
      </Avatar>
    </div>
  );
};

FluentAvatar.displayName = 'FluentAvatar';
