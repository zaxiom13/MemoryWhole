import Deck from './Deck';
import { normalizeWhitespace } from '../utils/memoryUtils';

// Mock the memoryUtils
jest.mock('../utils/memoryUtils', () => ({
  normalizeWhitespace: jest.fn(text => {
    if (!text) return '';
    return text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  })
}));

describe('Deck', () => {
  describe('constructor', () => {
    it('creates a deck with default values', () => {
      const deck = new Deck();
      expect(deck.id).toBe(0);
      expect(deck.title).toBe('');
      expect(deck.description).toBe('');
      expect(deck.cardIds).toEqual([]);
      expect(deck.createdAt).toBeTruthy();
      expect(deck.updatedAt).toBeNull();
    });

    it('creates a deck with provided values', () => {
      const timestamp = 1620000000000;
      const deckData = {
        id: 1,
        title: 'Test Deck',
        description: 'This is a test deck',
        cardIds: [1, 2, 3],
        createdAt: timestamp,
        updatedAt: timestamp + 1000
      };
      const deck = new Deck(deckData);
      expect(deck.id).toBe(1);
      expect(deck.title).toBe('Test Deck');
      expect(deck.description).toBe('This is a test deck');
      expect(deck.cardIds).toEqual([1, 2, 3]);
      expect(deck.createdAt).toBe(timestamp);
      expect(deck.updatedAt).toBe(timestamp + 1000);
    });
  });

  describe('update', () => {
    it('returns a new deck with updated properties', () => {
      const originalDeck = new Deck({
        id: 2, 
        title: 'Original', 
        description: 'Original description',
        cardIds: [1, 2]
      });
      
      const updatedDeck = originalDeck.update({ title: 'Updated', description: 'New description' });
      
      // Original should be unchanged
      expect(originalDeck.title).toBe('Original');
      expect(originalDeck.description).toBe('Original description');
      
      // Updated should have new values
      expect(updatedDeck).not.toBe(originalDeck); // Different instance
      expect(updatedDeck.id).toBe(2); // Same ID
      expect(updatedDeck.title).toBe('Updated'); // Updated title
      expect(updatedDeck.description).toBe('New description'); // Updated description
      expect(updatedDeck.cardIds).toEqual([1, 2]); // Unchanged card IDs
      expect(updatedDeck.updatedAt).not.toBeNull(); // Updated timestamp
    });
  });

  describe('addCard', () => {
    it('adds a card ID to the deck', () => {
      const deck = new Deck({ cardIds: [1, 2] });
      const updatedDeck = deck.addCard(3);
      
      // Original deck should be unchanged
      expect(deck.cardIds).toEqual([1, 2]);
      
      // Updated deck should have the new card ID
      expect(updatedDeck.cardIds).toEqual([1, 2, 3]);
      expect(updatedDeck.updatedAt).not.toBeNull();
    });

    it('does not add duplicate card IDs', () => {
      const deck = new Deck({ cardIds: [1, 2, 3] });
      const updatedDeck = deck.addCard(2); // Already exists
      
      // Should return the same deck without changes
      expect(updatedDeck.cardIds).toEqual([1, 2, 3]);
      expect(updatedDeck).toBe(deck); // Same instance, no change made
    });
  });

  describe('removeCard', () => {
    it('removes a card ID from the deck', () => {
      const deck = new Deck({ cardIds: [1, 2, 3, 4] });
      const updatedDeck = deck.removeCard(3);
      
      // Original deck should be unchanged
      expect(deck.cardIds).toEqual([1, 2, 3, 4]);
      
      // Updated deck should not have the removed card ID
      expect(updatedDeck.cardIds).toEqual([1, 2, 4]);
      expect(updatedDeck.updatedAt).not.toBeNull();
    });

    it('handles removing non-existent card IDs', () => {
      const deck = new Deck({ cardIds: [1, 2, 3] });
      const updatedDeck = deck.removeCard(5); // Doesn't exist
      
      // Should return a new deck with the same card IDs
      expect(updatedDeck.cardIds).toEqual([1, 2, 3]);
      expect(updatedDeck).not.toBe(deck); // Different instance
      expect(updatedDeck.updatedAt).not.toBeNull(); // Still updates timestamp
    });
  });

  describe('getPreview', () => {
    beforeEach(() => {
      // Reset the mock to ensure clean state
      normalizeWhitespace.mockImplementation(text => {
        if (!text) return '';
        return text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
      });
    });

    it('returns full description if shorter than length', () => {
      const deck = new Deck({ description: 'Short description' });
      const preview = deck.getPreview(30);
      
      expect(normalizeWhitespace).toHaveBeenCalledWith('Short description');
      expect(preview).toBe('Short description');
    });

    it('truncates description with ellipsis if longer than length', () => {
      const longText = 'This is a very long description that should be truncated in the preview';
      const deck = new Deck({ description: longText });
      const preview = deck.getPreview(20);
      
      expect(normalizeWhitespace).toHaveBeenCalledWith(longText);
      expect(preview.length).toBe(23); // 20 chars + '...'
      expect(preview.endsWith('...')).toBe(true);
    });
  });
});