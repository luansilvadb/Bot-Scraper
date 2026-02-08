import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormModal } from './FormModal';

describe('FormModal', () => {
  it('should render with title', () => {
    render(
      <FormModal title="Test Modal" isOpen={true} onClose={vi.fn()}>
        <div>Modal Content</div>
      </FormModal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <FormModal title="Test Modal" isOpen={false} onClose={vi.fn()}>
        <div>Modal Content</div>
      </FormModal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should call onClose when Dialog is closed', () => {
    const onClose = vi.fn();
    render(
      <FormModal title="Test Modal" isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </FormModal>
    );

    // Close dialog by clicking outside (simulated via dialog backdrop)
    const dialog = document.querySelector('[role="dialog"]');
    if (dialog) {
      fireEvent.keyDown(dialog, { key: 'Escape' });
    }

    expect(onClose).toHaveBeenCalled();
  });

  it('should render children', () => {
    render(
      <FormModal title="Test Modal" isOpen={true} onClose={vi.fn()}>
        <div data-testid="child">Child Component</div>
      </FormModal>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should apply correct display name', () => {
    expect(FormModal.displayName).toBe('FormModal');
  });
});
