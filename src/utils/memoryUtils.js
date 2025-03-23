// memoryUtils.js - Pure utility functions for the Memory Whole app

/**
 * Format seconds into MM:SS time format
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time string (MM:SS)
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format a timestamp into readable date string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Check if the user input has any mistakes compared to the reference
 * @param {string} userInput - User's typed input
 * @param {string} reference - Reference text
 * @returns {boolean} True if there are mistakes
 */
export function hasMistakes(userInput, reference) {
  return userInput.split('').some((char, index) => reference[index] !== char);
}

/**
 * Find the index of the last correct character
 * @param {string} userInput - User's typed input
 * @param {string} reference - Reference text
 * @returns {number} Index of the last correct character
 */
export function findLastCorrectIndex(userInput, reference) {
  let correctIndex = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === reference[i]) {
      correctIndex = i + 1;
    } else {
      break;
    }
  }
  return correctIndex;
}

/**
 * Compare input and reference to get character-by-character correctness
 * @param {string} userInput - User's typed input
 * @param {string} reference - Reference text
 * @returns {Array<{char: string, isCorrect: boolean}>} Array of characters with correctness
 */
export function getCharacterCorrectness(userInput, reference) {
  let mistakeFound = false;
  return userInput.split('').map((char, index) => {
    if (!mistakeFound && reference[index] !== char) {
      mistakeFound = true;
    }
    const isCorrect = !mistakeFound && reference[index] === char;
    
    return {
      char,
      isCorrect,
      isSpace: char === ' '
    };
  });
}

/**
 * Load cards from localStorage
 * @param {Array} defaultCards - Default cards to use if none exist in storage
 * @returns {Array} Cards from localStorage or defaultCards
 */
export function loadCardsFromStorage(defaultCards) {
  try {
    const savedCards = localStorage.getItem('memoryCards');
    if (savedCards) {
      return JSON.parse(savedCards);
    }
    
    const defaultCardsWithTimestamps = defaultCards.map(card => ({
      ...card,
      createdAt: card.createdAt || Date.now()
    }));
    
    localStorage.setItem('memoryCards', JSON.stringify(defaultCardsWithTimestamps));
    return defaultCardsWithTimestamps;
  } catch (error) {
    console.error('Error loading cards from localStorage:', error);
    return defaultCards;
  }
}

/**
 * Save cards to localStorage
 * @param {Array} cards - Cards to save
 */
export function saveCardsToStorage(cards) {
  try {
    if (cards && cards.length > 0) {
      localStorage.setItem('memoryCards', JSON.stringify(cards));
    }
  } catch (error) {
    console.error('Error saving cards to localStorage:', error);
  }
}

/**
 * Load user preference from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if nothing is stored
 * @returns {*} Preference value
 */
export function loadPreference(key, defaultValue) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue !== null ? JSON.parse(savedValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Save user preference to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export function savePreference(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
} 