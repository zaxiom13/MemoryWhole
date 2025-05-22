import CardCollection from './CardCollection';
import Card from './Card';

// Mock Card
jest.mock('./Card');

describe('CardCollection', () => {
  beforeEach(() => {
    Card.mockClear();
  });

  test('constructor creates an empty collection by default', () => {
    const collection = new CardCollection();
    expect(collection.cards).toEqual([]);
  });

  test('constructor creates a collection with provided cards', () => {
    const mockCards = [
      { id: 1, title: 'Card 1' },
      { id: 2, title: 'Card 2' }
    ];
    const collection = new CardCollection(mockCards);
    expect(collection.cards).toHaveLength(2);
    expect(collection.cards[0]).toEqual(mockCards[0]);
    expect(collection.cards[1]).toEqual(mockCards[1]);
  });

  test('getAll returns all cards in the collection', () => {
    const mockCards = [
      { id: 1, title: 'Card 1' },
      { id: 2, title: 'Card 2' }
    ];
    const collection = new CardCollection(mockCards);
    
    const allCards = collection.getAll();
    expect(allCards).toHaveLength(2);
    expect(allCards).toEqual(mockCards);
    expect(allCards).not.toBe(collection.cards); // Should be a copy, not reference
  });

  test('getById returns the card with matching ID', () => {
    const mockCards = [
      { id: 1, title: 'Card 1' },
      { id: 2, title: 'Card 2' }
    ];
    const collection = new CardCollection(mockCards);
    
    const card = collection.getById(2);
    expect(card).toBe(mockCards[1]);
  });

  test('getById returns undefined if ID not found', () => {
    const collection = new CardCollection([{ id: 1, title: 'Card 1' }]);
    
    const card = collection.getById(999);
    expect(card).toBeUndefined();
  });

  test('addCard adds a new card with incremented ID', () => {
    Card.mockImplementation((data) => ({
      ...data
    }));
    
    const collection = new CardCollection();
    
    const newCard = collection.addCard({ title: 'New Card', text: 'New text' });
    
    expect(Card).toHaveBeenCalledWith({
      id: 1, // First ID is 1
      createdAt: expect.any(Number),
      title: 'New Card',
      text: 'New text'
    });
    
    expect(collection.cards).toHaveLength(1);
    expect(collection.cards[0]).toEqual(newCard);
  });

  test('addCard correctly increments IDs with existing cards', () => {
    Card.mockImplementation((data) => ({
      ...data
    }));
    
    const mockCards = [
      { id: 5, title: 'Card 5' },
      { id: 10, title: 'Card 10' }
    ];
    const collection = new CardCollection(mockCards);
    
    const newCard = collection.addCard({ title: 'New Card' });
    
    expect(Card).toHaveBeenCalledWith({
      id: 11, // Max ID + 1
      createdAt: expect.any(Number),
      title: 'New Card'
    });
    
    expect(collection.cards).toHaveLength(3);
    expect(collection.cards[2]).toEqual(newCard);
  });

  test('updateCard updates an existing card', () => {
    const updatedCard = {
      id: 1,
      title: 'New Title',
      updatedAt: Date.now()
    };
    
    const mockCards = [
      { 
        id: 1, 
        title: 'Old Title', 
        text: 'Old text',
        update: jest.fn(() => updatedCard)
      }
    ];
    
    const collection = new CardCollection(mockCards);
    const updates = { title: 'New Title' };
    
    const result = collection.updateCard(1, updates);
    
    expect(mockCards[0].update).toHaveBeenCalledWith(updates);
    expect(result).toBe(updatedCard);
    expect(collection.cards[0]).toBe(updatedCard);
  });

  test('updateCard returns null if card not found', () => {
    const collection = new CardCollection([{ id: 1, title: 'Card 1' }]);
    
    const result = collection.updateCard(999, { title: 'Updated' });
    
    expect(result).toBeNull();
  });

  test('removeCard removes a card by ID', () => {
    const mockCards = [
      { id: 1, title: 'Card 1' },
      { id: 2, title: 'Card 2' },
      { id: 3, title: 'Card 3' }
    ];
    const collection = new CardCollection(mockCards);
    
    const result = collection.removeCard(2);
    
    expect(result).toBe(true);
    expect(collection.cards).toHaveLength(2);
    expect(collection.cards.find(card => card.id === 2)).toBeUndefined();
  });

  test('removeCard returns false if card not found', () => {
    const collection = new CardCollection([{ id: 1, title: 'Card 1' }]);
    
    const result = collection.removeCard(999);
    
    expect(result).toBe(false);
    expect(collection.cards).toHaveLength(1);
  });

  test('sortByDate sorts cards by date in descending order by default', () => {
    const time1 = 1000;
    const time2 = 2000;
    const time3 = 3000;
    
    const mockCards = [
      { id: 1, title: 'Old', createdAt: time1 },
      { id: 2, title: 'New', createdAt: time3 },
      { id: 3, title: 'Middle', createdAt: time2 }
    ];
    
    const collection = new CardCollection(mockCards);
    const sorted = collection.sortByDate();
    
    expect(sorted[0].id).toBe(2); // newest
    expect(sorted[1].id).toBe(3); // middle
    expect(sorted[2].id).toBe(1); // oldest
  });

  test('sortByDate sorts cards in ascending order when specified', () => {
    const time1 = 1000;
    const time2 = 2000;
    const time3 = 3000;
    
    const mockCards = [
      { id: 1, title: 'Old', createdAt: time1 },
      { id: 2, title: 'New', createdAt: time3 },
      { id: 3, title: 'Middle', createdAt: time2 }
    ];
    
    const collection = new CardCollection(mockCards);
    const sorted = collection.sortByDate(true); // ascending
    
    expect(sorted[0].id).toBe(1); // oldest
    expect(sorted[1].id).toBe(3); // middle
    expect(sorted[2].id).toBe(2); // newest
  });

  test('toArray converts collection to array of plain objects', () => {
    const mockCards = [
      { 
        id: 1, 
        title: 'Card 1',
        toObject: jest.fn(() => ({ id: 1, title: 'Card 1' }))
      },
      { 
        id: 2, 
        title: 'Card 2',
        toObject: jest.fn(() => ({ id: 2, title: 'Card 2' }))
      }
    ];
    
    const collection = new CardCollection(mockCards);
    const result = collection.toArray();
    
    expect(mockCards[0].toObject).toHaveBeenCalled();
    expect(mockCards[1].toObject).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 1, title: 'Card 1' },
      { id: 2, title: 'Card 2' }
    ]);
  });
});