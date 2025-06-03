import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeckStudyPreview from './components/DeckStudyPreview';
import { useAppState } from '../../contexts/AppStateContext';

jest.mock('../../contexts/AppStateContext', () => ({
  useAppState: jest.fn()
}));

describe('DeckStudyPreview', () => {
  beforeEach(() => {
    useAppState.mockReturnValue({
      studyDeckId: 'd1',
      studyCardIds: ['c1', 'c2'],
      decks: [
        { id: 'd1', title: 'Test Deck', description: 'Deck description' }
      ],
      cards: [
        { id: 'c1', text: 'First card text sample' },
        { id: 'c2', text: 'Second card text sample' }
      ]
    });
  });

  it('renders deck data and notice text', () => {
    render(<DeckStudyPreview onBegin={() => {}} />);

    expect(screen.getByText('Test Deck')).toBeInTheDocument();
    expect(screen.getByText('Deck description')).toBeInTheDocument();
    expect(screen.getByText('2 cards')).toBeInTheDocument();
    expect(screen.getByText(/Easy Mode, Ghost Text/i)).toBeInTheDocument();
  });
});
