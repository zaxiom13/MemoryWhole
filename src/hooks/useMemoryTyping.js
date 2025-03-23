// useMemoryTyping.js - Custom hook for managing memory typing state
import { useState, useEffect, useCallback, useRef } from 'react';
import { hasMistakes, findLastCorrectIndex } from '../utils/memoryUtils';

/**
 * Custom hook that manages memory typing state and logic
 * @param {Object} props - Hook properties
 * @param {string} props.referenceText - The text to memorize and type
 * @returns {Object} State and handlers for typing component
 */
function useMemoryTyping({ referenceText }) {
  const [userInput, setUserInput] = useState('');
  const [ghostText, setGhostText] = useState('');
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [lastCorrectIndex, setLastCorrectIndex] = useState(0);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const textareaRef = useRef(null);

  // Check if the input has any mistakes
  const checkMistakes = useCallback(() => {
    return hasMistakes(userInput, referenceText);
  }, [userInput, referenceText]);

  // Update lastCorrectIndex when userInput changes
  useEffect(() => {
    const index = findLastCorrectIndex(userInput, referenceText);
    setLastCorrectIndex(index);
    
    // Check if typing is complete
    if (userInput.length === referenceText.length && 
        userInput === referenceText) {
      setIsComplete(true);
    }
  }, [userInput, referenceText]);

  // Initialize timer when component mounts
  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
    window.startTime = now; // For compatibility with existing code
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
    const timer = setInterval(() => {
      if (!isReferenceOpen && Date.now() - lastInputTime > 1000 && 
          referenceText &&
          userInput.length < referenceText.length &&
          !checkMistakes()) {
        setGhostText(referenceText.slice(userInput.length, userInput.length + 10));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [lastInputTime, userInput, referenceText, checkMistakes, isReferenceOpen]);

  // Handle input change
  const handleInputChange = (e) => {
    setLastInputTime(Date.now());
    setGhostText('');
    setUserInput(e.target.value);
  };

  // Reset to last correct position
  const handleBackToLastCorrect = () => {
    const correctedInput = userInput.slice(0, lastCorrectIndex);
    setUserInput(correctedInput);
    textareaRef.current.focus();
  };

  // Show reference confirmation dialog
  const handleShowReferenceClick = () => {
    setIsConfirmationOpen(true);
  };

  // Handle showing the reference text
  const handleConfirmShowReference = () => {
    setIsReferenceOpen(true);
    if (startTime) {
      setTimer(prevTimer => prevTimer + 60); // Add 60 seconds penalty
      setStartTime(prev => prev - 60000); // Adjust startTime to account for penalty
    }
    setIsConfirmationOpen(false);
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
    hasMistakes: checkMistakes,
    handleInputChange,
    handleBackToLastCorrect,
    handleShowReferenceClick,
    handleConfirmShowReference,
    handleCancelShowReference,
    resetTyping
  };
}

export default useMemoryTyping; 