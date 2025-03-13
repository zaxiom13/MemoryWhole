import { useState } from 'react';
import ReferenceSelection from './components/ReferenceSelection';
import ReferenceConfirmation from './components/ReferenceConfirmation';
import ReferenceTyping from './components/ReferenceTyping';

const cards = [
  { 
    id: 1, 
    title: 'Ancient Wisdom', 
    text: 'The journey of a thousand miles begins with a single step, but the wisdom of the ages teaches us that every step thereafter must be taken with purpose and mindfulness.' 
  },
  { 
    id: 2, 
    title: 'Cosmic Perspective', 
    text: 'In the vast expanse of the universe, our world is but a pale blue dot, reminding us of both our insignificance and our incredible potential to create meaningful change.' 
  },
  { 
    id: 3, 
    title: 'Technological Revolution', 
    text: 'As we stand on the brink of a new era of artificial intelligence, we must carefully consider how to harness this power for the betterment of humanity while preserving our essential human values.' 
  }
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
      <style>
        {`
          ::-webkit-scrollbar {
            width: 1px;
            opacity: 0;
            transition: opacity 0.2s;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #666;
          }
          .h-[70vh]:hover::-webkit-scrollbar {
            opacity: 1;
          }
        `}
      </style>
      <h1 className="text-4xl font-bold mb-6 sticky top-0 bg-white z-10">MemoryWhole</h1>
      <div className="w-full max-w-2xl h-[70vh] overflow-y-auto">
        {step === 1 && (
          <>
            <h2 className="text-2xl mb-6 text-center text-gray-700">
              Choose a passage to practice your memory
            </h2>
            <ReferenceSelection 
              cards={cards} 
              onSelectReference={handleSelectReference} 
            />
          </>
        )}
        {step === 2 && (
          <ReferenceConfirmation 
            selectedReference={selectedReference}
            onConfirm={() => {
              setStep(3);
              window.startTime = Date.now();
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
    </div>
  );
}
