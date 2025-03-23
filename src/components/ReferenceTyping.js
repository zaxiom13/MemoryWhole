import React, { useEffect, useState } from 'react';
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
    <span className={isCorrect ? 'text-green-500' : 'text-red-500'}>
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmation</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Opening the reference text will incur a 1-minute penalty. Are you sure you want to proceed?
            </p>
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition ml-2"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
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
    <>
      <div className="mt-4 w-full max-w-lg">
        {/* Timer display */}
        <div className="mb-2 text-right font-mono text-lg">
          Time: {formatTime(timer)}
        </div>
        <div className="w-full p-2 border rounded relative">
          <div className="font-mono whitespace-pre-wrap">
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
            className="absolute inset-0 w-full h-full opacity-0 p-2 resize-none"
            value={userInput}
            onChange={handleInputChange}
            autoFocus
            disabled={isComplete}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
          />
        </div>
      </div>
      {!isComplete && (
        <>
          <div className="flex gap-2 mt-4">
            <button 
              className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition"
              onClick={onBack}
            >
              Back
            </button>
            {hasMistakes() && (
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                onClick={handleBackToLastCorrect}
                disabled={lastCorrectIndex === userInput.length}
              >
                Back to Last Correct
              </button>
            )}
          </div>
          {!isReferenceOpen && (
            <div className="w-full mt-2">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
                onClick={handleShowReferenceClick}
              >
                Show Reference
              </button>
            </div>
          )}
        </>
      )}
      {isReferenceOpen && (
        <div className="mt-2 p-2 border rounded select-none">
          <p className="text-gray-600">{selectedReference}</p>
        </div>
      )}

      {/* Reference Text Confirmation Modal */}
      <ReferenceTextModal 
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirmShowReference}
        onCancel={handleCancelShowReference}
      />
    </>
  );
}
