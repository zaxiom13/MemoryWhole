import { useState } from 'react';
import ReferenceSelection from './components/ReferenceSelection';
import ReferenceConfirmation from './components/ReferenceConfirmation';
import ReferenceTyping from './components/ReferenceTyping';

const cards = [
  { id: 1, title: 'Reference 1', text: 'This is reference text 1.' },
  { id: 2, title: 'Reference 2', text: 'This is reference text 2.' },
  { id: 3, title: 'Reference 3', text: 'This is reference text 3.' }
];

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedReference, setSelectedReference] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUserInput(newValue);
    
    // Check if the input matches the reference after the new character is added
    if (newValue.length === selectedReference.length && 
        newValue === selectedReference) {
      setIsComplete(true);
      // Capture the current time when completed
      setCompletionTime(Math.floor((Date.now() - window.startTime) / 1000));
    }
  };

  const handleSelectReference = (text) => {
    setSelectedReference(text);
    setUserInput('');
    setStep(2);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">MemoryWhole</h1>
      {step === 1 && (
        <ReferenceSelection 
          cards={cards} 
          onSelectReference={handleSelectReference} 
        />
      )}
      {step === 2 && (
        <ReferenceConfirmation 
          selectedReference={selectedReference}
          onConfirm={() => {
            setStep(3);
            window.startTime = Date.now(); // Set start time when typing begins
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <>
          {isComplete ? (
            <div className="text-center">
              <h2 className="text-2xl mb-4">Congratulations! 🎉</h2>
              <p className="text-xl mb-4">
                You completed the task in <span className="font-bold">{formatTime(completionTime)}</span>
              </p>
              <button 
                onClick={() => {
                  setStep(1);
                  setIsComplete(false);
                  setUserInput('');
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Return to Menu
              </button>
            </div>
          ) : (
            <ReferenceTyping 
              userInput={userInput}
              selectedReference={selectedReference}
              onInputChange={handleInputChange}
              onBack={() => setStep(2)}
              isComplete={isComplete}
            />
          )}
        </>
      )}
    </div>
  );
}
