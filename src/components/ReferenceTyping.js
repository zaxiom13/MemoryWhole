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
    <span className={isCorrect ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>
      {char || ''}
    </span>
  );
}

/**
 * Text display with character coloring
 */
function ColoredTextDisplay({ userInput, referenceText }) {
  const characterData = getCharacterCorrectness(userInput, referenceText);
  
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
      <motion.div 
        className="relative mx-auto p-6 border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-xl rounded-xl note-paper"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="text-center">
          <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-gray-100 mb-3">Time Penalty Warning</h3>
          <div className="mt-2">
            <p className="text-gray-600 dark:text-gray-300">
              Opening the reference text will incur a 1-minute penalty. Are you sure you want to proceed?
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
            className="px-4 py-2 leather-button rounded-lg transition-all duration-300"
            onClick={onConfirm}
          >
            Confirm
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Main reference typing component
 */
export default function ReferenceTyping({ userInput, selectedReference, onInputChange, onBack, isComplete }) {
  // State to track textarea focus
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  // Use our custom hook for typing functionality
  const {
    userInput: internalUserInput,
    ghostText,
    timer,
    isComplete: internalIsComplete,
    lastCorrectIndex,
    isReferenceOpen,
    isConfirmationOpen,
    textareaRef,
    hasMistakes,
    handleInputChange: internalHandleInputChange,
    handleBackToLastCorrect,
    handleShowReferenceClick,
    handleConfirmShowReference,
    handleCancelShowReference
  } = useMemoryTyping({
    referenceText: selectedReference
  });

  // Sync internal and external state
  useEffect(() => {
    if (userInput !== undefined) {
      internalHandleInputChange({ target: { value: userInput } });
    }
  }, [userInput]);

  // Handle input change bridging between props and hook
  const handleInputChange = (e) => {
    internalHandleInputChange(e);
    if (onInputChange) {
      onInputChange(e);
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
        {/* Timer display */}
        <div className="mb-3 text-right">
          <motion.div 
            className="inline-block font-mono text-lg font-semibold px-4 py-1 note-paper rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
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
        
        {/* Typing area */}
        <div className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl relative note-paper shadow-md transition-all duration-300">
          <div className="font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200 min-h-[100px]">
            <ColoredTextDisplay userInput={userInput} referenceText={selectedReference} />
            
            {/* Position the caret relative to character width */}
            {isTextareaFocused && (
              <span className="animate-blink inline-block" style={{ marginLeft: '-0.5ch' }}>|</span>
            )}
            
            {/* Ghost text positioned relative to character width */}
            {ghostText && (
              <span className="text-gray-400 opacity-50" style={{ marginLeft: '-0.5ch' }}>
                {ghostText}
              </span>
            )}
          </div>
          <textarea 
            ref={textareaRef}
            className="absolute inset-0 w-full h-full opacity-0 p-4 resize-none rounded-xl"
            value={userInput}
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
              className="px-4 py-2 leather-button rounded-lg transition-colors duration-300 flex items-center"
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
                className="px-4 py-2 leather-button text-white font-medium rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBackToLastCorrect}
                disabled={lastCorrectIndex === userInput.length}
              >
                Back to Last Correct
              </motion.button>
            )}
          </div>
          
          {/* Show reference button */}
          {!isReferenceOpen && (
            <div className="w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 leather-button text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
                onClick={handleShowReferenceClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Show Reference
              </motion.button>
            </div>
          )}
        </div>
      )}
      
      {/* Reference text display when opened */}
      {isReferenceOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mt-4 p-4 border border-yellow-300 dark:border-yellow-600 rounded-xl note-paper shadow-md transition-all duration-300"
        >
          <div className="flex items-center mb-2 text-yellow-700 dark:text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Reference Text:</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 select-none whitespace-pre-wrap leading-relaxed">
            {selectedReference}
          </p>
        </motion.div>
      )}

      {/* Reference Text Confirmation Modal */}
      <ReferenceTextModal 
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirmShowReference}
        onCancel={handleCancelShowReference}
      />
    </motion.div>
  );
}
