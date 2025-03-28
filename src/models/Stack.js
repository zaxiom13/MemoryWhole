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
   * @param {string} [data.description] - Optional stack description
   * @param {number} data.createdAt - Creation timestamp
   * @param {number} [data.updatedAt] - Last update timestamp
   * @param {number} [data.lastStudied] - Last study session timestamp
   * @param {number} [data.completedSessions] - Number of completed study sessions
   * @param {number} [data.totalStudyTime] - Total study time in seconds
   */
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.description = data.description || '';
    this.createdAt = data.createdAt || Date.now();
    this.updatedAt = data.updatedAt || null;
    this.lastStudied = data.lastStudied || null;
    this.completedSessions = data.completedSessions || 0;
    this.totalStudyTime = data.totalStudyTime || 0;
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
   * Records a completed study session
   * @param {number} studyTime - Time spent studying in seconds
   * @returns {Stack} A new Stack instance with updated study stats
   */
  recordStudySession(studyTime) {
    return new Stack({
      ...this,
      lastStudied: Date.now(),
      completedSessions: (this.completedSessions || 0) + 1,
      totalStudyTime: (this.totalStudyTime || 0) + studyTime,
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
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastStudied: this.lastStudied,
      completedSessions: this.completedSessions,
      totalStudyTime: this.totalStudyTime
    };
  }
}

export default Stack; 