import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock all the routes to simplify testing
jest.mock('./routes', () => ({
  TutorialRoute: () => <div data-testid="tutorial-route">Tutorial Route</div>,
  HomeRoute: () => <div data-testid="home-route">Home Route</div>,
  ReferenceConfirmationRoute: () => <div data-testid="reference-confirmation-route">Reference Confirmation Route</div>,
  ReferenceTypingRoute: () => <div data-testid="reference-typing-route">Reference Typing Route (with Back Button)</div>,
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

jest.mock('./features/typing/useTyping', () => () => mockUseTyping());
jest.mock('./features/statistics/useStatistics', () => () => mockUseStatistics());
jest.mock('./contexts/UserPreferencesContext', () => ({
  UserPreferencesProvider: ({ children }) => children,
  useUserPreferences: () => mockUseUserPreferences()
}));

describe('Back Button Visibility on Completion Page', () => {
  beforeEach(() => {
    // Default mock implementations
    mockUseTyping.mockReturnValue({
      userInput: '',
      selectedReference: 'Test reference text',
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

  test('should only show CompletionRoute when typing is complete (back button hidden)', () => {
    // Mock app state to simulate completion of typing
    mockUseAppState.mockReturnValue({
      step: 3, // User is on typing step
      cards: [],
      decks: [],
      editingCard: null,
      currentDeckId: null,
      editingDeck: null,
      isComplete: true, // Typing was completed
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

    // FIXED: Only completion route should be rendered when typing is complete
    // The ReferenceTypingRoute (with back button) should be hidden
    expect(screen.queryByTestId('reference-typing-route')).not.toBeInTheDocument();
    expect(screen.getByTestId('completion-route')).toBeInTheDocument();
  });

  test('should only show ReferenceTypingRoute when typing is not complete', () => {
    // Mock app state to simulate typing in progress
    mockUseAppState.mockReturnValue({
      step: 3, // User is on typing step
      cards: [],
      decks: [],
      editingCard: null,
      currentDeckId: null,
      editingDeck: null,
      isComplete: false, // Typing is NOT completed
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

    // Should show typing route (with back button)
    expect(screen.getByTestId('reference-typing-route')).toBeInTheDocument();
    
    // Should NOT show completion route
    expect(screen.queryByTestId('completion-route')).not.toBeInTheDocument();
  });

  test('should show DeckStudyRoute and hide CompletionRoute during deck study when complete', () => {
    // Mock app state to simulate deck study completion
    mockUseAppState.mockReturnValue({
      step: 3, // User is on typing step
      cards: [],
      decks: [],
      editingCard: null,
      currentDeckId: null,
      editingDeck: null,
      isComplete: true, // Typing was completed
      isDeckStudyMode: true, // In deck study mode
      deckStudyComplete: false, // Deck study is ongoing
      studyDeckId: 'test-deck',
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

    // Should show deck study route (has its own back button handling)
    expect(screen.getByTestId('deck-study-route')).toBeInTheDocument();
    
    // Should NOT show regular completion route
    expect(screen.queryByTestId('completion-route')).not.toBeInTheDocument();
    
    // Should NOT show reference typing route
    expect(screen.queryByTestId('reference-typing-route')).not.toBeInTheDocument();
  });
});