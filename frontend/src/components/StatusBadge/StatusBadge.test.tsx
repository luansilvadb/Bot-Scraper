import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('should render with default status', () => {
    render(<StatusBadge status="active" />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render with custom status', () => {
    render(<StatusBadge status="pending" />);

    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should handle status with underscores', () => {
    render(<StatusBadge status="PENDING_APPROVAL" />);

    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should handle case-insensitive status', () => {
    render(<StatusBadge status="ACTIVE" />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render unknown status with original value', () => {
    render(<StatusBadge status="custom_status" />);

    expect(screen.getByText('custom_status')).toBeInTheDocument();
  });

  it('should use custom map', () => {
    const customMap = {
      custom: { color: 'brand' as const, label: 'Custom Label' },
    };

    render(<StatusBadge status="custom" customMap={customMap} />);

    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('should have correct display name', () => {
    expect(StatusBadge.displayName).toBe('StatusBadge');
  });
});
