// DeckCollection.js - Manages a collection of Deck objects
import Deck from './Deck';

/**
 * Manages a collection of Deck objects
 */
class DeckCollection {
  /**
   * Creates a new deck collection
   * @param {Deck[]} decks - Initial decks array
   */
  constructor(decks = []) {
    this.decks = [...decks];
  }

  /**
   * Creates a collection from an array of plain objects
   * @param {Object[]} data - Array of deck data
   * @returns {DeckCollection} A new DeckCollection instance
   */
  static fromArray(data = []) {
    const decks = data.map(item => Deck.fromObject(item));
    return new DeckCollection(decks);
  }

  /**
   * Get all decks in the collection
   * @returns {Deck[]} Array of all decks
   */
  getAll() {
    return [...this.decks];
  }

  /**
   * Get a deck by its ID
   * @param {number} id - Deck ID
   * @returns {Deck|undefined} The deck with matching ID or undefined
   */
  getById(id) {
    return this.decks.find(deck => deck.id === id);
  }

  /**
   * Add a new deck to the collection
   * @param {Object} data - Deck data without ID
   * @returns {Deck} The newly created deck
   */
  addDeck(data) {
    const maxId = this.decks.length > 0 
      ? Math.max(...this.decks.map(deck => deck.id)) 
      : 0;
      
    const newDeck = new Deck({
      id: maxId + 1,
      createdAt: Date.now(),
      ...data
    });
    
    this.decks.push(newDeck);
    return newDeck;
  }

  /**
   * Update an existing deck
   * @param {number} id - ID of deck to update
   * @param {Object} updates - Properties to update
   * @returns {Deck|null} Updated deck or null if not found
   */
  updateDeck(id, updates) {
    const index = this.decks.findIndex(deck => deck.id === id);
    if (index === -1) return null;
    
    const updatedDeck = this.decks[index].update(updates);
    this.decks[index] = updatedDeck;
    return updatedDeck;
  }

  /**
   * Remove a deck by ID
   * @param {number} id - ID of deck to remove
   * @returns {boolean} True if deck was found and removed
   */
  removeDeck(id) {
    const initialLength = this.decks.length;
    this.decks = this.decks.filter(deck => deck.id !== id);
    return this.decks.length < initialLength;
  }

  /**
   * Add a card to a deck
   * @param {number} deckId - ID of the deck
   * @param {number} cardId - ID of the card to add
   * @returns {Deck|null} Updated deck or null if not found
   */
  addCardToDeck(deckId, cardId) {
    const index = this.decks.findIndex(deck => deck.id === deckId);
    if (index === -1) return null;
    
    const updatedDeck = this.decks[index].addCard(cardId);
    this.decks[index] = updatedDeck;
    return updatedDeck;
  }

  /**
   * Remove a card from a deck
   * @param {number} deckId - ID of the deck
   * @param {number} cardId - ID of the card to remove
   * @returns {Deck|null} Updated deck or null if not found
   */
  removeCardFromDeck(deckId, cardId) {
    const index = this.decks.findIndex(deck => deck.id === deckId);
    if (index === -1) return null;
    
    const updatedDeck = this.decks[index].removeCard(cardId);
    this.decks[index] = updatedDeck;
    return updatedDeck;
  }

  /**
   * Sort decks by last modified date (updatedAt or createdAt)
   * @param {boolean} ascending - Sort direction (true for oldest first)
   * @returns {Deck[]} Sorted array of decks
   */
  sortByDate(ascending = false) {
    const sorted = [...this.decks].sort((a, b) => {
      const aDate = a.updatedAt || a.createdAt || 0;
      const bDate = b.updatedAt || b.createdAt || 0;
      const comparison = aDate - bDate;
      return ascending ? comparison : -comparison;
    });
    return sorted;
  }

  /**
   * Convert collection to array of plain objects for storage
   * @returns {Object[]} Array of plain deck objects
   */
  toArray() {
    return this.decks.map(deck => deck.toObject());
  }
}

export default DeckCollection;