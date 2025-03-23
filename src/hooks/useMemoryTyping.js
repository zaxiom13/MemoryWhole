// useMemoryTyping.js - Custom hook for managing memory typing state
import { useState, useEffect, useCallback, useRef } from 'react';
import { hasMistakes, findLastCorrectIndex, savePreference } from '../utils/memoryUtils';

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
  const [penaltyTime, setPenaltyTime] = useState(0);
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
      // Apply 60-second penalty
      const penalty = 60;
      setTimer(prevTimer => prevTimer + penalty);
      
      // Adjust startTime to account for penalty
      const newStartTime = startTime - (penalty * 1000);
      setStartTime(newStartTime);
      
      // Also adjust window.startTime to stay in sync
      window.startTime = newStartTime;
      
      // Update penalty time
      setPenaltyTime(prevPenalty => {
        const newPenalty = prevPenalty + penalty;
        localStorage.setItem('timePenalty', newPenalty.toString());
        return newPenalty;
      });
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
    resetTyping
  };
}

export default useMemoryTyping; 