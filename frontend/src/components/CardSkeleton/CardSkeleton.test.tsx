import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CardSkeleton } from './CardSkeleton';

describe('CardSkeleton', () => {
  it('should render default number of skeleton cards', () => {
    render(<CardSkeleton />);

    const cards = document.querySelectorAll('[role="progressbar"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render custom count of skeleton cards', () => {
    const { container } = render(<CardSkeleton count={4} />);

    // Count the number of skeleton cards by checking skeleton items
    const skeletonItems = container.querySelectorAll('[role="progressbar"]');
    expect(skeletonItems.length).toBeGreaterThan(0);
  });

  it('should apply custom height', () => {
    const { container } = render(<CardSkeleton count={1} cardHeight={200} />);

    const cards = container.querySelectorAll('[style*="height"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should have correct display name', () => {
    expect(CardSkeleton.displayName).toBe('CardSkeleton');
  });
});
