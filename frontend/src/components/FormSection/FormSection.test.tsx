import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FormSection } from './FormSection';

describe('FormSection', () => {
  it('should render with title and icon', () => {
    render(
      <FormSection icon={<span data-testid="icon">Icon</span>} title="Section Title">
        <div data-testid="content">Content</div>
      </FormSection>
    );

    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should render divider when showDivider is true', () => {
    const { container } = render(
      <FormSection icon={<span>Icon</span>} title="Title" showDivider>
        <div>Content</div>
      </FormSection>
    );

    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('should not render divider when showDivider is false', () => {
    const { container } = render(
      <FormSection icon={<span>Icon</span>} title="Title">
        <div>Content</div>
      </FormSection>
    );

    expect(container.querySelector('hr')).not.toBeInTheDocument();
  });
});
