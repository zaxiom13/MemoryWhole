// Deck.js - Data model for card decks
import { normalizeWhitespace } from '../utils/memoryUtils';

/**
 * Represents a deck of memory cards in the system
 */
class Deck {
  /**
   * Creates a new Deck instance
   * @param {Object} data - Deck data 
   * @param {number} data.id - Unique identifier
   * @param {string} data.title - Deck title
   * @param {string} data.description - Deck description
   * @param {number[]} data.cardIds - Array of card IDs in this deck
   * @param {number} data.createdAt - Creation timestamp
   * @param {number} [data.updatedAt] - Last update timestamp
   */
  constructor(data = {}) {
    this.id = data.id || 0;
    this.title = data.title || '';
    this.description = data.description || '';
    this.cardIds = data.cardIds || [];
    this.createdAt = data.createdAt || Date.now();
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * Creates a deck from raw object data
   * @param {Object} data - Raw deck data
   * @returns {Deck} A new Deck instance
   */
  static fromObject(data) {
    return new Deck(data);
  }

  /**
   * Creates a new deck with updated properties
   * @param {Object} updates - Properties to update
   * @returns {Deck} A new Deck instance with updated properties
   */
  update(updates) {
    return new Deck({
      ...this,
      ...updates,
      updatedAt: Date.now()
    });
  }

  /**
   * Add a card ID to the deck
   * @param {number} cardId - ID of the card to add
   * @returns {Deck} A new Deck instance with the card added
   */
  addCard(cardId) {
    if (this.cardIds.includes(cardId)) {
      return this;
    }
    return new Deck({
      ...this,
      cardIds: [...this.cardIds, cardId],
      updatedAt: Date.now()
    });
  }

  /**
   * Remove a card ID from the deck
   * @param {number} cardId - ID of the card to remove
   * @returns {Deck} A new Deck instance with the card removed
   */
  removeCard(cardId) {
    return new Deck({
      ...this,
      cardIds: this.cardIds.filter(id => id !== cardId),
      updatedAt: Date.now()
    });
  }

  /**
   * Get a preview of the deck description
   * @param {number} length - Maximum length of preview
   * @returns {string} Description preview
   */
  getPreview(length = 70) {
    const normalizedText = normalizeWhitespace(this.description);
    if (normalizedText.length <= length) {
      return normalizedText;
    }
    return normalizedText.substring(0, length) + '...';
  }

  /**
   * Convert deck to plain object for storage
   * @returns {Object} Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      cardIds: [...this.cardIds],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Deck;