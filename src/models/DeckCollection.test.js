import DeckCollection from './DeckCollection';
import Deck from './Deck';

// Mock Deck
jest.mock('./Deck');

describe('DeckCollection', () => {
  beforeEach(() => {
    Deck.mockClear();
  });

  test('constructor creates an empty collection by default', () => {
    const collection = new DeckCollection();
    expect(collection.decks).toEqual([]);
  });

  test('constructor creates a collection with provided decks', () => {
    const mockDecks = [
      { id: 1, title: 'Deck 1' },
      { id: 2, title: 'Deck 2' }
    ];
    const collection = new DeckCollection(mockDecks);
    expect(collection.decks).toHaveLength(2);
    expect(collection.decks[0]).toEqual(mockDecks[0]);
    expect(collection.decks[1]).toEqual(mockDecks[1]);
  });

  test('getAll returns all decks in the collection', () => {
    const mockDecks = [
      { id: 1, title: 'Deck 1' },
      { id: 2, title: 'Deck 2' }
    ];
    const collection = new DeckCollection(mockDecks);
    
    const allDecks = collection.getAll();
    expect(allDecks).toHaveLength(2);
    expect(allDecks).toEqual(mockDecks);
    expect(allDecks).not.toBe(collection.decks); // Should be a copy, not reference
  });

  test('getById returns the deck with matching ID', () => {
    const mockDecks = [
      { id: 1, title: 'Deck 1' },
      { id: 2, title: 'Deck 2' }
    ];
    const collection = new DeckCollection(mockDecks);
    
    const deck = collection.getById(2);
    expect(deck).toBe(mockDecks[1]);
  });

  test('getById returns undefined if ID not found', () => {
    const collection = new DeckCollection([{ id: 1, title: 'Deck 1' }]);
    
    const deck = collection.getById(999);
    expect(deck).toBeUndefined();
  });

  test('addDeck adds a new deck with incremented ID', () => {
    Deck.mockImplementation((data) => ({
      ...data
    }));
    
    const collection = new DeckCollection();
    
    const newDeck = collection.addDeck({ title: 'New Deck', description: 'New description' });
    
    expect(Deck).toHaveBeenCalledWith({
      id: 1, // First ID is 1
      createdAt: expect.any(Number),
      title: 'New Deck',
      description: 'New description'
    });
    
    expect(collection.decks).toHaveLength(1);
    expect(collection.decks[0]).toEqual(newDeck);
  });

  test('addDeck correctly increments IDs with existing decks', () => {
    Deck.mockImplementation((data) => ({
      ...data
    }));
    
    const mockDecks = [
      { id: 5, title: 'Deck 5' },
      { id: 10, title: 'Deck 10' }
    ];
    const collection = new DeckCollection(mockDecks);
    
    const newDeck = collection.addDeck({ title: 'New Deck' });
    
    expect(Deck).toHaveBeenCalledWith({
      id: 11, // Max ID + 1
      createdAt: expect.any(Number),
      title: 'New Deck'
    });
    
    expect(collection.decks).toHaveLength(3);
    expect(collection.decks[2]).toEqual(newDeck);
  });

  test('updateDeck updates an existing deck', () => {
    const updatedDeck = {
      id: 1,
      title: 'New Title',
      updatedAt: Date.now()
    };
    
    const mockDecks = [
      { 
        id: 1, 
        title: 'Old Title', 
        description: 'Old description',
        update: jest.fn(() => updatedDeck)
      }
    ];
    
    const collection = new DeckCollection(mockDecks);
    const updates = { title: 'New Title' };
    
    const result = collection.updateDeck(1, updates);
    
    expect(mockDecks[0].update).toHaveBeenCalledWith(updates);
    expect(result).toBe(updatedDeck);
    expect(collection.decks[0]).toBe(updatedDeck);
  });

  test('updateDeck returns null if deck not found', () => {
    const collection = new DeckCollection([{ id: 1, title: 'Deck 1' }]);
    
    const result = collection.updateDeck(999, { title: 'Updated' });
    
    expect(result).toBeNull();
  });

  test('removeDeck removes a deck by ID', () => {
    const mockDecks = [
      { id: 1, title: 'Deck 1' },
      { id: 2, title: 'Deck 2' },
      { id: 3, title: 'Deck 3' }
    ];
    const collection = new DeckCollection(mockDecks);
    
    const result = collection.removeDeck(2);
    
    expect(result).toBe(true);
    expect(collection.decks).toHaveLength(2);
    expect(collection.decks.find(deck => deck.id === 2)).toBeUndefined();
  });

  test('removeDeck returns false if deck not found', () => {
    const collection = new DeckCollection([{ id: 1, title: 'Deck 1' }]);
    
    const result = collection.removeDeck(999);
    
    expect(result).toBe(false);
    expect(collection.decks).toHaveLength(1);
  });

  test('addCardToDeck adds card to deck', () => {
    const updatedDeck = {
      id: 1,
      cardIds: [1, 2, 3, 4],
      updatedAt: Date.now()
    };
    
    const mockDecks = [
      { 
        id: 1, 
        cardIds: [1, 2, 3],
        addCard: jest.fn(() => updatedDeck)
      }
    ];
    
    const collection = new DeckCollection(mockDecks);
    const result = collection.addCardToDeck(1, 4);
    
    expect(mockDecks[0].addCard).toHaveBeenCalledWith(4);
    expect(result).toBe(updatedDeck);
    expect(collection.decks[0]).toBe(updatedDeck);
  });

  test('addCardToDeck returns null if deck not found', () => {
    const collection = new DeckCollection([{ id: 1 }]);
    
    const result = collection.addCardToDeck(999, 1);
    
    expect(result).toBeNull();
  });

  test('removeCardFromDeck removes card from deck', () => {
    const updatedDeck = {
      id: 1,
      cardIds: [1, 3],
      updatedAt: Date.now()
    };
    
    const mockDecks = [
      { 
        id: 1, 
        cardIds: [1, 2, 3],
        removeCard: jest.fn(() => updatedDeck)
      }
    ];
    
    const collection = new DeckCollection(mockDecks);
    const result = collection.removeCardFromDeck(1, 2);
    
    expect(mockDecks[0].removeCard).toHaveBeenCalledWith(2);
    expect(result).toBe(updatedDeck);
    expect(collection.decks[0]).toBe(updatedDeck);
  });

  test('removeCardFromDeck returns null if deck not found', () => {
    const collection = new DeckCollection([{ id: 1 }]);
    
    const result = collection.removeCardFromDeck(999, 1);
    
    expect(result).toBeNull();
  });

  test('sortByDate sorts decks by date in descending order by default', () => {
    const time1 = 1000;
    const time2 = 2000;
    const time3 = 3000;
    
    const mockDecks = [
      { id: 1, title: 'Old', createdAt: time1 },
      { id: 2, title: 'New', createdAt: time3 },
      { id: 3, title: 'Middle', createdAt: time2 }
    ];
    
    const collection = new DeckCollection(mockDecks);
    const sorted = collection.sortByDate();
    
    expect(sorted[0].id).toBe(2); // newest
    expect(sorted[1].id).toBe(3); // middle
    expect(sorted[2].id).toBe(1); // oldest
  });

  test('toArray converts collection to array of plain objects', () => {
    const mockDecks = [
      { 
        id: 1, 
        title: 'Deck 1',
        toObject: jest.fn(() => ({ id: 1, title: 'Deck 1' }))
      },
      { 
        id: 2, 
        title: 'Deck 2',
        toObject: jest.fn(() => ({ id: 2, title: 'Deck 2' }))
      }
    ];
    
    const collection = new DeckCollection(mockDecks);
    const result = collection.toArray();
    
    expect(mockDecks[0].toObject).toHaveBeenCalled();
    expect(mockDecks[1].toObject).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 1, title: 'Deck 1' },
      { id: 2, title: 'Deck 2' }
    ]);
  });
});