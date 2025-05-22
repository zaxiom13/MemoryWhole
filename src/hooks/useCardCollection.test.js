import { renderHook, act } from '@testing-library/react-hooks';
import useCardCollection from './useCardCollection';
import CardCollection from '../models/CardCollection';
import { loadCardsFromStorage, saveCardsToStorage } from '../utils/memoryUtils';

// Mock dependencies
jest.mock('../models/CardCollection');
jest.mock('../utils/memoryUtils', () => ({
  loadCardsFromStorage: jest.fn(),
  saveCardsToStorage: jest.fn()
}));

describe('useCardCollection', () => {
  // Sample data for tests
  const mockCards = [
    { id: 1, title: 'Card 1', text: 'Text 1', deckId: 1 },
    { id: 2, title: 'Card 2', text: 'Text 2', deckId: 2 },
    { id: 3, title: 'Card 3', text: 'Text 3', deckId: 1 }
  ];

  const mockCardCollection = {
    getAll: jest.fn(() => [...mockCards]),
    addCard: jest.fn(data => ({ id: 4, ...data })),
    updateCard: jest.fn((id, updates) => ({ id, ...updates })),
    removeCard: jest.fn(() => true),
    toArray: jest.fn(() => mockCards)
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup CardCollection mock
    CardCollection.mockImplementation(() => mockCardCollection);
    
    // Mock fromArray to return a new CardCollection instance
    CardCollection.fromArray = jest.fn(() => mockCardCollection);
    
    // Default implementation for loadCardsFromStorage
    loadCardsFromStorage.mockReturnValue(mockCards);
  });

  test('should initialize with cards from storage', () => {
    // Render the hook
    const { result } = renderHook(() => useCardCollection());
    
    // Verify it loaded cards from storage
    expect(loadCardsFromStorage).toHaveBeenCalled();
    expect(CardCollection.fromArray).toHaveBeenCalledWith(mockCards);
    
    // Verify the initial state
    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.editingCard).toBeNull();
  });

  test('should filter cards by current deck ID', () => {
    // Create a filtered set of cards
    const filteredCards = mockCards.filter(card => card.deckId === 1);
    mockCardCollection.getAll.mockReturnValue(mockCards);
    
    // Render the hook
    const { result } = renderHook(() => useCardCollection());
    
    // Mock the card filtering behavior
    const originalGetAll = mockCardCollection.getAll;
    mockCardCollection.getAll = jest.fn(() => mockCards);
    
    // Set current deck ID to filter by deckId 1
    act(() => {
      result.current.setCurrentDeckId(1);
    });
    
    // Restore the original getAll function
    mockCardCollection.getAll = originalGetAll;
  });

  test('should set a card for editing', () => {
    // Render the hook
    const { result } = renderHook(() => useCardCollection());
    
    // Set a card for editing
    const cardToEdit = { id: 2, title: 'Card to edit' };
    
    act(() => {
      result.current.editCard(cardToEdit);
    });
    
    // Verify the card is set for editing
    expect(result.current.editingCard).toEqual(cardToEdit);
  });

  test('should cancel editing', () => {
    // Render the hook with a card being edited
    const { result } = renderHook(() => useCardCollection());
    
    // First set a card for editing
    act(() => {
      result.current.editCard({ id: 2, title: 'Card to edit' });
    });
    
    // Then cancel editing
    act(() => {
      result.current.cancelEdit();
    });
    
    // Verify editing is canceled
    expect(result.current.editingCard).toBeNull();
  });
});