/**
 * EmptyState Component
 * Displays empty state with icon, title, description, and optional action
 * Used when lists or content areas have no data to display
 */

import * as React from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Text,
  Title3,
} from '@fluentui/react-components';
import type { FluentIconsProps } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
    minHeight: '200px',
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalL,
  },
  title: {
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalS,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    maxWidth: '400px',
    marginBottom: tokens.spacingVerticalL,
  },
  action: {
    marginTop: tokens.spacingVerticalM,
  },
});

export interface EmptyStateProps {
  /** Fluent UI icon component */
  icon?: React.ReactElement<FluentIconsProps>;
  /** Title text */
  title: string;
  /** Description message */
  description?: string;
  /** Call-to-action button label */
  actionLabel?: string;
  /** Click handler for action button */
  onAction?: () => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * EmptyState - Displays when no content is available
 *
 * Usage:
 * ```tsx
 * <EmptyState
 *   icon={<Search24Regular />}
 *   title="No results found"
 *   description="Try adjusting your search terms"
 *   actionLabel="Clear search"
 *   onAction={handleClear}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  const styles = useStyles();

  return (
    <div className={className} role="status" aria-live="polite">
      <div className={styles.root}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <Title3 className={styles.title}>{title}</Title3>
        {description && (
          <Text className={styles.description}>{description}</Text>
        )}
        {actionLabel && onAction && (
          <Button
            appearance="primary"
            onClick={onAction}
            className={styles.action}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
