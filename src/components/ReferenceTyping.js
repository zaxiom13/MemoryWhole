import React, { useRef, useEffect, useState } from 'react';
import { useCallback } from 'react';

export default function ReferenceTyping({ userInput, selectedReference, onInputChange, onBack, isComplete }) {
  const textareaRef = useRef(null);
  const [ghostText, setGhostText] = useState('');
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [lastCorrectIndex, setLastCorrectIndex] = useState(0);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  
  // Wrap hasMistake in useCallback to memoize it
  const hasMistake = useCallback(() => {
    return userInput.split('').some((char, index) => selectedReference[index] !== char);
  }, [userInput, selectedReference]);
  
  // Update lastCorrectIndex when userInput changes
  useEffect(() => {
    let correctIndex = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === selectedReference[i]) {
        correctIndex = i + 1;
      } else {
        break;
      }
    }
    setLastCorrectIndex(correctIndex);
  }, [userInput, selectedReference]);

  // Initialize timer when component mounts
  useEffect(() => {
    setStartTime(Date.now());
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
  
  // Add useEffect for ghost text timeout
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isReferenceOpen && Date.now() - lastInputTime > 1000 && 
          selectedReference &&
          userInput.length < selectedReference.length &&
          !hasMistake()) {
        setGhostText(selectedReference.slice(userInput.length, userInput.length + 10));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [lastInputTime, userInput, selectedReference, hasMistake, isReferenceOpen]); // Add isReferenceOpen to the dependency array

  const renderColoredText = () => {
    let mistakeFound = false;
    return userInput.split('').map((char, index) => {
      if (!mistakeFound && selectedReference[index] !== char) {
        mistakeFound = true;
      }
      const isCorrect = !mistakeFound && selectedReference[index] === char;
      
      // Special handling for spaces
      if (char === ' ' && !isCorrect) {
        return (
          <span key={index} className="text-red-500 inline-block" style={{ 
            width: '0.5em', 
            height: '1em', 
            backgroundColor: 'rgba(239, 68, 68, 0.3)', 
          }}>
          </span>
        );
      }
      
      return (
        <span key={index} className={isCorrect ? 'text-green-500' : 'text-red-500'}>
          {char || ''}
        </span>
      );
    });
  };

  const handleInputChange = (e) => {
    setLastInputTime(Date.now());
    setGhostText('');
    onInputChange(e);
  };

  const handleBackToLastCorrect = () => {
    const correctedInput = userInput.slice(0, lastCorrectIndex);
    onInputChange({ target: { value: correctedInput } });
    textareaRef.current.focus();
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleShowReferenceClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmShowReference = () => {
    setIsReferenceOpen(true);
    if (startTime) {
      setTimer(prevTimer => prevTimer + 60); // Add 60 seconds penalty
    } else {
      setTimer(60); // If startTime is not initialized, set timer to 60
    }
    setIsConfirmationOpen(false);
  };

  const handleCancelShowReference = () => {
    setIsConfirmationOpen(false);
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
            {renderColoredText()}
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
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition"
          onClick={onBack}
        >
          Back
        </button>
        {hasMistake() && (
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
      {isReferenceOpen && (
        <div className="mt-2 p-2 border rounded select-none">
          <p className="text-gray-600">{selectedReference}</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
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
                onClick={handleCancelShowReference}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition ml-2"
                onClick={handleConfirmShowReference}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
