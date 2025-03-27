// useMemoryTyping.js - Custom hook for managing memory typing state
import { useState, useEffect, useCallback, useRef } from 'react';
import { hasMistakes, findLastCorrectIndex } from '../utils/memoryUtils';

/**
 * Custom hook that manages memory typing state and logic
 * @param {Object} props - Hook properties
 * @param {string} props.referenceText - The text to memorize and type
 * @param {boolean} props.easyMode - Whether easy mode is enabled
 * @param {boolean} props.ghostTextEnabled - Whether ghost text is enabled
 * @returns {Object} State and handlers for typing component
 */
function useMemoryTyping({ referenceText, easyMode = false, ghostTextEnabled = true }) {
  // The reference text is already normalized at this point
  const normalizedReferenceText = referenceText;
  
  const [userInput, setUserInput] = useState('');
  const [ghostText, setGhostText] = useState('');
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [lastCorrectIndex, setLastCorrectIndex] = useState(0);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [penaltyTime, setPenaltyTime] = useState(0);
  const textareaRef = useRef(null);

  // Check if the input has any mistakes
  const checkMistakes = useCallback(() => {
    if (easyMode) {
      // In easy mode, we need to compare ignoring case and punctuation
      const userChars = userInput.toLowerCase().split('');
      const refChars = normalizedReferenceText.toLowerCase().split('');
      
      for (let i = 0; i < userChars.length; i++) {
        const userChar = userChars[i];
        const refChar = refChars[i] || '';
        
        // Skip punctuation in reference text
        if (/[.,;:!?"'[\](){}\-–—]/.test(refChar)) {
          continue;
        }
        
        // If characters don't match (ignoring case), there's a mistake
        if (userChar !== refChar) {
          return true;
        }
      }
      return false;
    } else {
      // Normal mode - use the standard hasMistakes function
      return hasMistakes(userInput, normalizedReferenceText);
    }
  }, [userInput, normalizedReferenceText, easyMode]);

  // Update lastCorrectIndex when userInput changes
  useEffect(() => {
    let index;
    
    if (easyMode) {
      // Custom logic for easy mode to find last correct index
      index = 0;
      const userChars = userInput.toLowerCase().split('');
      const refChars = normalizedReferenceText.toLowerCase().split('');
      
      for (let i = 0; i < userChars.length; i++) {
        const userChar = userChars[i];
        const refChar = refChars[i] || '';
        
        // Skip punctuation in reference text
        if (/[.,;:!?"'[\](){}\-–—]/.test(refChar)) {
          index = i + 1;
          continue;
        }
        
        // If characters match (ignoring case), update index
        if (userChar === refChar) {
          index = i + 1;
        } else {
          break;
        }
      }
    } else {
      // Normal mode - use the standard findLastCorrectIndex function
      index = findLastCorrectIndex(userInput, normalizedReferenceText);
    }
    
    setLastCorrectIndex(index);
    
    // Check if typing is complete
    if (easyMode) {
      // In easy mode, we need to check if all non-punctuation characters match
      const userChars = userInput.toLowerCase().split('');
      const refChars = normalizedReferenceText.toLowerCase().split('');
      let isMatch = true;
      let userIndex = 0;
      
      for (let i = 0; i < refChars.length; i++) {
        const refChar = refChars[i];
        
        // Skip punctuation in reference text
        if (/[.,;:!?"'[\](){}\-–—]/.test(refChar)) {
          continue;
        }
        
        // If we've run out of user input or characters don't match, it's not complete
        if (userIndex >= userChars.length || userChars[userIndex] !== refChar) {
          isMatch = false;
          break;
        }
        
        userIndex++;
      }
      
      // If all non-punctuation characters match and we've used all user input, it's complete
      if (isMatch && userIndex === userChars.length) {
        setIsComplete(true);
      }
    } else {
      // Normal mode - exact match required
      if (userInput.length === normalizedReferenceText.length && 
          userInput === normalizedReferenceText) {
        setIsComplete(true);
      }
    }
  }, [userInput, normalizedReferenceText, easyMode]);

  // Initialize timer when component mounts
  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
    window.startTime = now; // For compatibility with existing code
    // Reset penalty time when starting a new session
    setPenaltyTime(0);
    localStorage.setItem('timePenalty', '0');
  }, []);
  
  // Update timer every second
  useEffect(() => {
    if (isComplete) return;
    
    const timerInterval = setInterval(() => {
      if (startTime) {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [startTime, isComplete]);
  
  // Handle ghost text display
  useEffect(() => {
    // Only show ghost text if it's enabled
    if (!ghostTextEnabled) {
      setGhostText('');
      return () => {};
    }
    
    const timer = setInterval(() => {
      if (!isReferenceOpen && Date.now() - lastInputTime > 1000 && 
          normalizedReferenceText &&
          userInput.length < normalizedReferenceText.length &&
          !checkMistakes()) {
        setGhostText(normalizedReferenceText.slice(userInput.length, userInput.length + 10));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [lastInputTime, userInput, normalizedReferenceText, checkMistakes, isReferenceOpen, ghostTextEnabled]);

  // Handle input change
  const handleInputChange = (e) => {
    setLastInputTime(Date.now());
    setGhostText('');
    
    let newValue = e.target.value;
    const oldValue = userInput;
    
    // In easy mode, filter out punctuation characters that the user types
    if (easyMode && newValue.length > oldValue.length) {
      // Check if the last character typed is punctuation
      const lastCharTyped = newValue[newValue.length - 1];
      if (/[.,;:!?"'[\](){}\-–—]/.test(lastCharTyped)) {
        // Ignore the punctuation keystroke by reverting to previous value
        newValue = oldValue;
      }
    }
    
    // Handle special backspace case for punctuation in easy mode
    if (easyMode && 
        oldValue.length > newValue.length && 
        newValue.length > 0 && 
        oldValue.length > 1) {
      // Check if the last character was punctuation
      const lastChar = oldValue[oldValue.length - 1];
      if (/[.,;:!?"'[\](){}\-–—]/.test(lastChar)) {
        // Remove the character before the punctuation as well
        newValue = newValue.slice(0, -1);
      }
    }
    
    // Auto-correct case in easy mode
    if (easyMode && newValue.length > 0) {
      // Get the last character the user just typed
      const lastCharIndex = newValue.length - 1;
      
      // Only auto-correct if we haven't reached the end of the reference text
      if (lastCharIndex < normalizedReferenceText.length) {
        const userChar = newValue[lastCharIndex];
        const refChar = normalizedReferenceText[lastCharIndex];
        
        // If the characters match case-insensitively but not case-sensitively
        if (userChar.toLowerCase() === refChar.toLowerCase() && userChar !== refChar) {
          // Replace the last character with the correct case from reference text
          newValue = newValue.substring(0, lastCharIndex) + refChar;
        }
      }
    }
    
    // Auto-punctuation in easy mode - only if all characters so far are correct
    if (easyMode && 
        newValue.length < normalizedReferenceText.length && 
        !hasMistakes(newValue, normalizedReferenceText.substring(0, newValue.length))) {
      // Check if we need to add punctuation
      let nextIndex = newValue.length;
      
      // Keep adding punctuation as long as the next character is punctuation
      while (
        nextIndex < normalizedReferenceText.length && 
        /[.,;:!?"'[\](){}\-–—]/.test(normalizedReferenceText[nextIndex])
      ) {
        newValue += normalizedReferenceText[nextIndex];
        nextIndex++;
      }
    }
    
    setUserInput(newValue);
  };

  // Reset to last correct position
  const handleBackToLastCorrect = () => {
    console.log('Back to last correct position: ' + lastCorrectIndex + ' characters');
    const correctedInput = userInput.slice(0, lastCorrectIndex);
    setUserInput(correctedInput);

  };

  // Show reference confirmation dialog
  const handleShowReferenceClick = () => {
    setIsConfirmationOpen(true);
  };

  // Handle showing the reference text
  const handleConfirmShowReference = () => {
    setIsReferenceOpen(true);
    setIsConfirmationOpen(false);
    
    // No time penalty for showing reference - removed
  };

  // Hide confirmation
  const handleCancelShowReference = () => {
    setIsConfirmationOpen(false);
  };

  // Reset typing state
  const resetTyping = () => {
    setUserInput('');
    setIsComplete(false);
    setTimer(0);
    const now = Date.now();
    setStartTime(now);
    window.startTime = now;
    // Reset penalty time
    setPenaltyTime(0);
    localStorage.setItem('timePenalty', '0');
  };

  return {
    userInput,
    ghostText,
    timer,
    isComplete,
    lastCorrectIndex,
    isReferenceOpen,
    isConfirmationOpen,
    textareaRef,
    penaltyTime,
    hasMistakes: checkMistakes,
    handleInputChange,
    handleBackToLastCorrect,
    handleShowReferenceClick,
    handleConfirmShowReference,
    handleCancelShowReference,
    resetTyping,
    setIsReferenceOpen // Expose the setter function to allow external control
  };
}

export default useMemoryTyping;