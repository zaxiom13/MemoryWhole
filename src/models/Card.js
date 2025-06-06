// Card.js - Data model for memory cards
import { normalizeWhitespace } from '../utils/memoryUtils';

/**
 * Represents a memory card in the system
 */
class Card {
  /**
   * Creates a new Card instance
   * @param {Object} data - Card data 
   * @param {number} data.id - Unique identifier
   * @param {string} data.title - Card title
   * @param {string} data.text - Card content text
   * @param {number} data.createdAt - Creation timestamp
   * @param {number} [data.updatedAt] - Last update timestamp
   * @param {number} [data.deckId] - ID of the deck this card belongs to
   */
  constructor(data = {}) {
    this.id = data.id || 0;
    this.title = data.title || '';
    this.text = data.text || '';
    this.createdAt = data.createdAt || Date.now();
    this.updatedAt = data.updatedAt || null;
    this.deckId = data.deckId || null; // All cards must belong to a deck
  }

  /**
   * Creates a card from raw object data
   * @param {Object} data - Raw card data
   * @returns {Card} A new Card instance
   */
  static fromObject(data) {
    return new Card(data);
  }

  /**
   * Creates a new card with updated properties
   * @param {Object} updates - Properties to update
   * @returns {Card} A new Card instance with updated properties
   */
  update(updates) {
    return new Card({
      ...this,
      ...updates,
      updatedAt: Date.now()
    });
  }

  /**
   * Get a preview of the card text
   * @param {number} length - Maximum length of preview
   * @returns {string} Text preview
   */
  getPreview(length = 70) {
    const normalizedText = normalizeWhitespace(this.text);
    if (normalizedText.length <= length) {
      return normalizedText;
    }
    return normalizedText.substring(0, length) + '...';
  }

  /**
   * Convert card to plain object for storage
   * @returns {Object} Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      title: this.title,
      text: this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deckId: this.deckId
    };
  }
}

export default Card;