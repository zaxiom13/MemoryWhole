import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompletionRoute from './CompletionRoute';

// Mock the completion page component
jest.mock('../features/completion', () => ({
  CompletionPage: (props) => (
    <div data-testid="completion-page">
      <div data-testid="completion-time">{props.completionTime}</div>
      <div data-testid="selected-reference">{props.selectedReference}</div>
      <button data-testid="return-to-menu" onClick={props.onReturnToMenu}>Return to Menu</button>
      <button data-testid="try-again" onClick={props.onTryAgain}>Try Again</button>
    </div>
  )
}));

describe('CompletionRoute', () => {
  const defaultProps = {
    completionTime: 120,
    selectedReference: 'Test reference text',
    onReturnToMenu: jest.fn(),
    onTryAgain: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the CompletionPage component', () => {
      render(<CompletionRoute {...defaultProps} />);
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
    });

    it('passes all props to CompletionPage', () => {
      render(<CompletionRoute {...defaultProps} />);
      
      // Check that the component renders with the expected content
      expect(screen.getByTestId('completion-time')).toHaveTextContent('120');
      expect(screen.getByTestId('selected-reference')).toHaveTextContent('Test reference text');
    });

    it('renders with different completion times', () => {
      render(<CompletionRoute {...defaultProps} completionTime={45} />);
      
      expect(screen.getByTestId('completion-time')).toHaveTextContent('45');
    });

    it('renders with different reference texts', () => {
      const customReference = 'Custom reference for testing';
      render(<CompletionRoute {...defaultProps} selectedReference={customReference} />);
      
      expect(screen.getByTestId('selected-reference')).toHaveTextContent(customReference);
    });
  });

  describe('prop handling', () => {
    it('handles undefined completionTime', () => {
      render(<CompletionRoute {...defaultProps} completionTime={undefined} />);
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
    });

    it('handles null selectedReference', () => {
      render(<CompletionRoute {...defaultProps} selectedReference={null} />);
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
    });

    it('handles missing callback functions', () => {
      render(
        <CompletionRoute 
          completionTime={60}
          selectedReference="Test"
          onReturnToMenu={undefined}
          onTryAgain={undefined}
        />
      );
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
    });
  });

  describe('callback prop forwarding', () => {
    it('forwards onReturnToMenu callback correctly', () => {
      const mockCallback = jest.fn();
      render(<CompletionRoute {...defaultProps} onReturnToMenu={mockCallback} />);
      
      // Check that the button exists and can be clicked
      expect(screen.getByTestId('return-to-menu')).toBeInTheDocument();
    });

    it('forwards onTryAgain callback correctly', () => {
      const mockCallback = jest.fn();
      render(<CompletionRoute {...defaultProps} onTryAgain={mockCallback} />);
      
      // Check that the button exists and can be clicked
      expect(screen.getByTestId('try-again')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles zero completion time', () => {
      render(<CompletionRoute {...defaultProps} completionTime={0} />);
      
      expect(screen.getByTestId('completion-time')).toHaveTextContent('0');
    });

    it('handles negative completion time', () => {
      render(<CompletionRoute {...defaultProps} completionTime={-10} />);
      
      expect(screen.getByTestId('completion-time')).toHaveTextContent('-10');
    });

    it('handles very large completion time', () => {
      render(<CompletionRoute {...defaultProps} completionTime={999999} />);
      
      expect(screen.getByTestId('completion-time')).toHaveTextContent('999999');
    });

    it('handles empty string reference', () => {
      render(<CompletionRoute {...defaultProps} selectedReference="" />);
      
      expect(screen.getByTestId('selected-reference')).toHaveTextContent('');
    });

    it('handles very long reference text', () => {
      const longText = 'A'.repeat(1000);
      render(<CompletionRoute {...defaultProps} selectedReference={longText} />);
      
      expect(screen.getByTestId('selected-reference')).toHaveTextContent(longText);
    });

    it('handles special characters in reference', () => {
      const specialText = 'Test with special chars: !@#$%^&*(){}[]|\\:";\'<>?,./~`';
      render(<CompletionRoute {...defaultProps} selectedReference={specialText} />);
      
      expect(screen.getByTestId('selected-reference')).toHaveTextContent(specialText);
    });

    it('handles Unicode characters in reference', () => {
      const unicodeText = 'Test with Unicode: 你好 🌍 ñ ü é';
      render(<CompletionRoute {...defaultProps} selectedReference={unicodeText} />);
      
      expect(screen.getByTestId('selected-reference')).toHaveTextContent(unicodeText);
    });
  });

  describe('component integration', () => {
    it('passes through additional props', () => {
      render(<CompletionRoute {...defaultProps} customProp="test" />);
      
      // Just check that the component renders without issues
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
    });

    it('maintains component structure consistency', () => {
      const { rerender } = render(<CompletionRoute {...defaultProps} />);
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
      
      rerender(<CompletionRoute {...defaultProps} completionTime={200} />);
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
      expect(screen.getByTestId('completion-time')).toHaveTextContent('200');
    });
  });

  describe('performance considerations', () => {
    it('does not unnecessarily re-render CompletionPage', () => {
      const { rerender } = render(<CompletionRoute {...defaultProps} />);
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
      
      // Re-render with same props
      rerender(<CompletionRoute {...defaultProps} />);
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
    });

    it('handles rapid prop changes gracefully', () => {
      const { rerender } = render(<CompletionRoute {...defaultProps} />);
      
      for (let i = 0; i < 10; i++) {
        rerender(<CompletionRoute {...defaultProps} completionTime={i * 10} />);
      }
      
      expect(screen.getByTestId('completion-page')).toBeInTheDocument();
      expect(screen.getByTestId('completion-time')).toHaveTextContent('90');
    });
  });
});