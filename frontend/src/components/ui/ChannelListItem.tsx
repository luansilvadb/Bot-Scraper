/**
 * ChannelListItem Component
 * Teams-style channel/contact list item with Persona display
 * Displays channel/contact information with avatar, presence, and status
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  mergeClasses,
  Badge,
} from '@fluentui/react-components';
import { FluentPersona, type PersonaUser } from '../common/FluentPersona';
import type { PresenceState } from '../../lib/avatar-colors';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    position: 'relative',
    minHeight: '48px',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },

  },
  selected: {
    backgroundColor: tokens.colorNeutralBackground1Pressed,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
  },
  content: {
    flexGrow: 1,
    minWidth: 0, // Allow text truncation
    marginLeft: tokens.spacingHorizontalS,
  },
  timestamp: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    marginLeft: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
  unreadBadge: {
    marginLeft: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
  pinnedIndicator: {
    position: 'absolute',
    left: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '24px',
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusSmall,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

interface ChannelListItemProps {
  /** Channel/Item ID */
  id: string;
  /** Channel name or primary text */
  primaryText: string;
  /** Secondary text (description, last message preview, etc.) */
  secondaryText?: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Presence status */
  presence?: PresenceState;
  /** Last activity timestamp */
  timestamp?: Date;
  /** Unread message count */
  unreadCount?: number;
  /** Whether item is pinned to top */
  isPinned?: boolean;
  /** Whether item is currently selected */
  isSelected?: boolean;
  /** Called when item is clicked */
  onClick?: (id: string) => void;
  /** Called when item is selected via keyboard */
  onSelect?: (id: string) => void;
  /** Custom CSS class */
  className?: string;
}

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    // Today - show time
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};

export const ChannelListItem: React.FC<ChannelListItemProps> = ({
  id,
  primaryText,
  secondaryText,
  avatarUrl,
  presence,
  timestamp,
  unreadCount = 0,
  isPinned = false,
  isSelected = false,
  onClick,
  onSelect,
  className,
}) => {
  const styles = useStyles();

  const handleClick = React.useCallback(() => {
    onClick?.(id);
  }, [onClick, id]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.(id);
      }
    },
    [onSelect, id]
  );

  // Build user object for Persona
  const user: PersonaUser = React.useMemo(
    () => ({
      id,
      name: primaryText,
      photoUrl: avatarUrl,
      presence,
    }),
    [id, primaryText, avatarUrl, presence]
  );

  return (
    <div
      className={mergeClasses(
        styles.root,
        isSelected && styles.selected,
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="listitem"
      tabIndex={0}
      aria-selected={isSelected}
    >
      {isPinned && <div className={styles.pinnedIndicator} aria-hidden="true" />}

      <FluentPersona
        user={user}
        size="small"
        showPresence
        secondaryText={secondaryText}
      />

      <div className={styles.row}>
        {timestamp && (
          <span className={styles.timestamp}>{formatTimestamp(timestamp)}</span>
        )}

        {unreadCount > 0 && (
          <Badge
            appearance="filled"
            color="brand"
            size="small"
            className={styles.unreadBadge}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

ChannelListItem.displayName = 'ChannelListItem';
