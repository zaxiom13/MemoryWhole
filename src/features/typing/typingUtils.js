import { savePersonalBestTime } from '../../utils/memoryUtils';

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