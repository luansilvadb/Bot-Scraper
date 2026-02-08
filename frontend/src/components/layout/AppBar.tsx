import React from 'react';
import {
  makeStyles,
  tokens,
  Tooltip,
} from '@fluentui/react-components';
import {
  bundleIcon,
  Home24Regular,
  Home24Filled,
  Bot24Regular,
  Bot24Filled,
  Desktop24Regular,
  Desktop24Filled,
  ShieldCheckmark24Regular,
  ShieldCheckmark24Filled,
  Settings24Regular,
  Settings24Filled,
} from '@fluentui/react-icons';
import { NavLink, useLocation } from 'react-router-dom';
import type { NavigationItem, PresenceState } from '../../types';
import { UserPersona } from '../ui/UserPersona';

const useStyles = makeStyles({
  appBar: {
    display: 'flex',
    flexDirection: 'column',
    width: '68px',
    minWidth: '68px',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: 'hidden',
  },
  appBarCollapsed: {
    width: '48px',
    minWidth: '48px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '56px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: tokens.spacingVerticalM,
    flexGrow: 1,
    gap: tokens.spacingVerticalS,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground2,
    textDecoration: 'none',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  navItemActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  userSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${tokens.spacingVerticalM} 0`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: '72px',
    boxSizing: 'border-box',
  },
});

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: bundleIcon(Home24Filled, Home24Regular),
    to: '/',
    description: 'Overview and analytics',
  },
  {
    id: 'bots',
    label: 'Bots',
    icon: bundleIcon(Bot24Filled, Bot24Regular),
    to: '/bots',
    description: 'Manage automation bots',
  },
  {
    id: 'workers',
    label: 'Workers',
    icon: bundleIcon(Desktop24Filled, Desktop24Regular),
    to: '/workers',
    description: 'Worker nodes management',
  },
  {
    id: 'approval',
    label: 'Approvals',
    icon: bundleIcon(ShieldCheckmark24Filled, ShieldCheckmark24Regular),
    to: '/approval',
    description: 'Review pending approvals',
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: bundleIcon(Settings24Filled, Settings24Regular),
    to: '/system',
    description: 'System configuration',
  },
];

interface AppBarProps {
  /** Current user display name (empty for placeholder avatar) */
  currentUserName?: string;
  /** Current user presence status (defaults to 'offline') */
  currentUserPresence?: PresenceState;
  /** Current user avatar URL (optional) */
  currentUserAvatar?: string;
  /** Called when user clicks their profile */
  onProfileClick?: () => void;
  /** Called when user selects settings from menu */
  onSettingsClick?: () => void;
  /** Called when user selects sign out from menu */
  onSignOutClick?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({
  currentUserName = '',
  currentUserPresence = 'offline',
  currentUserAvatar,
  onProfileClick,
  onSettingsClick,
  onSignOutClick,
}) => {
  const styles = useStyles();
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(to);
  };

  // Build user object for UserPersona
  const currentUser = React.useMemo(
    () => ({
      id: 'current-user',
      name: currentUserName,
      photoUrl: currentUserAvatar,
      presence: currentUserPresence,
    }),
    [currentUserName, currentUserAvatar, currentUserPresence]
  );

  return (
    <aside className={styles.appBar} role="navigation" aria-label="Main Navigation">
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <span role="img" aria-label="Bot Scraper">🤖</span>
        </div>
      </div>

      <nav className={styles.nav} role="menubar" aria-label="Application Navigation">
        {navigationItems.map((item) => {
          const active = isActive(item.to);
          const IconComponent = item.icon;
          return (
            <Tooltip
              key={item.id}
              content={item.description || item.label}
              relationship="label"
              positioning="after"
            >
              <NavLink
                to={item.to}
                className={({ isActive: linkActive }) =>
                  `${styles.navItem} ${(linkActive || active) ? styles.navItemActive : ''}`
                }
                role="menuitem"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <IconComponent filled={active} />
              </NavLink>
            </Tooltip>
          );
        })}
      </nav>

      <div className={styles.userSection}>
        <Tooltip
          content={currentUserName || 'User'}
          relationship="label"
          positioning="after"
        >
        <UserPersona
          user={currentUser}
          size="medium"
          showMenu
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onSignOutClick={onSignOutClick}
        />
        </Tooltip>
      </div>
    </aside>
  );
};
