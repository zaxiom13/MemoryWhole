import React from 'react';
import { render, screen } from '@testing-library/react';
import ReferenceTyping from '../ReferenceTyping';

/**
 * Utility function to render the component with minimal required props
 */
function renderComponent(props = {}) {
  const defaultProps = {
    selectedReference: 'Reference text',
    onInputChange: jest.fn(),
    onBack: jest.fn(),
    isComplete: false,
  };
  return render(<ReferenceTyping {...defaultProps} {...props} />);
}

describe('ReferenceTyping component', () => {
  test('does not render Show Reference control', () => {
    renderComponent();
    expect(screen.queryByText(/Show Reference/i)).toBeNull();
  });

  test('auto-opens reference text when showReferenceEnabled is true', () => {
    renderComponent({ showReferenceEnabled: true });
    expect(screen.getByText('Reference text')).toBeInTheDocument();
  });
});
