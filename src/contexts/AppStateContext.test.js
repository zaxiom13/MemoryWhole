import React from 'react';
import { render, act } from '@testing-library/react';
import { AppStateProvider, useAppState } from './AppStateContext';

// Mock the hooks and utils
jest.mock('../hooks/useCardCollection', () => jest.fn());
jest.mock('../hooks/useDeckCollection', () => jest.fn());
jest.mock('../utils/memoryUtils', () => ({
  loadPreference: jest.fn().mockReturnValue(true),
  savePreference: jest.fn()
}));

// Test component to access the context
function TestComponent({ onContextReady }) {
  const context = useAppState();
  React.useEffect(() => {
    onContextReady(context);
  }, [context, onContextReady]);
  return null;
}

describe('AppStateContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('enhancedCardOperations updates deck when creating a card', () => {
    // Mock card collection functions
    const createCardMock = jest.fn().mockReturnValue({ id: 123, deckId: 456 });
    const mockCardCollection = {
      createCard: createCardMock,
      cards: []
    };

    // Mock deck collection functions
    const addCardToDeckMock = jest.fn();
    const mockDeckCollection = {
      addCardToDeck: addCardToDeckMock
    };

    // Setup our mocks
    require('../hooks/useCardCollection').mockReturnValue(mockCardCollection);
    require('../hooks/useDeckCollection').mockReturnValue(mockDeckCollection);

    // Render the provider with our test component
    const contextReady = jest.fn();
    render(
      <AppStateProvider>
        <TestComponent onContextReady={contextReady} />
      </AppStateProvider>
    );

    // Access the enhanced createCard function
    const { createCard } = contextReady.mock.calls[0][0];

    // Call createCard and verify both collection functions are called
    act(() => {
      createCard({ deckId: 456, title: 'Test Card' });
    });

    expect(createCardMock).toHaveBeenCalledWith({ deckId: 456, title: 'Test Card' });
    expect(addCardToDeckMock).toHaveBeenCalledWith(456, 123);
  });

  test('enhancedCardOperations updates deck when deleting a card', () => {
    // Mock card to be deleted
    const mockCard = { id: 123, deckId: 456 };
    
    // Mock card collection functions
    const deleteCardMock = jest.fn().mockReturnValue(true);
    const mockCardCollection = {
      deleteCard: deleteCardMock,
      cards: [mockCard]
    };

    // Mock deck collection functions
    const removeCardFromDeckMock = jest.fn();
    const mockDeckCollection = {
      removeCardFromDeck: removeCardFromDeckMock
    };

    // Setup our mocks
    require('../hooks/useCardCollection').mockReturnValue(mockCardCollection);
    require('../hooks/useDeckCollection').mockReturnValue(mockDeckCollection);

    // Render the provider with our test component
    const contextReady = jest.fn();
    render(
      <AppStateProvider>
        <TestComponent onContextReady={contextReady} />
      </AppStateProvider>
    );

    // Access the enhanced deleteCard function
    const { deleteCard } = contextReady.mock.calls[0][0];

    // Call deleteCard and verify both collection functions are called
    act(() => {
      deleteCard(123);
    });

    expect(deleteCardMock).toHaveBeenCalledWith(123);
    expect(removeCardFromDeckMock).toHaveBeenCalledWith(456, 123);
  });
});