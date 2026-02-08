/**
 * UserPersona Component
 * Current user display component for AppBar or header
 * Shows user's avatar, name, and presence status
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  PersonAccounts24Regular,
  Settings24Regular,
  SignOut24Regular,
} from '@fluentui/react-icons';
import { FluentPersona, type PersonaUser } from '../common/FluentPersona';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personaWrapper: {
    cursor: 'pointer',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      transform: 'scale(1.05)',
    },
    ':active': {
      transform: 'scale(0.95)',
    },
  },
});

interface UserPersonaProps {
  /** Current user data */
  user: PersonaUser;
  /** Called when user clicks profile/settings */
  onProfileClick?: () => void;
  /** Called when user selects settings from menu */
  onSettingsClick?: () => void;
  /** Called when user selects sign out from menu */
  onSignOutClick?: () => void;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show the menu trigger button */
  showMenu?: boolean;
  /** Custom CSS class */
  className?: string;
}

export const UserPersona: React.FC<UserPersonaProps> = ({
  user,
  onProfileClick,
  onSettingsClick,
  onSignOutClick,
  size = 'small',
  showMenu = true,
  className,
}) => {
  const styles = useStyles();

  const handleProfileClick = React.useCallback(() => {
    onProfileClick?.();
  }, [onProfileClick]);

  // If menu is disabled, just show the persona
  if (!showMenu) {
    return (
      <div className={`${styles.root} ${className || ''}`}>
      <div
        className={styles.personaWrapper}
        onClick={handleProfileClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProfileClick();
          }
        }}
        aria-label={user.name ? `${user.name} profile` : 'User profile'}
      >
        <FluentPersona
          user={user}
          size={size}
          showPresence={false}
          textPosition={user.name ? 'after' : undefined}
        />
      </div>
      </div>
    );
  }

  // With integrated menu
  return (
    <div className={`${styles.root} ${className || ''}`}>
      <Menu positioning="above-end">
        <MenuTrigger>
          <div
            className={styles.personaWrapper}
            role="button"
            tabIndex={0}
            aria-label={user.name ? `${user.name} profile` : 'User profile'}
          >
            <FluentPersona
              user={user}
              size={size}
              showPresence={false}
              textPosition={user.name ? 'after' : undefined}
            />
          </div>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<PersonAccounts24Regular />}
              onClick={onProfileClick}
            >
              Profile
            </MenuItem>
            <MenuItem
              icon={<Settings24Regular />}
              onClick={onSettingsClick}
            >
              Settings
            </MenuItem>
            <MenuItem
              icon={<SignOut24Regular />}
              onClick={onSignOutClick}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};

export type { PersonaUser };

UserPersona.displayName = 'UserPersona';
