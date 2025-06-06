import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useMemoryTyping from '../hooks/useMemoryTyping';
import { formatTime, getCharacterCorrectness } from '../utils/memoryUtils';

/**
 * Character display component for colored text
 */
function CharacterDisplay({ char, isCorrect, isSpace }) {
  // Special handling for spaces
  if (isSpace && !isCorrect) {
    return (
      <span className="text-red-500 inline-block" style={{ 
        width: '0.5em', 
        height: '1em', 
        backgroundColor: 'rgba(239, 68, 68, 0.3)', 
      }}></span>
    );
  }
  
  return (
    <span className={isCorrect ? 'character-correct' : 'character-incorrect'}>
      {char || ''}
    </span>
  );
}

/**
 * Text display with character coloring
 */
function ColoredTextDisplay({ userInput, referenceText, easyMode }) {
  // The reference text is already normalized at this point
  const characterData = getCharacterCorrectness(userInput, referenceText, easyMode);
  
  return (
    <>
      {characterData.map((data, index) => (
        <CharacterDisplay 
          key={index} 
          char={data.char} 
          isCorrect={data.isCorrect} 
          isSpace={data.isSpace} 
        />
      ))}
    </>
  );
}

/**
 * Reference text display modal
 */
function ReferenceTextModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      {/* Modal card: Removed note-paper, applied new card styles */}
      <motion.div
        className="relative mx-auto p-6 border border-gray-300 dark:border-gray-600 w-full max-w-md shadow-xl rounded-lg bg-white dark:bg-gray-800"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="text-center">
          <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-gray-100 mb-3">Show Reference Text</h3>
          <div className="mt-2">
            <p className="text-gray-600 dark:text-gray-300">
              Would you like to view the reference text? This will be recorded in your personal best history.
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-300"
            onClick={onCancel}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="leather-button" // Removed custom padding & redundant classes
            onClick={onConfirm}
          >
            Show Reference
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

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
  inputError
}) {
  // State to track textarea focus
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  // Use our custom hook for typing functionality
  const {
    userInput: internalUserInput,
    ghostText,
    timer,
    lastCorrectIndex,
    isReferenceOpen,
    isConfirmationOpen,
    textareaRef,
    hasMistakes,
    handleInputChange: internalHandleInputChange,
    handleBackToLastCorrect,
    handleConfirmShowReference,
    handleCancelShowReference,
    setIsReferenceOpen
  } = useMemoryTyping({
    referenceText: selectedReference,
    easyMode: easyMode,
    ghostTextEnabled: ghostTextEnabled
  });
  
  // For debugging
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
        <div className="mb-3 flex justify-between items-center">
          {/* Easy Mode indicator */}
          {easyMode && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
            >
              {/* Feather icon for Easy Mode (h-4 w-4) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
              <span className="text-sm font-medium">Easy Mode</span>
            </motion.div>
          )}
          
          {/* Timer */}
          {/* Timer Display: Removed note-paper, used new card-like style */}
          <motion.div
            className="inline-block font-mono text-lg font-semibold px-4 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm text-gray-900 dark:text-gray-100"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            ⏱️ {formatTime(timer)}
          </motion.div>
        </div>
        
        {/* Typing area - Apply shake-error class conditionally */}
        <div className={`typing-area w-full p-4 relative ${inputError ? 'shake-error' : ''}`}>
          <div className="font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200 min-h-[100px]">
            <ColoredTextDisplay userInput={internalUserInput} referenceText={selectedReference} easyMode={easyMode} />
            
            {/* Position the caret relative to character width */}
            {isTextareaFocused && !isComplete && (
              <span className="animate-blink inline-block" style={{ marginLeft: '-0.5ch' }}>|</span>
            )}
            
            {/* Ghost text positioned relative to character width */}
            {ghostText && ghostTextEnabled && (
              <span className="text-gray-400 opacity-50" style={{ marginLeft: '-0.5ch' }}>
                {ghostText}
              </span>
            )}
          </div>
          <textarea 
            ref={textareaRef}
            className="absolute inset-0 w-full h-full opacity-0 p-4 resize-none rounded-xl"
            value={internalUserInput}
            onChange={handleInputChange}
            autoFocus
            disabled={isComplete}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
            aria-label="Typing area"
          />
        </div>
      </div>
      
      {!isComplete && (
        <div className="w-full max-w-lg mt-6 flex flex-col space-y-3">
          {/* Control buttons */}
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
            
            {hasMistakes() && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="leather-button disabled:opacity-50 disabled:cursor-not-allowed" // Removed custom padding & redundant classes
                onClick={handleBackToLastCorrect}
                disabled={lastCorrectIndex === internalUserInput.length}
              >
                Back to Last Correct
              </motion.button>
            )}
          </div>
          
          {/* Show reference button - removed in favor of toggle in confirmation screen */}
        </div>
      )}
      
      {/* Reference text display when opened: Removed note-paper, applied content area style */}
      {isReferenceOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mt-4 p-4 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-md transition-all duration-300"
        >
          {easyMode && (
            <div className="mb-3 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center text-green-700 dark:text-green-400 mb-1">
                {/* Feather icon for Easy Mode (h-5 w-5) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                  <line x1="16" y1="8" x2="2" y2="22"></line>
                  <line x1="17.5" y1="15" x2="9" y2="15"></line>
                </svg>
                <span className="font-medium">Easy Mode Enabled</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500">
                Punctuation is automatically handled and case is ignored for easier typing.  
              </p>
            </div>
          )}
          <div className="flex items-center mb-2 text-indigo-700 dark:text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Reference Text:</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 select-none leading-relaxed">
            {/* Display the normalized reference text */}
            {selectedReference}
          </p>
        </motion.div>
      )}

      {/* Reference Text Confirmation Modal - only show if not already enabled via settings */}
      {!showReferenceEnabled && (
        <ReferenceTextModal 
          isOpen={isConfirmationOpen}
          onConfirm={handleConfirmShowReferenceWithCallback}
          onCancel={handleCancelShowReference}
        />
      )}
    </motion.div>
  );
}
