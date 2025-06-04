import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button component', () => {
  test('renders children and calls onClick', async () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);

    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies variant and size classes', () => {
    render(
      <Button variant="secondary" size="large" className="custom-class">
        Test
      </Button>
    );

    const btn = screen.getByRole('button', { name: /test/i });
    expect(btn.className).toContain('bg-gray-200');
    expect(btn.className).toContain('px-6');
    expect(btn.className).toContain('custom-class');
  });

  test('falls back to primary variant when unknown', () => {
    render(<Button variant="unknown">Fallback</Button>);
    const btn = screen.getByRole('button', { name: /fallback/i });
    expect(btn.className).toContain('leather-button');
  });
});
