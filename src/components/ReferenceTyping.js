import React, { useRef, useEffect, useState } from 'react';

export default function ReferenceTyping({ userInput, selectedReference, onInputChange, onBack, isComplete }) {
  const textareaRef = useRef(null);
  const [ghostText, setGhostText] = useState('');
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [lastCorrectIndex, setLastCorrectIndex] = useState(0);
  
  // Move hasMistake function before the useEffect that uses it
  const hasMistake = () => {
    return userInput.split('').some((char, index) => selectedReference[index] !== char);
  };
  
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
      if (Date.now() - lastInputTime > 3000 && 
          selectedReference &&
          userInput.length < selectedReference.length &&
          !hasMistake()) {
        setGhostText(selectedReference.slice(userInput.length, userInput.length + 5));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [lastInputTime, userInput, selectedReference, hasMistake]); // Add hasMistake to the dependency array

  const renderColoredText = () => {
    let mistakeFound = false;
    return userInput.split('').map((char, index) => {
      if (!mistakeFound && selectedReference[index] !== char) {
        mistakeFound = true;
      }
      const isCorrect = !mistakeFound && selectedReference[index] === char;
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

  return (
    <>
      <div className="mt-4 w-full max-w-lg">
        {/* Timer display */}
        <div className="mb-2 text-right font-mono text-lg">
          Time: {formatTime(timer)}
        </div>
        <p className="mb-2 text-gray-600">Type the reference text here...</p>
        <div className="w-full p-2 border rounded relative">
          <div className="font-mono whitespace-pre-wrap">
            {renderColoredText()}
            <span className="animate-blink">|</span>
            {/* Ghost text positioned absolutely to prevent layout shift */}
            {ghostText && (
              <span className="absolute text-gray-400 opacity-50" style={{ left: `${userInput.length+1}ch` }}>
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
    </>
  );
}