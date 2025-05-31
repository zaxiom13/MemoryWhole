import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EasyModeIndicator from './EasyModeIndicator';

describe('EasyModeIndicator', () => {
  describe('rendering', () => {
    it('renders the Easy Mode text', () => {
      render(<EasyModeIndicator />);
      expect(screen.getByText('Easy Mode')).toBeInTheDocument();
    });

    it('renders as a div container', () => {
      render(<EasyModeIndicator />);
      const container = screen.getByText('Easy Mode').parentElement;
      expect(container.tagName).toBe('DIV');
    });

    it('renders the SVG icon', () => {
      render(<EasyModeIndicator />);
      const container = screen.getByText('Easy Mode').parentElement;
      const svg = container.querySelector('svg');
      
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('renders SVG with correct structure', () => {
      render(<EasyModeIndicator />);
      const container = screen.getByText('Easy Mode').parentElement;
      const svg = container.querySelector('svg');
      
      // Check that SVG has expected child elements
      expect(svg.querySelector('path')).toBeInTheDocument();
      expect(svg.querySelectorAll('line')).toHaveLength(2);
    });
  });

  describe('accessibility', () => {
    it('has proper structure for screen readers', () => {
      render(<EasyModeIndicator />);
      
      // The component should be accessible by text content
      expect(screen.getByText('Easy Mode')).toBeInTheDocument();
    });

    it('uses currentColor for proper theming', () => {
      render(<EasyModeIndicator />);
      const container = screen.getByText('Easy Mode').parentElement;
      const svg = container.querySelector('svg');
      
      // SVG should inherit color from parent
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });
  });

  describe('layout and styling', () => {
    it('contains both icon and text', () => {
      render(<EasyModeIndicator />);
      const container = screen.getByText('Easy Mode').parentElement;
      
      // Should contain both SVG and text
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(container).toHaveTextContent('Easy Mode');
    });

    it('has the expected className attribute', () => {
      render(<EasyModeIndicator />);
      const container = screen.getByText('Easy Mode').parentElement;
      
      // Check that className is set (even if CSS isn't processed in tests)
      expect(container).toHaveAttribute('className');
      expect(container.className).toContain('bg-green-100');
    });
  });

  describe('integration', () => {
    it('can be rendered multiple times without conflicts', () => {
      render(
        <div>
          <EasyModeIndicator />
          <EasyModeIndicator />
          <EasyModeIndicator />
        </div>
      );
      
      const indicators = screen.getAllByText('Easy Mode');
      expect(indicators).toHaveLength(3);
      
      // Each should render properly
      indicators.forEach(indicator => {
        expect(indicator).toBeInTheDocument();
      });
    });

    it('works correctly within different parent containers', () => {
      render(
        <div>
          <div>
            <EasyModeIndicator />
            <span>Other content</span>
          </div>
        </div>
      );
      
      expect(screen.getByText('Easy Mode')).toBeInTheDocument();
      expect(screen.getByText('Other content')).toBeInTheDocument();
    });
  });

  describe('visual consistency', () => {
    it('renders consistent structure across instances', () => {
      render(
        <div>
          <EasyModeIndicator />
          <EasyModeIndicator />
        </div>
      );
      
      const indicators = screen.getAllByText('Easy Mode');
      
      indicators.forEach(indicator => {
        const container = indicator.parentElement;
        const svg = container.querySelector('svg');
        
        // Each should have the same structure
        expect(svg).toBeInTheDocument();
        expect(svg.querySelector('path')).toBeInTheDocument();
        expect(svg.querySelectorAll('line')).toHaveLength(2);
      });
    });

    it('maintains proper SVG attributes', () => {
      render(<EasyModeIndicator />);
      const container = screen.getByText('Easy Mode').parentElement;
      const svg = container.querySelector('svg');
      
      // Check essential SVG attributes
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('fill', 'none');
    });
  });
});