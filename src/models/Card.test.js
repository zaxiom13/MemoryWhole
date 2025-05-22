import Card from './Card';
import { normalizeWhitespace } from '../utils/memoryUtils';

// Mock the memoryUtils
jest.mock('../utils/memoryUtils', () => ({
  normalizeWhitespace: jest.fn(text => {
    if (!text) return '';
    return text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  })
}));

describe('Card', () => {
  describe('constructor', () => {
    it('creates a card with default values', () => {
      const card = new Card();
      expect(card.id).toBe(0);
      expect(card.title).toBe('');
      expect(card.text).toBe('');
      expect(card.createdAt).toBeTruthy();
      expect(card.updatedAt).toBeNull();
      expect(card.deckId).toBeNull();
    });

    it('creates a card with provided values', () => {
      const timestamp = 1620000000000;
      const cardData = {
        id: 1,
        title: 'Test Card',
        text: 'This is a test',
        createdAt: timestamp,
        updatedAt: timestamp + 1000,
        deckId: 5
      };
      const card = new Card(cardData);
      expect(card.id).toBe(1);
      expect(card.title).toBe('Test Card');
      expect(card.text).toBe('This is a test');
      expect(card.createdAt).toBe(timestamp);
      expect(card.updatedAt).toBe(timestamp + 1000);
      expect(card.deckId).toBe(5);
    });
  });

  describe('static fromObject', () => {
    it('creates a card from plain object', () => {
      const data = { id: 2, title: 'From Object', text: 'Created from object' };
      const card = Card.fromObject(data);
      expect(card).toBeInstanceOf(Card);
      expect(card.id).toBe(2);
      expect(card.title).toBe('From Object');
    });
  });

  describe('update', () => {
    it('returns a new card with updated properties', () => {
      const originalCard = new Card({ id: 3, title: 'Original', text: 'Original text' });
      const updatedCard = originalCard.update({ title: 'Updated' });
      
      // Original should be unchanged
      expect(originalCard.title).toBe('Original');
      
      // Updated should have new values
      expect(updatedCard).not.toBe(originalCard); // Different instance
      expect(updatedCard.id).toBe(3); // Same ID
      expect(updatedCard.title).toBe('Updated'); // Updated title
      expect(updatedCard.text).toBe('Original text'); // Unchanged text
      expect(updatedCard.updatedAt).not.toBeNull(); // Updated timestamp
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

    it('returns full text if shorter than length', () => {
      const card = new Card({ text: 'Short text' });
      const preview = card.getPreview(20);
      
      expect(normalizeWhitespace).toHaveBeenCalledWith('Short text');
      expect(preview).toBe('Short text');
    });

    it('truncates text with ellipsis if longer than length', () => {
      const longText = 'This is a very long text that should be truncated in the preview';
      const card = new Card({ text: longText });
      const preview = card.getPreview(20);
      
      expect(normalizeWhitespace).toHaveBeenCalledWith(longText);
      expect(preview.length).toBe(23); // 20 chars + '...'
      expect(preview.endsWith('...')).toBe(true);
    });
  });

  describe('toObject', () => {
    it('converts card to plain object', () => {
      const timestamp = Date.now();
      const card = new Card({
        id: 4,
        title: 'Test',
        text: 'Content',
        createdAt: timestamp,
        updatedAt: timestamp + 1000,
        deckId: 7
      });
      
      const obj = card.toObject();
      expect(obj).toEqual({
        id: 4,
        title: 'Test',
        text: 'Content',
        createdAt: timestamp,
        updatedAt: timestamp + 1000,
        deckId: 7
      });
    });
  });
});