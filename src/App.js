import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReferenceConfirmation from './components/ReferenceConfirmation';
import ReferenceTyping from './components/ReferenceTyping';
import TutorialGuide from './components/TutorialGuide';
import HomePage from './components/HomePage';
import CompletionPage from './components/CompletionPage';
import useCardCollection from './hooks/useCardCollection';
import { loadPreference, savePreference, formatTime } from './utils/memoryUtils';

// Application state management
export default function App() {
  const {
    cards,
    editingCard,
    createCard,
    updateCard,
    deleteCard,
    editCard,
    cancelEdit
  } = useCardCollection();

  const [step, setStep] = useState(0);
  const [selectedReference, setSelectedReference] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Set initial step based on tutorial completion
  useEffect(() => {
    const tutorialComplete = loadPreference('tutorialComplete', false);
    setStep(tutorialComplete ? 1 : 0);
  }, []);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = loadPreference('darkMode', false);
    setDarkMode(savedDarkMode);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    savePreference('darkMode', darkMode);
  }, [darkMode]);

  // Input change handler
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUserInput(newValue);
    
    if (newValue.length === selectedReference.length && 
        newValue === selectedReference) {
      setIsComplete(true);
      // Get the base completion time
      const baseTime = Math.floor((Date.now() - window.startTime) / 1000);
      
      // Get any penalty time from localStorage
      const penaltyTime = localStorage.getItem('timePenalty') ? parseInt(localStorage.getItem('timePenalty')) : 0;
      
      // Set the total completion time (base time includes penalties already due to startTime adjustment,
      // so we don't need to add penalties here)
      setCompletionTime(baseTime);
    }
  };

  // Reference selection handler
  const handleSelectReference = (text) => {
    setSelectedReference(text);
    setUserInput('');
    setStep(2);
  };

  // Return to typing handler
  const handleTypingBack = () => {
    setUserInput('');
    setStep(2);
    setIsComplete(false);
    window.startTime = null;
    // Reset time penalty when trying again
    localStorage.setItem('timePenalty', '0');
  };

  // Return to menu handler
  const handleReturnToMenu = () => {
    setStep(1);
    setIsComplete(false);
    setUserInput('');
    // Reset time penalty when returning to menu
    localStorage.setItem('timePenalty', '0');
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
      <button 
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 p-2 rounded-full z-50 transition-colors duration-300 ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-indigo-100 text-gray-800'}`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      <AnimatePresence>
        {step === 0 ? (
          <TutorialGuide onComplete={() => {
            savePreference('tutorialComplete', true);
            setStep(1);
          }} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <GlobalStyles />
            <h1 className="text-5xl font-bold mb-6 sticky top-0 z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-2">
              Memory Whole
            </h1>
            <div className="w-full max-w-2xl h-[80vh] relative backdrop-blur-sm bg-white/30 rounded-xl shadow-xl p-6 border border-white/50">
              {step === 1 && (
                <HomePage 
                  cards={cards} 
                  onSelectReference={handleSelectReference}
                  onCreateCard={() => editCard({})}
                  onEditCard={editCard}
                  onDeleteCard={deleteCard}
                  editingCard={editingCard}
                  onUpdateCard={updateCard}
                  onCreateNewCard={createCard}
                  onCancelEdit={cancelEdit}
                />
              )}
              
              {step === 2 && (
                <ReferenceConfirmation 
                  selectedReference={selectedReference}
                  onBegin={() => {
                    setStep(3);
                    window.startTime = Date.now();
                    // Reset time penalty when beginning a new test
                    localStorage.setItem('timePenalty', '0');
                  }}
                  onBack={handleReturnToMenu}
                />
              )}
              
              {step === 3 && (
                <ReferenceTyping 
                  userInput={userInput}
                  selectedReference={selectedReference}
                  onInputChange={handleInputChange}
                  onBack={handleReturnToMenu}
                  isComplete={isComplete}
                />
              )}
              
              {isComplete && (
                <CompletionPage 
                  completionTime={completionTime}
                  selectedReference={selectedReference}
                  onReturnToMenu={handleReturnToMenu}
                  onTryAgain={handleTypingBack}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Global styles component
function GlobalStyles() {
  return (
    <style>
      {`
        ::-webkit-scrollbar {
          width: 6px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        ::-webkit-scrollbar-track {
          background: rgba(241, 241, 241, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6, #ec4899);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed, #db2777);
        }
        .h-[70vh]:hover::-webkit-scrollbar {
          opacity: 1;
        }
        .card-gradient-1 { background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); }
        .card-gradient-2 { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); }
        .card-gradient-3 { background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%); }
        .card-gradient-4 { background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); }
        .card-gradient-5 { background: linear-gradient(135deg, #ede9fe 0%, #fbcfe8 100%); }
        .card-gradient-6 { background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); }
      `}
    </style>
  );
}
