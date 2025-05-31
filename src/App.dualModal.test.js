import React from 'react';

// Mock all the routes to simplify testing
jest.mock('./routes', () => ({
  TutorialRoute: () => <div data-testid="tutorial-route">Tutorial Route</div>,
  HomeRoute: () => <div data-testid="home-route">Home Route</div>,
  ReferenceConfirmationRoute: () => <div data-testid="reference-confirmation-route">Reference Confirmation Route</div>,
  ReferenceTypingRoute: () => <div data-testid="reference-typing-route">Reference Typing Route</div>,
  DeckStudyRoute: () => <div data-testid="deck-study-route">Deck Study Route</div>,
  BestTimesRoute: () => <div data-testid="best-times-route">Best Times Route</div>,
  CompletionRoute: () => <div data-testid="completion-route">Single Card Completion Route</div>,
  DeckCompletionRoute: () => <div data-testid="deck-completion-route">Deck Completion Route</div>
}));

// Mock layout
jest.mock('./layout/AppLayout', () => ({ children }) => <div data-testid="app-layout">{children}</div>);

// Mock framer motion
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => <div data-testid="animate-presence">{children}</div>
}));

// Mock the contexts
const mockUseAppState = jest.fn();
const mockUseTyping = jest.fn();
const mockUseStatistics = jest.fn();
const mockUseUserPreferences = jest.fn();

jest.mock('./contexts/AppStateContext', () => ({
  AppStateProvider: ({ children }) => children,
  useAppState: () => mockUseAppState()
}));

jest.mock('./features/typing/useTyping', () => mockUseTyping);
jest.mock('./features/statistics/useStatistics', () => mockUseStatistics);
jest.mock('./contexts/UserPreferencesContext', () => ({
  UserPreferencesProvider: ({ children }) => children,
  useUserPreferences: () => mockUseUserPreferences()
}));

const { render, screen } = require('@testing-library/react');
const App = require('./App').default;

describe('Dual Modal Bug Fix', () => {
  beforeEach(() => {
    // Default mock implementations
    mockUseTyping.mockReturnValue({
      userInput: '',
      selectedReference: '',
      isComplete: false,
      completionTime: 0,
      inputError: false,
      handleInputChange: jest.fn(),
      handleSelectReference: jest.fn(),
      handleBeginTyping: jest.fn(),
      handleRetryTyping: jest.fn(),
      handleReturnToMenu: jest.fn(),
      handleStartDeckStudy: jest.fn(),
      loadNextStudyCard: jest.fn(),
      beginNextCard: jest.fn(),
      onReferenceExposed: jest.fn()
    });

    mockUseStatistics.mockReturnValue({
      handleViewBestTimes: jest.fn()
    });

    mockUseUserPreferences.mockReturnValue({
      easyMode: false,
      toggleEasyMode: jest.fn(),
      ghostTextEnabled: true,
      toggleGhostText: jest.fn(),
      showReferenceEnabled: false,
      toggleShowReference: jest.fn()
    });
  });

  test('should only show deck completion modal when deck study is complete', () => {
    // Mock app state to simulate deck study completion
    mockUseAppState.mockReturnValue({
      step: 1,
      cards: [],
      decks: [{ id: 'test-deck', title: 'Test Deck' }],
      editingCard: null,
      currentDeckId: null,
      editingDeck: null,
      isComplete: true, // Card was completed
      isDeckStudyMode: false, // Deck study mode was exited
      deckStudyComplete: true, // Deck study was completed
      studyDeckId: 'test-deck',
      deckCompletionTimes: [1000, 2000, 1500],
      createCard: jest.fn(),
      updateCard: jest.fn(),
      deleteCard: jest.fn(),
      editCard: jest.fn(),
      cancelEdit: jest.fn(),
      setCurrentDeckId: jest.fn(),
      createDeck: jest.fn(),
      updateDeck: jest.fn(),
      deleteDeck: jest.fn(),
      editDeck: jest.fn(),
      cancelEditDeck: jest.fn(),
      completeTutorial: jest.fn(),
      exitDeckStudy: jest.fn()
    });

    render(<App />);

    // Should show deck completion modal
    expect(screen.getByTestId('deck-completion-route')).toBeInTheDocument();
    
    // Should NOT show single card completion modal
    expect(screen.queryByTestId('completion-route')).not.toBeInTheDocument();
  });

  test('should only show single card completion modal when single card is complete', () => {
    // Mock app state to simulate single card completion
    mockUseAppState.mockReturnValue({
      step: 1,
      cards: [],
      decks: [],
      editingCard: null,
      currentDeckId: null,
      editingDeck: null,
      isComplete: true, // Card was completed
      isDeckStudyMode: false, // Not in deck study mode
      deckStudyComplete: false, // Deck study was NOT completed
      studyDeckId: null,
      deckCompletionTimes: [],
      createCard: jest.fn(),
      updateCard: jest.fn(),
      deleteCard: jest.fn(),
      editCard: jest.fn(),
      cancelEdit: jest.fn(),
      setCurrentDeckId: jest.fn(),
      createDeck: jest.fn(),
      updateDeck: jest.fn(),
      deleteDeck: jest.fn(),
      editDeck: jest.fn(),
      cancelEditDeck: jest.fn(),
      completeTutorial: jest.fn(),
      exitDeckStudy: jest.fn()
    });

    render(<App />);

    // Should show single card completion modal
    expect(screen.getByTestId('completion-route')).toBeInTheDocument();
    
    // Should NOT show deck completion modal
    expect(screen.queryByTestId('deck-completion-route')).not.toBeInTheDocument();
  });

  test('should not show any completion modal when neither is complete', () => {
    // Mock app state to simulate no completion
    mockUseAppState.mockReturnValue({
      step: 1,
      cards: [],
      decks: [],
      editingCard: null,
      currentDeckId: null,
      editingDeck: null,
      isComplete: false, // Card was NOT completed
      isDeckStudyMode: false, // Not in deck study mode
      deckStudyComplete: false, // Deck study was NOT completed
      studyDeckId: null,
      deckCompletionTimes: [],
      createCard: jest.fn(),
      updateCard: jest.fn(),
      deleteCard: jest.fn(),
      editCard: jest.fn(),
      cancelEdit: jest.fn(),
      setCurrentDeckId: jest.fn(),
      createDeck: jest.fn(),
      updateDeck: jest.fn(),
      deleteDeck: jest.fn(),
      editDeck: jest.fn(),
      cancelEditDeck: jest.fn(),
      completeTutorial: jest.fn(),
      exitDeckStudy: jest.fn()
    });

    render(<App />);

    // Should NOT show any completion modal
    expect(screen.queryByTestId('completion-route')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deck-completion-route')).not.toBeInTheDocument();
  });
});