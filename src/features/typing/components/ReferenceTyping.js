import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useReferenceTypingUI from '../hooks/useReferenceTypingUI';
import Timer from '../../../components/Timer';
import EasyModeIndicator from '../../../ui/EasyModeIndicator';
import { calculateAccuracy } from '../../../utils/typingUtils';

/**
 * Main reference typing component
 */
export default function ReferenceTyping({  
  selectedReference, 
  onInputChange, 
  onBack, 
  isComplete, 
  easyMode = false, 
  onReferenceExposed,
  ghostTextEnabled = true,
  showReferenceEnabled = false,
  inputError,
  userInput = ""
}) {
  const {
    timerRunning,
    setTimerRunning,
    isReferenceOpen,
    setIsReferenceOpen,
    ghostText,
    lastCorrectIndex,
    typingStarted,
    handleInputChange: internalHandleInputChange,
    handleConfirmShowReference,
  } = useReferenceTypingUI(selectedReference, userInput, easyMode, ghostTextEnabled);
  
  const textareaRef = useRef(null);
  
  // Focus textarea when component mounts or typing starts
  useEffect(() => {
    if (!isComplete && typingStarted && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [typingStarted, isComplete]);
  
  // Start timer when typing begins
  useEffect(() => {
    if (typingStarted && !timerRunning) {
      setTimerRunning(true);
    }
  }, [typingStarted, timerRunning, setTimerRunning]);
  
  // Debug logs
  useEffect(() => {
    console.log('Ghost text:', ghostText);
    console.log('Last correct index:', lastCorrectIndex);
  }, [ghostText, lastCorrectIndex]);

  // Automatically set isReferenceOpen if showReferenceEnabled is true
  useEffect(() => {
    if (showReferenceEnabled) {
      setIsReferenceOpen(true);
      if (onReferenceExposed) {
        onReferenceExposed();
      }
    }
  }, [showReferenceEnabled, setIsReferenceOpen, onReferenceExposed]);
  
  // Handle input change bridging between props and hook
  const handleInputChange = (e) => {
    // First update the internal state in the hook
    internalHandleInputChange(e);
    // Then propagate the change to the parent component
    if (onInputChange) {
      onInputChange(e);
    }
  };
  
  // Override the handleConfirmShowReference to notify parent component
  const handleConfirmShowReferenceWithCallback = () => {
    // Call the hook's implementation
    handleConfirmShowReference();
    // Notify parent component that reference was exposed
    if (onReferenceExposed) {
      onReferenceExposed();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-full max-w-lg">
        {/* Timer display and Easy Mode indicator */}
        <div className="flex justify-between items-center mb-4">
          <Timer isRunning={timerRunning && !isComplete} />
          {easyMode && <EasyModeIndicator />}
        </div>
        
        {/* Reference text display (conditionally shown) */}
        {isReferenceOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 mb-4 overflow-y-auto max-h-[20vh]"
          >
            <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Reference Text:</h3>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {selectedReference}
            </p>
          </motion.div>
        )}
        
        {/* Typing area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleInputChange}
            disabled={isComplete}
            className={`w-full min-h-[200px] p-3 rounded-lg border ${inputError ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 font-sans`}
            placeholder="Start typing to recall the text..."
          />

          {/* Ghost text overlay */}
          {ghostTextEnabled && ghostText && (
            <div
              className="absolute inset-0 pointer-events-none p-3 text-gray-400 dark:text-gray-600 overflow-hidden whitespace-pre-wrap leading-normal font-sans"
              aria-hidden="true"
            >
              <span className="invisible">{userInput}</span>
              {ghostText}
            </div>
          )}

          {/* Accuracy counter when completed */}
          {isComplete && (
            <div className="absolute right-3 bottom-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-md text-sm">
              {calculateAccuracy(selectedReference, userInput, easyMode).toFixed(1)}% Accuracy
            </div>
          )}
        </div>
        
        {/* Control buttons */}
        <div className="w-full max-w-lg mt-6 flex flex-col space-y-3">
          <div className="flex gap-3 justify-between">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="leather-button flex items-center" // Removed custom padding
              onClick={onBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </motion.button>
            
            {!isReferenceOpen && !isComplete && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="leather-button bg-blue-700 hover:bg-blue-800 flex items-center" // Removed custom padding
                onClick={handleConfirmShowReferenceWithCallback}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Show Reference
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}