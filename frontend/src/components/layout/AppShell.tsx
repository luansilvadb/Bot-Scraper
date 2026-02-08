import React, { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import { HamburgerButton } from './HamburgerButton';
import { AppBar } from './AppBar';
import { ListPane } from './ListPane';
import { MainStage } from './MainStage';
import { useResponsive } from '../../hooks/useResponsive';
import type { ListItem } from '../../types';

const useStyles = makeStyles({
  appShell: {
    display: 'grid',
    gridTemplateColumns: '68px 280px 1fr',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 1023px)': {
      gridTemplateColumns: '48px 240px 1fr',
    },
    '@media (max-width: 767px)': {
      gridTemplateColumns: '1fr',
    },
  },
  appShellMobile: {
    gridTemplateColumns: '1fr',
  },
  appBar: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 767px)': {
      display: 'none',
    },
  },
  appBarOpen: {
    '@media (max-width: 767px)': {
      display: 'flex',
      position: 'fixed',
      left: 0,
      top: 0,
      width: '68px',
      zIndex: 1000,
    },
  },
  listPane: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 767px)': {
      display: 'none',
    },
  },
  mobileHeader: {
    display: 'none',
    '@media (max-width: 767px)': {
      display: 'flex',
      alignItems: 'center',
      height: '56px',
      padding: `0 ${tokens.spacingHorizontalM}`,
      backgroundColor: tokens.colorNeutralBackground1,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },
  },
  mobileContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    '@media (max-width: 767px)': {
      paddingTop: '56px',
    },
  },
  overlay: {
    display: 'none',
    '@media (max-width: 767px)': {
      display: 'block',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
  },
});

// Mock list items - in real app these would come from API/state
const getMockListItems = (pathname: string): ListItem[] => {
  switch (pathname) {
    case '/':
    case '/dashboard':
      return [
        { id: '1', primaryText: 'Overview', secondaryText: 'System summary' },
        { id: '2', primaryText: 'Analytics', secondaryText: 'Usage statistics' },
        { id: '3', primaryText: 'Activity Log', secondaryText: 'Recent events' },
      ];
    case '/bots':
      return [
        { id: 'b1', primaryText: 'Bot A', secondaryText: 'Active • Last run 5m ago' },
        { id: 'b2', primaryText: 'Bot B', secondaryText: 'Paused • Last run 2h ago' },
        { id: 'b3', primaryText: 'Bot C', secondaryText: 'Active • Last run 1m ago' },
      ];
    case '/workers':
      return [
        { id: 'w1', primaryText: 'Worker 1', secondaryText: 'Online • 3 tasks' },
        { id: 'w2', primaryText: 'Worker 2', secondaryText: 'Offline' },
        { id: 'w3', primaryText: 'Worker 3', secondaryText: 'Online • 1 task' },
      ];
    case '/approval':
      return [
        { id: 'a1', primaryText: 'Product X', secondaryText: 'Pending review' },
        { id: 'a2', primaryText: 'Product Y', secondaryText: 'Pending review' },
        { id: 'a3', primaryText: 'Product Z', secondaryText: 'Approved' },
      ];
    default:
      return [];
  }
};

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
    case '/dashboard':
      return 'Dashboard';
    case '/bots':
      return 'Bots';
    case '/workers':
      return 'Workers';
    case '/approval':
      return 'Approvals';
    case '/system':
      return 'Settings';
    default:
      return 'Bot Scraper';
  }
};

export const AppShell: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  const { isMobile } = useResponsive();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  const listItems = getMockListItems(location.pathname);
  const pageTitle = getPageTitle(location.pathname);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleListItemSelect = useCallback((id: string) => {
    setSelectedItemId(id);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Mobile view
  if (isMobile) {
    return (
      <div className={mergeClasses(styles.appShell, styles.appShellMobile)}>
        {/* Mobile Header with Hamburger */}
        <header className={styles.mobileHeader}>
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            onToggle={handleMobileMenuToggle}
            aria-label="Toggle navigation menu"
          />
        </header>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className={styles.overlay}
            onClick={handleMobileMenuClose}
            role="button"
            tabIndex={-1}
            aria-label="Close navigation menu"
          />
        )}

        {/* AppBar slides in on mobile */}
        <div
          className={mergeClasses(
            styles.appBar,
            isMobileMenuOpen && styles.appBarOpen
          )}
          role="navigation"
          aria-label="Main Navigation"
        >
          <AppBar />
        </div>

        {/* Main Content */}
        <div className={styles.mobileContent}>
          <MainStage title={pageTitle}>
            <Outlet />
          </MainStage>
        </div>
      </div>
    );
  }

  // Desktop/Tablet view - 3 column layout
  return (
    <div className={styles.appShell}>
      {/* Column 1: AppBar */}
      <div className={styles.appBar} role="navigation" aria-label="Main Navigation">
        <AppBar />
      </div>

      {/* Column 2: ListPane */}
      <div className={styles.listPane} role="complementary" aria-label="List Pane">
        <ListPane
          title={pageTitle}
          items={listItems}
          selectedId={selectedItemId}
          onSelect={handleListItemSelect}
          emptyMessage="Select a section from the navigation"
        />
      </div>

      {/* Column 3: MainStage */}
      <MainStage title={listItems.find(item => item.id === selectedItemId)?.primaryText || pageTitle}>
        <Outlet />
      </MainStage>
    </div>
  );
};
