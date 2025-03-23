// CardCollection.js - Manages a collection of Card objects
import Card from './Card';

/**
 * Manages a collection of Card objects
 */
class CardCollection {
  /**
   * Creates a new card collection
   * @param {Card[]} cards - Initial cards array
   */
  constructor(cards = []) {
    this.cards = [...cards];
  }

  /**
   * Creates a collection from an array of plain objects
   * @param {Object[]} data - Array of card data
   * @returns {CardCollection} A new CardCollection instance
   */
  static fromArray(data = []) {
    const cards = data.map(item => Card.fromObject(item));
    return new CardCollection(cards);
  }

  /**
   * Get all cards in the collection
   * @returns {Card[]} Array of all cards
   */
  getAll() {
    return [...this.cards];
  }

  /**
   * Get a card by its ID
   * @param {number} id - Card ID
   * @returns {Card|undefined} The card with matching ID or undefined
   */
  getById(id) {
    return this.cards.find(card => card.id === id);
  }

  /**
   * Add a new card to the collection
   * @param {Object} data - Card data without ID
   * @returns {Card} The newly created card
   */
  addCard(data) {
    const maxId = this.cards.length > 0 
      ? Math.max(...this.cards.map(card => card.id)) 
      : 0;
      
    const newCard = new Card({
      id: maxId + 1,
      createdAt: Date.now(),
      ...data
    });
    
    this.cards.push(newCard);
    return newCard;
  }

  /**
   * Update an existing card
   * @param {number} id - ID of card to update
   * @param {Object} updates - Properties to update
   * @returns {Card|null} Updated card or null if not found
   */
  updateCard(id, updates) {
    const index = this.cards.findIndex(card => card.id === id);
    if (index === -1) return null;
    
    const updatedCard = this.cards[index].update(updates);
    this.cards[index] = updatedCard;
    return updatedCard;
  }

  /**
   * Remove a card by ID
   * @param {number} id - ID of card to remove
   * @returns {boolean} True if card was found and removed
   */
  removeCard(id) {
    const initialLength = this.cards.length;
    this.cards = this.cards.filter(card => card.id !== id);
    return this.cards.length < initialLength;
  }

  /**
   * Sort cards by last modified date (updatedAt or createdAt)
   * @param {boolean} ascending - Sort direction (true for oldest first)
   * @returns {Card[]} Sorted array of cards
   */
  sortByDate(ascending = false) {
    const sorted = [...this.cards].sort((a, b) => {
      const aDate = a.updatedAt || a.createdAt || 0;
      const bDate = b.updatedAt || b.createdAt || 0;
      const comparison = aDate - bDate;
      return ascending ? comparison : -comparison;
    });
    return sorted;
  }

  /**
   * Convert collection to array of plain objects for storage
   * @returns {Object[]} Array of plain card objects
   */
  toArray() {
    return this.cards.map(card => card.toObject());
  }
}

export default CardCollection;