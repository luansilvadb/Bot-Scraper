import React from 'react';
import { Badge } from '@fluentui/react-components';

// Badge color type from Fluent UI
// https://react.fluentui.dev/?path=/docs/components-badge-badge--docs
type BadgeColor = 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning';

export type StatusValue =
| 'active'
| 'inactive'
| 'pending'
| 'error'
| 'connected'
| 'disconnected'
| 'approved'
| 'rejected'
| 'paused'
| 'unknown'
| string;

export type StatusSize = 'small' | 'medium';

export interface StatusBadgeProps {
  status: StatusValue;
  size?: StatusSize;
  customMap?: Record<string, { color: BadgeColor; label?: string }>;
}

const defaultStatusMap: Record<string, { color: BadgeColor; label: string }> = {
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'informative', label: 'Inactive' },
  pending: { color: 'warning', label: 'Pending' },
  error: { color: 'danger', label: 'Error' },
  connected: { color: 'success', label: 'Connected' },
  disconnected: { color: 'danger', label: 'Disconnected' },
  approved: { color: 'success', label: 'Approved' },
  rejected: { color: 'danger', label: 'Rejected' },
  paused: { color: 'warning', label: 'Paused' },
  unknown: { color: 'informative', label: 'Unknown' },
};

function normalizeStatus(status: string): string {
  return status.toLowerCase().replace(/_/g, '');
}

/**
 * A standardized status badge component with automatic color and icon mapping.
 *
 * @example
 * ```tsx
 * <StatusBadge status="active" size="medium" />
 * <StatusBadge status="pending_approval" customMap={customMap} />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
  customMap = {},
}) => {
  const normalizedStatus = normalizeStatus(status);
  const statusConfig = customMap[normalizedStatus] || defaultStatusMap[normalizedStatus] || {
    color: 'informative',
    label: status,
  };

  return (
    <Badge
      appearance="filled"
      color={statusConfig.color}
      size={size}
    >
      {statusConfig.label}
    </Badge>
  );
};

StatusBadge.displayName = 'StatusBadge';
