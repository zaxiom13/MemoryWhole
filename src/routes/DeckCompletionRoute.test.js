import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeckCompletionRoute from './DeckCompletionRoute';

// Mock the DeckCompletionPage component
jest.mock('../features/completion', () => ({
  DeckCompletionPage: (props) => (
    <div data-testid="deck-completion-page">
      <div data-testid="completion-times">{JSON.stringify(props.completionTimes)}</div>
      <div data-testid="deck-title">{props.deckTitle}</div>
      <div data-testid="card-count">{props.cardCount}</div>
      <button data-testid="return-button" onClick={props.onReturnToMenu}>Return to Menu</button>
    </div>
  )
}));

describe('DeckCompletionRoute', () => {
  const defaultProps = {
    completionTimes: [120, 150, 90],
    deckTitle: 'Test Deck',
    cardCount: 5,
    onReturnToMenu: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the DeckCompletionPage component', () => {
      render(<DeckCompletionRoute {...defaultProps} />);
      
      expect(screen.getByTestId('deck-completion-page')).toBeInTheDocument();
    });

    it('passes all props correctly', () => {
      render(<DeckCompletionRoute {...defaultProps} />);
      
      expect(screen.getByTestId('completion-times')).toHaveTextContent('[120,150,90]');
      expect(screen.getByTestId('deck-title')).toHaveTextContent('Test Deck');
      expect(screen.getByTestId('card-count')).toHaveTextContent('5');
      expect(screen.getByTestId('return-button')).toBeInTheDocument();
    });

    it('renders with different completion times', () => {
      const customTimes = [60, 75, 80];
      render(<DeckCompletionRoute {...defaultProps} completionTimes={customTimes} />);
      
      expect(screen.getByTestId('completion-times')).toHaveTextContent('[60,75,80]');
    });

    it('renders with different deck title', () => {
      render(<DeckCompletionRoute {...defaultProps} deckTitle="Another Deck" />);
      
      expect(screen.getByTestId('deck-title')).toHaveTextContent('Another Deck');
    });

    it('renders with different card count', () => {
      render(<DeckCompletionRoute {...defaultProps} cardCount={10} />);
      
      expect(screen.getByTestId('card-count')).toHaveTextContent('10');
    });
  });

  describe('prop handling', () => {
    it('handles undefined completionTimes', () => {
      render(<DeckCompletionRoute {...defaultProps} completionTimes={undefined} />);
      
      expect(screen.getByTestId('deck-completion-page')).toBeInTheDocument();
    });

    it('handles null deckTitle', () => {
      render(<DeckCompletionRoute {...defaultProps} deckTitle={null} />);
      
      expect(screen.getByTestId('deck-completion-page')).toBeInTheDocument();
    });

    it('handles zero cardCount', () => {
      render(<DeckCompletionRoute {...defaultProps} cardCount={0} />);
      
      expect(screen.getByTestId('card-count')).toHaveTextContent('0');
    });

    it('handles missing onReturnToMenu callback', () => {
      render(<DeckCompletionRoute {...defaultProps} onReturnToMenu={undefined} />);
      
      expect(screen.getByTestId('deck-completion-page')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty completion times array', () => {
      render(<DeckCompletionRoute {...defaultProps} completionTimes={[]} />);
      
      expect(screen.getByTestId('completion-times')).toHaveTextContent('[]');
    });

    it('handles single completion time', () => {
      render(<DeckCompletionRoute {...defaultProps} completionTimes={[100]} />);
      
      expect(screen.getByTestId('completion-times')).toHaveTextContent('[100]');
    });

    it('handles very large completion times', () => {
      const largeTimes = [999999, 888888];
      render(<DeckCompletionRoute {...defaultProps} completionTimes={largeTimes} />);
      
      expect(screen.getByTestId('completion-times')).toHaveTextContent('[999999,888888]');
    });

    it('handles negative completion times', () => {
      const negativeTimes = [-10, -20];
      render(<DeckCompletionRoute {...defaultProps} completionTimes={negativeTimes} />);
      
      expect(screen.getByTestId('completion-times')).toHaveTextContent('[-10,-20]');
    });

    it('handles empty deck title', () => {
      render(<DeckCompletionRoute {...defaultProps} deckTitle="" />);
      
      expect(screen.getByTestId('deck-title')).toHaveTextContent('');
    });

    it('handles long deck title', () => {
      const longTitle = 'A'.repeat(100);
      render(<DeckCompletionRoute {...defaultProps} deckTitle={longTitle} />);
      
      expect(screen.getByTestId('deck-title')).toHaveTextContent(longTitle);
    });

    it('handles special characters in deck title', () => {
      const specialTitle = 'Test Deck!@#$%^&*()';
      render(<DeckCompletionRoute {...defaultProps} deckTitle={specialTitle} />);
      
      expect(screen.getByTestId('deck-title')).toHaveTextContent(specialTitle);
    });

    it('handles Unicode characters in deck title', () => {
      const unicodeTitle = 'Test 你好 🌍 Deck';
      render(<DeckCompletionRoute {...defaultProps} deckTitle={unicodeTitle} />);
      
      expect(screen.getByTestId('deck-title')).toHaveTextContent(unicodeTitle);
    });

    it('handles negative card count', () => {
      render(<DeckCompletionRoute {...defaultProps} cardCount={-5} />);
      
      expect(screen.getByTestId('card-count')).toHaveTextContent('-5');
    });

    it('handles very large card count', () => {
      render(<DeckCompletionRoute {...defaultProps} cardCount={999999} />);
      
      expect(screen.getByTestId('card-count')).toHaveTextContent('999999');
    });

    it('handles non-numeric card count', () => {
      render(<DeckCompletionRoute {...defaultProps} cardCount="not a number" />);
      
      expect(screen.getByTestId('card-count')).toHaveTextContent('not a number');
    });
  });

  describe('callback forwarding', () => {
    it('forwards onReturnToMenu callback', () => {
      const mockCallback = jest.fn();
      render(<DeckCompletionRoute {...defaultProps} onReturnToMenu={mockCallback} />);
      
      expect(screen.getByTestId('return-button')).toBeInTheDocument();
    });

    it('handles different callback functions', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      const { rerender } = render(<DeckCompletionRoute {...defaultProps} onReturnToMenu={callback1} />);
      
      expect(screen.getByTestId('return-button')).toBeInTheDocument();
      
      rerender(<DeckCompletionRoute {...defaultProps} onReturnToMenu={callback2} />);
      
      expect(screen.getByTestId('return-button')).toBeInTheDocument();
    });
  });

  describe('integration', () => {
    it('works within complex component hierarchies', () => {
      render(
        <div>
          <header>Header</header>
          <main>
            <DeckCompletionRoute {...defaultProps} />
          </main>
          <footer>Footer</footer>
        </div>
      );
      
      expect(screen.getByTestId('deck-completion-page')).toBeInTheDocument();
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('can be rendered multiple times with different props', () => {
      render(
        <div>
          <DeckCompletionRoute {...defaultProps} deckTitle="Deck 1" />
          <DeckCompletionRoute {...defaultProps} deckTitle="Deck 2" />
        </div>
      );
      
      const pages = screen.getAllByTestId('deck-completion-page');
      expect(pages).toHaveLength(2);
      expect(screen.getByText('Deck 1')).toBeInTheDocument();
      expect(screen.getByText('Deck 2')).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('handles prop changes efficiently', () => {
      const { rerender } = render(<DeckCompletionRoute {...defaultProps} />);
      
      for (let i = 0; i < 10; i++) {
        rerender(<DeckCompletionRoute {...defaultProps} cardCount={i} />);
      }
      
      expect(screen.getByTestId('deck-completion-page')).toBeInTheDocument();
      expect(screen.getByTestId('card-count')).toHaveTextContent('9');
    });

    it('maintains component structure across re-renders', () => {
      const { rerender } = render(<DeckCompletionRoute {...defaultProps} />);
      
      expect(screen.getByTestId('deck-completion-page')).toBeInTheDocument();
      
      rerender(<DeckCompletionRoute {...defaultProps} deckTitle="New Title" />);
      
      expect(screen.getByTestId('deck-completion-page')).toBeInTheDocument();
      expect(screen.getByTestId('deck-title')).toHaveTextContent('New Title');
    });
  });

  describe('data types and structures', () => {
    it('handles complex completion times arrays', () => {
      const complexTimes = [
        120.5, 
        90.25, 
        0, 
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER
      ];
      render(<DeckCompletionRoute {...defaultProps} completionTimes={complexTimes} />);
      
      expect(screen.getByTestId('completion-times')).toHaveTextContent(JSON.stringify(complexTimes));
    });

    it('handles mixed data types in completion times', () => {
      const mixedTimes = [120, '150', null, undefined];
      render(<DeckCompletionRoute {...defaultProps} completionTimes={mixedTimes} />);
      
      expect(screen.getByTestId('completion-times')).toHaveTextContent('[120,"150",null,null]');
    });
  });
});