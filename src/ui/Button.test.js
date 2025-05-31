import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: jest.fn().mockImplementation((props) => {
      const { children, whileHover, whileTap, ...otherProps } = props;
      const React = require('react');
      return React.createElement('button', otherProps, children);
    })
  }
}));

describe('Button', () => {
  describe('basic rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders with children elements', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('applies default classes correctly', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-lg', 'font-medium', 'transition-all', 'duration-300', 'focus:outline-none');
    });
  });

  describe('variant prop', () => {
    it('applies primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('leather-button');
    });

    it('applies secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200', 'dark:bg-gray-700', 'hover:bg-gray-300', 'dark:hover:bg-gray-600', 'text-gray-800', 'dark:text-gray-200');
    });

    it('applies danger variant classes', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700', 'text-white');
    });

    it('applies success variant classes', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700', 'text-white');
    });

    it('applies info variant classes', () => {
      render(<Button variant="info">Info</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('falls back to primary variant for invalid variant', () => {
      render(<Button variant="invalid">Invalid</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('leather-button');
    });
  });

  describe('size prop', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-5', 'py-2');
    });

    it('applies small size classes', () => {
      render(<Button size="small">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1', 'text-sm');
    });

    it('applies large size classes', () => {
      render(<Button size="large">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });

    it('falls back to medium size for invalid size', () => {
      render(<Button size="invalid">Invalid</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-5', 'py-2');
    });
  });

  describe('className prop', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('applies empty string className by default', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      // Should not fail when className is empty string
      expect(button).toBeInTheDocument();
    });

    it('combines custom className with default classes', () => {
      render(<Button className="custom-class" variant="danger" size="large">Combined</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'bg-red-600', 'px-6', 'py-3');
    });
  });

  describe('event handling', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes event to onClick handler', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('works without onClick handler', () => {
      render(<Button>No handler</Button>);
      // Should not throw error when clicked without handler
      expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
    });
  });

  describe('additional props', () => {
    it('passes through additional props', () => {
      render(<Button disabled type="submit" data-testid="test-button">Props</Button>);
      const button = screen.getByTestId('test-button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('passes through aria attributes', () => {
      render(<Button aria-label="Custom label" aria-pressed="true">Aria</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('passes through data attributes', () => {
      render(<Button data-custom="value" data-another="test">Data</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-custom', 'value');
      expect(button).toHaveAttribute('data-another', 'test');
    });
  });

  describe('complex combinations', () => {
    it('handles multiple props correctly', () => {
      const handleClick = jest.fn();
      render(
        <Button
          variant="success"
          size="large"
          className="custom-class"
          onClick={handleClick}
          disabled
          data-testid="complex-button"
        >
          Complex Button
        </Button>
      );

      const button = screen.getByTestId('complex-button');
      expect(button).toHaveClass('bg-green-600', 'px-6', 'py-3', 'custom-class');
      expect(button).toBeDisabled();
      
      // Click should not trigger when disabled
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles undefined variant gracefully', () => {
      render(<Button variant={undefined}>Undefined</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('leather-button');
    });

    it('handles null size gracefully', () => {
      render(<Button size={null}>Null</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-5', 'py-2');
    });

    it('handles empty string variant', () => {
      render(<Button variant="">Empty</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('leather-button');
    });

    it('handles numeric values for variant', () => {
      render(<Button variant={123}>Number</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('leather-button');
    });
  });
});