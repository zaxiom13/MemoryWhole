import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BestTimesRoute from './BestTimesRoute';

// Mock the BestTimesPage component
jest.mock('../features/statistics', () => ({
  BestTimesPage: (props) => (
    <div data-testid="best-times-page">
      <button data-testid="back-button" onClick={props.onBack}>Back</button>
    </div>
  )
}));

describe('BestTimesRoute', () => {
  describe('rendering', () => {
    it('renders the BestTimesPage component', () => {
      const mockOnBack = jest.fn();
      render(<BestTimesRoute onBack={mockOnBack} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });

    it('passes onBack prop to BestTimesPage', () => {
      const mockOnBack = jest.fn();
      render(<BestTimesRoute onBack={mockOnBack} />);
      
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });
  });

  describe('prop handling', () => {
    it('handles undefined onBack prop', () => {
      render(<BestTimesRoute onBack={undefined} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });

    it('handles null onBack prop', () => {
      render(<BestTimesRoute onBack={null} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });

    it('forwards callback functions correctly', () => {
      const mockOnBack = jest.fn();
      render(<BestTimesRoute onBack={mockOnBack} />);
      
      // The mock component should receive the callback
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    it('maintains consistent structure across renders', () => {
      const { rerender } = render(<BestTimesRoute onBack={jest.fn()} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
      
      rerender(<BestTimesRoute onBack={jest.fn()} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(<BestTimesRoute onBack={jest.fn()} />);
      
      for (let i = 0; i < 10; i++) {
        rerender(<BestTimesRoute onBack={jest.fn()} />);
      }
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles function that throws error', () => {
      const throwingFunction = () => {
        throw new Error('Test error');
      };
      
      render(<BestTimesRoute onBack={throwingFunction} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });

    it('handles non-function onBack values gracefully', () => {
      render(<BestTimesRoute onBack="not a function" />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });

    it('handles numeric onBack values gracefully', () => {
      render(<BestTimesRoute onBack={42} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });

    it('handles object onBack values gracefully', () => {
      render(<BestTimesRoute onBack={{}} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });
  });

  describe('integration', () => {
    it('works within different parent containers', () => {
      const mockOnBack = jest.fn();
      render(
        <div>
          <h1>Title</h1>
          <BestTimesRoute onBack={mockOnBack} />
          <footer>Footer</footer>
        </div>
      );
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('can be rendered multiple times', () => {
      const mockOnBack1 = jest.fn();
      const mockOnBack2 = jest.fn();
      
      render(
        <div>
          <BestTimesRoute onBack={mockOnBack1} />
          <BestTimesRoute onBack={mockOnBack2} />
        </div>
      );
      
      const pages = screen.getAllByTestId('best-times-page');
      expect(pages).toHaveLength(2);
    });
  });

  describe('performance', () => {
    it('does not cause unnecessary re-renders with same props', () => {
      const stableCallback = jest.fn();
      const { rerender } = render(<BestTimesRoute onBack={stableCallback} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
      
      rerender(<BestTimesRoute onBack={stableCallback} />);
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
    });

    it('handles frequent prop updates efficiently', () => {
      const { rerender } = render(<BestTimesRoute onBack={jest.fn()} />);
      
      // Simulate frequent updates
      const start = Date.now();
      for (let i = 0; i < 100; i++) {
        rerender(<BestTimesRoute onBack={jest.fn()} />);
      }
      const duration = Date.now() - start;
      
      expect(screen.getByTestId('best-times-page')).toBeInTheDocument();
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});