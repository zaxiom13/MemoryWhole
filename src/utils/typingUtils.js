import { savePersonalBestTime } from './memoryUtils';

/**
 * Check if the typing input is correct
 * @param {string} input - User's input text
 * @param {string} reference - Reference text to compare against
 * @returns {boolean} True if the input matches the reference up to its length
 */
export function isInputCorrect(input, reference) {
  if (!reference || input.length === 0) return true;
  const referenceSubstring = reference.substring(0, input.length);
  return input === referenceSubstring;
}

/**
 * Checks the correctness of user input against the reference text
 * @param {string} reference - Reference text to compare against
 * @param {string} input - User's input text
 * @param {boolean} easyMode - Whether easy mode is enabled
 * @returns {Object} Object containing isCorrect flag and the last correct index
 */
export function checkCorrectness(reference, input, easyMode) {
  if (!reference || !input) {
    return { isCorrect: true, correctIndex: 0 };
  }
  
  let correctIndex = 0;
  while (correctIndex < input.length && correctIndex < reference.length) {
    if (input[correctIndex] !== reference[correctIndex]) {
      break;
    }
    correctIndex++;
  }
  
  const isCorrect = correctIndex === input.length;
  return { isCorrect, correctIndex };
}

/**
 * Generates ghost text for typing assistance
 * @param {string} reference - Reference text to display as ghost
 * @param {string} input - User's input text
 * @param {boolean} easyMode - Whether easy mode is enabled
 * @returns {string} The ghost text to display
 */
export function getGhostText(reference, input, easyMode) {
  if (!reference || !input) return '';
  
  const { correctIndex } = checkCorrectness(reference, input, easyMode);
  if (correctIndex < input.length) return ''; // Don't show ghost text if there's an error
  
  // Return the next part of the reference text
  return reference.substring(correctIndex);
}

/**
 * Calculate accuracy percentage between user input and reference text
 * @param {string} reference - Reference text to compare against
 * @param {string} input - User's input text
 * @param {boolean} easyMode - Whether easy mode is enabled
 * @returns {number} Accuracy percentage (0-100)
 */
export function calculateAccuracy(reference, input, easyMode) {
  if (!reference || !input) return 0;
  
  // If typing is complete in easy mode, consider it 100% accurate
  if (isTypingComplete(input, reference, easyMode)) {
    return 100;
  }
  
  let matchedChars = 0;
  const minLength = Math.min(input.length, reference.length);
  
  for (let i = 0; i < minLength; i++) {
    if (input[i] === reference[i]) {
      matchedChars++;
    }
  }
  
  return (matchedChars / reference.length) * 100;
}

/**
 * Check if the typing is complete
 * @param {string} input - User's input text
 * @param {string} reference - Reference text to compare against
 * @param {boolean} easyMode - Whether easy mode is enabled
 * @returns {boolean} True if the typing is complete
 */
export function isTypingComplete(input, reference, easyMode) {
  if (!reference || !input) return false;
  
  // Exact match
  if (input === reference) return true;
  
  // Easy mode: allow skipping final punctuation
  if (easyMode) {
    const lastChar = reference.charAt(reference.length - 1);
    const isPunctuation = /[.,?!]/.test(lastChar);
    
    if (input.length === reference.length - 1 &&
        input === reference.slice(0, -1) && 
        isPunctuation) {
      return true;
    }
  }
  
  return false;
}

/**
 * Handle typing completion
 * @param {string} reference - Reference text
 * @param {boolean} easyMode - Whether easy mode is enabled
 * @param {boolean} referenceExposed - Whether the reference was shown during typing
 * @param {boolean} ghostTextEnabled - Whether ghost text was enabled
 * @returns {number} The completion time in seconds
 */
export function handleCompletion(reference, easyMode, referenceExposed, ghostTextEnabled) {
  const baseTime = Math.floor((Date.now() - window.startTime) / 1000);
  
  // Save the personal best time with settings information
  savePersonalBestTime(reference, baseTime, easyMode, referenceExposed, ghostTextEnabled);
  
  return baseTime;
}