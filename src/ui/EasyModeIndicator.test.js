import React from 'react';
import { render, screen } from '@testing-library/react';
import EasyModeIndicator from './EasyModeIndicator';

describe('EasyModeIndicator component', () => {
  test('renders label and svg icon', () => {
    const { container } = render(<EasyModeIndicator />);

    expect(screen.getByText(/easy mode/i)).toBeInTheDocument();
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
