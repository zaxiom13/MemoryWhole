// Stack.js - Data model for card stacks

/**
 * Represents a stack of memory cards
 */
class Stack {
  /**
   * Creates a new Stack instance
   * @param {Object} data - Stack data 
   * @param {number} data.id - Unique identifier
   * @param {string} data.name - Stack name
   * @param {number} data.createdAt - Creation timestamp
   * @param {number} [data.updatedAt] - Last update timestamp
   */
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.createdAt = data.createdAt || Date.now();
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * Creates a stack from raw object data
   * @param {Object} data - Raw stack data
   * @returns {Stack} A new Stack instance
   */
  static fromObject(data) {
    return new Stack(data);
  }

  /**
   * Creates a new stack with updated properties
   * @param {Object} updates - Properties to update
   * @returns {Stack} A new Stack instance with updated properties
   */
  update(updates) {
    return new Stack({
      ...this,
      ...updates,
      updatedAt: Date.now()
    });
  }

  /**
   * Convert stack to plain object for storage
   * @returns {Object} Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Stack; 