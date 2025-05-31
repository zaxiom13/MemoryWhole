// useDeckCollection.js - Custom hook for managing deck collection
import { useState, useEffect } from 'react';
import DeckCollection from '../models/DeckCollection';
import { loadDecksFromStorage, saveDecksToStorage } from '../utils/memoryUtils';

/**
 * Default decks data
 */
const defaultDecks = [
  { 
    id: 1, 
    title: 'Famous Quotations', 
    description: 'A collection of profound and memorable quotes from throughout history.',
    cardIds: [1, 2, 3, 7],
    createdAt: new Date('2023-01-01').getTime()
  },
  { 
    id: 2, 
    title: 'Scientific Concepts', 
    description: 'Key scientific principles and theories explained in accessible language.',
    cardIds: [4, 5, 8],
    createdAt: new Date('2023-02-01').getTime()
  },
  { 
    id: 3, 
    title: 'Memory Techniques', 
    description: 'Methods and approaches to improve memory retention and recall.',
    cardIds: [6, 9],
    createdAt: new Date('2023-03-01').getTime()
  },
  { 
    id: 4, 
    title: 'Super Easy', 
    description: 'Simple one to three word cards for quick testing and practice.',
    cardIds: [10, 11, 12, 13],
    createdAt: new Date('2023-04-01').getTime()
  }
];

/**
 * Custom hook for managing deck collection
 * @returns {Object} Deck collection state and operations
 */
function useDeckCollection() {
  const [collection, setCollection] = useState(null);
  const [sortedDecks, setSortedDecks] = useState([]);
  const [editingDeck, setEditingDeck] = useState(null);

  // Load collection on mount
  useEffect(() => {
    const rawDecks = loadDecksFromStorage(defaultDecks);
    const deckCollection = DeckCollection.fromArray(rawDecks);
    setCollection(deckCollection);
  }, []);

  // Update sorted decks when collection changes
  useEffect(() => {
    if (collection) {
      const sorted = collection.sortByDate(false);
      setSortedDecks(sorted);
    }
  }, [collection]);

  // Save collection when it changes
  useEffect(() => {
    if (collection) {
      saveDecksToStorage(collection.toArray());
    }
  }, [collection]);

  // Create a new deck
  const handleCreateDeck = (deckData) => {
    if (!collection) return null;
    
    const newDeck = collection.addDeck(deckData);
    setCollection(new DeckCollection([...collection.getAll()]));
    setEditingDeck(null);
    return newDeck;
  };

  // Update an existing deck
  const handleUpdateDeck = (deckData) => {
    if (!collection) return null;
    
    const updatedDeck = collection.updateDeck(deckData.id, deckData);
    if (updatedDeck) {
      setCollection(new DeckCollection([...collection.getAll()]));
      setEditingDeck(null);
    }
    return updatedDeck;
  };

  // Delete a deck
  const handleDeleteDeck = (deckId) => {
    if (!collection) return false;
    
    const success = collection.removeDeck(deckId);
    if (success) {
      setCollection(new DeckCollection([...collection.getAll()]));
    }
    return success;
  };

  // Add a card to a deck
  const handleAddCardToDeck = (deckId, cardId) => {
    if (!collection) return null;
    
    const updatedDeck = collection.addCardToDeck(deckId, cardId);
    if (updatedDeck) {
      setCollection(new DeckCollection([...collection.getAll()]));
    }
    return updatedDeck;
  };

  // Remove a card from a deck
  const handleRemoveCardFromDeck = (deckId, cardId) => {
    if (!collection) return null;
    
    const updatedDeck = collection.removeCardFromDeck(deckId, cardId);
    if (updatedDeck) {
      setCollection(new DeckCollection([...collection.getAll()]));
    }
    return updatedDeck;
  };

  // Set a deck for editing
  const handleEditDeck = (deck) => {
    setEditingDeck(deck);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingDeck(null);
  };

  return {
    decks: sortedDecks,
    editingDeck,
    createDeck: handleCreateDeck,
    updateDeck: handleUpdateDeck,
    deleteDeck: handleDeleteDeck,
    addCardToDeck: handleAddCardToDeck,
    removeCardFromDeck: handleRemoveCardFromDeck,
    editDeck: handleEditDeck,
    cancelEdit: handleCancelEdit
  };
}

export default useDeckCollection;