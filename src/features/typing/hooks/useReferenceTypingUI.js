import { useState, useEffect } from 'react';
import { checkCorrectness, getGhostText } from '../../../utils/typingUtils';

/**
 * Custom hook for managing the UI state and logic of the ReferenceTyping component
 * 
 * @param {string} reference - The reference text 
 * @param {string} initialInput - The initial input text
 * @param {boolean} easyMode - Whether easy mode is enabled
 * @param {boolean} ghostTextEnabled - Whether ghost text is enabled
 * @returns {Object} UI state and handlers for ReferenceTyping component
 */
export default function useReferenceTypingUI(reference, initialInput = "", easyMode = false, ghostTextEnabled = true) {
  // State variables
  const [userInput, setUserInput] = useState(initialInput);
  const [ghostText, setGhostText] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [typingStarted, setTypingStarted] = useState(false);
  const [lastCorrectIndex, setLastCorrectIndex] = useState(0);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  
  // Start ghost text timer when input changes
  useEffect(() => {
    let timer;
    if (ghostTextEnabled && userInput && !ghostText && timerRunning) {
      timer = setTimeout(() => {
        const text = getGhostText(reference, userInput, easyMode);
        setGhostText(text);
      }, 2000); // Show ghost text after 2 seconds of inactivity
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [userInput, ghostText, reference, easyMode, ghostTextEnabled, timerRunning]);
  
  // Check input correctness when it changes
  useEffect(() => {
    if (userInput) {
      const { isCorrect, correctIndex } = checkCorrectness(reference, userInput, easyMode);
      setLastCorrectIndex(correctIndex);
    }
  }, [userInput, reference, easyMode]);
  
  // Initialize from props if provided
  useEffect(() => {
    if (initialInput) {
      setUserInput(initialInput);
    }
  }, [initialInput]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUserInput(newValue);
    setGhostText('');  // Reset ghost text when typing
    
    // Start timer on first input
    if (!typingStarted && newValue) {
      setTypingStarted(true);
    }
  };
  
  // Handle reference viewing
  const handleConfirmShowReference = () => {
    setShowReferenceModal(true);
  };
  
  // Handle confirmation of showing reference
  const handleShowReference = () => {
    setIsReferenceOpen(true);
    setShowReferenceModal(false);
  };
  
  // Handle cancellation of showing reference
  const handleCancelShowReference = () => {
    setShowReferenceModal(false);
  };
  
  return {
    userInput,
    ghostText,
    timerRunning,
    setTimerRunning,
    typingStarted,
    lastCorrectIndex,
    isReferenceOpen,
    setIsReferenceOpen,
    showReferenceModal,
    handleInputChange,
    handleConfirmShowReference,
    handleShowReference,
    handleCancelShowReference
  };
}