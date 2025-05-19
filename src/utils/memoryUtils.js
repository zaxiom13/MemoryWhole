// memoryUtils.js - Pure utility functions for the Memory Whole app

/**
 * Normalize whitespace in text by removing newlines and trimming multiple spaces to single spaces
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeWhitespace(text) {
  if (!text) return '';
  // Replace all newlines with spaces
  let normalized = text.replace(/\n/g, ' ');
  // Replace multiple spaces with a single space
  normalized = normalized.replace(/\s+/g, ' ');
  return normalized;
}

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
 * @param {boolean} easyMode - Whether easy mode is enabled
 * @returns {Array<{char: string, isCorrect: boolean}>} Array of characters with correctness
 */
export function getCharacterCorrectness(userInput, reference, easyMode = false) {
  let mistakeFound = false;
  return userInput.split('').map((char, index) => {
    // In easy mode, we ignore case and punctuation
    let isCharCorrect = false;
    if (easyMode) {
      // Ignore case by converting both to lowercase
      const userChar = char.toLowerCase();
      const refChar = reference[index] ? reference[index].toLowerCase() : '';
      
      // Check if it's punctuation in the reference that we should auto-handle
      const isPunctuation = /[.,;:!?"'[\](){}\-–—]/.test(refChar);
      
      // Character is correct if:
      // 1. It matches exactly (ignoring case), or
      // 2. It's a punctuation mark in the reference (we auto-handle it)
      isCharCorrect = !mistakeFound && (userChar === refChar || isPunctuation);
    } else {
      // Normal mode - exact match required
      isCharCorrect = !mistakeFound && reference[index] === char;
    }
    
    // If this character is wrong and we haven't found a mistake yet, mark it
    if (!mistakeFound && !isCharCorrect) {
      mistakeFound = true;
    }
    
    return {
      char,
      isCorrect: isCharCorrect,
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

/**
 * Save a personal best time for a reference text
 * @param {string} referenceText - The reference text
 * @param {number} completionTime - The completion time in seconds
 * @param {boolean} easyMode - Whether easy mode was used (optional, defaults to false)
 * @param {boolean} referenceExposed - Whether reference text was exposed (optional, defaults to false)
 * @param {boolean} ghostTextUsed - Whether ghost text assistance was used (optional, defaults to false)
 */
export function savePersonalBestTime(referenceText, completionTime, easyMode = false, referenceExposed = false, ghostTextUsed = false) {
  try {
    // The reference text is already normalized at this point
    // Create a unique key based on the first 50 characters of the reference text
    const referenceKey = `personalBest_${referenceText.substring(0, 50).replace(/\s+/g, '_')}`;
    
    // Get existing best times or initialize empty array
    const existingTimes = loadPersonalBestTimes(referenceText);
    
    // Add new time with additional information
    existingTimes.push({
      time: completionTime,
      date: Date.now(),
      easyMode: easyMode,
      referenceExposed: referenceExposed,
      ghostTextUsed: ghostTextUsed
    });
    
    // Sort by time (ascending)
    existingTimes.sort((a, b) => a.time - b.time);
    
    // Keep only top 5 times
    const topTimes = existingTimes.slice(0, 5);
    
    // Save to localStorage
    localStorage.setItem(referenceKey, JSON.stringify(topTimes));
  } catch (error) {
    console.error('Error saving personal best time:', error);
  }
}

/**
 * Load personal best times for a reference text
 * @param {string} referenceText - The reference text
 * @returns {Array} Array of best times objects with time and date properties
 */
export function loadPersonalBestTimes(referenceText) {
  try {
    // The reference text is already normalized at this point
    // Create a unique key based on the first 50 characters of the reference text
    const referenceKey = `personalBest_${referenceText.substring(0, 50).replace(/\s+/g, '_')}`;
    
    // Get existing best times or initialize empty array
    const savedTimes = localStorage.getItem(referenceKey);
    return savedTimes ? JSON.parse(savedTimes) : [];
  } catch (error) {
    console.error('Error loading personal best times:', error);
    return [];
  }
}

/**
 * Load all personal best times for all references
 * @returns {Array} Array of objects with reference preview and best times
 */
export function loadAllPersonalBestTimes() {
  try {
    const results = [];
    
    // Iterate through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Check if this is a personal best time key
      if (key && key.startsWith('personalBest_')) {
        // Extract the reference preview from the key
        const referencePreview = key.substring(13).replace(/_/g, ' ');
        
        // Get the times for this reference
        const times = JSON.parse(localStorage.getItem(key));
        
        // Add to results if there are times
        if (times && times.length > 0) {
          results.push({
            referencePreview,
            times
          });
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error loading all personal best times:', error);
    return [];
  }
}

/**
 * Load decks from localStorage
 * @param {Array} defaultDecks - Default decks to use if none exist in storage
 * @returns {Array} Decks from localStorage or defaultDecks
 */
export function loadDecksFromStorage(defaultDecks) {
  try {
    const savedDecks = localStorage.getItem('memoryDecks');
    if (savedDecks) {
      return JSON.parse(savedDecks);
    }
    
    const defaultDecksWithTimestamps = defaultDecks.map(deck => ({
      ...deck,
      createdAt: deck.createdAt || Date.now()
    }));
    
    localStorage.setItem('memoryDecks', JSON.stringify(defaultDecksWithTimestamps));
    return defaultDecksWithTimestamps;
  } catch (error) {
    console.error('Error loading decks from localStorage:', error);
    return defaultDecks;
  }
}

/**
 * Save decks to localStorage
 * @param {Array} decks - Decks to save
 */
export function saveDecksToStorage(decks) {
  try {
    if (decks && decks.length > 0) {
      localStorage.setItem('memoryDecks', JSON.stringify(decks));
    }
  } catch (error) {
    console.error('Error saving decks to localStorage:', error);
  }
}