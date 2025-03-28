import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReferenceConfirmation from './components/ReferenceConfirmation';
import ReferenceTyping from './components/ReferenceTyping';
import TutorialGuide from './components/TutorialGuide';
import HomePage from './components/HomePage';
import CompletionPage from './components/CompletionPage';
import useCardCollection from './hooks/useCardCollection';
import { loadPreference, savePreference, savePersonalBestTime, normalizeWhitespace } from './utils/memoryUtils';
import './styles/modern.css';
import './styles/ui-enhancements.css';

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
  const [easyMode, setEasyMode] = useState(false);
  const [ghostTextEnabled, setGhostTextEnabled] = useState(true);
  const [showReferenceEnabled, setShowReferenceEnabled] = useState(false);
  const [inputError, setInputError] = useState(false);

  // Set initial step based on tutorial completion
  useEffect(() => {
    const tutorialComplete = loadPreference('tutorialComplete', false);
    setStep(tutorialComplete ? 1 : 0);
  }, []);

  // Load preferences
  useEffect(() => {
    const savedDarkMode = loadPreference('darkMode', false);
    const savedEasyMode = loadPreference('easyMode', false);
    const savedGhostTextEnabled = loadPreference('ghostTextEnabled', true);
    const savedShowReferenceEnabled = loadPreference('showReferenceEnabled', false);
    
    setDarkMode(savedDarkMode);
    setEasyMode(savedEasyMode);
    setGhostTextEnabled(savedGhostTextEnabled);
    setShowReferenceEnabled(savedShowReferenceEnabled);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    savePreference('darkMode', darkMode);
  }, [darkMode]);
  
  // Save preferences when they change
  useEffect(() => {
    savePreference('easyMode', easyMode);
  }, [easyMode]);
  
  useEffect(() => {
    savePreference('ghostTextEnabled', ghostTextEnabled);
  }, [ghostTextEnabled]);
  
  useEffect(() => {
    savePreference('showReferenceEnabled', showReferenceEnabled);
  }, [showReferenceEnabled]);

  // State to track if reference was exposed during the test
  const [referenceExposed, setReferenceExposed] = useState(false);

  // Input change handler
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUserInput(newValue);

    // Check if the input is currently incorrect
    let isIncorrect = false;
    if (selectedReference && newValue.length > 0) {
      const referenceSubstring = selectedReference.substring(0, newValue.length);
      isIncorrect = newValue !== referenceSubstring;
    }

    // Set error state and reset after animation
    if (isIncorrect) {
      setInputError(true);
      setTimeout(() => setInputError(false), 500); // Match animation duration
    } else {
      setInputError(false); // Reset if correct or deleting
    }

    // is last char of reference is punctuation
    const lastChar = selectedReference && selectedReference.length > 0 ? selectedReference.charAt(selectedReference.length - 1) : null;
    const isPunctuation = lastChar && /[.,?!]/.test(lastChar);
    
    // In easy mode, if the last char of reference is punctuation, thenwhen newvalue length is 
    // one less than selected reference then mark as complete
    if (easyMode && selectedReference && selectedReference.length > 0 &&
        newValue.length === selectedReference.length - 1 &&
        newValue === selectedReference.slice(0, -1) && isPunctuation) {
          setIsComplete(true);
          // Get the base completion time
          const baseTime = Math.floor((Date.now() - window.startTime) / 1000 );

          // Set the total completion time (base time includes penalties already due to startTime adjustment    
          //  
          setCompletionTime(baseTime);
          // Pass easyMode parameter to savePersonalBestTime
          savePersonalBestTime(selectedReference, baseTime, easyMode, referenceExposed);
          // ,    
        }

    if (newValue.length === selectedReference.length && 
        newValue === selectedReference) {
      setIsComplete(true);
      // Get the base completion time
      const baseTime = Math.floor((Date.now() - window.startTime) / 1000);
      
      // Set the total completion time (base time includes penalties already due to startTime adjustment,
      // so we don't need to add penalties here)
      setCompletionTime(baseTime);
      
      // Save the personal best time with easyMode information and referenceExposed flag
      savePersonalBestTime(selectedReference, baseTime, easyMode, referenceExposed);
    }
  };

  // Reference selection handler
  const handleSelectReference = (text) => {
    // Normalize the reference text at the earliest point
    const normalizedText = normalizeWhitespace(text);
    setSelectedReference(normalizedText);
    setUserInput('');
    setStep(2);
  };

  // Return to typing handler
  const handleTypingBack = () => {
    setUserInput('');
    setStep(2);
    setIsComplete(false);
    setReferenceExposed(false); // Reset reference exposed flag
    window.startTime = null;
    // Reset time penalty when trying again
    localStorage.setItem('timePenalty', '0');
  };

  // Return to menu handler
  const handleReturnToMenu = () => {
    setStep(1);
    setIsComplete(false);
    setUserInput('');
    setReferenceExposed(false); // Reset reference exposed flag
    // Reset time penalty when returning to menu
    localStorage.setItem('timePenalty', '0');
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  // Easy mode toggle
  const toggleEasyMode = () => {
    const newEasyMode = !easyMode;
    setEasyMode(newEasyMode);
    savePreference('easyMode', newEasyMode);
  };
  
  // Ghost text toggle
  const toggleGhostText = () => {
    const newGhostTextEnabled = !ghostTextEnabled;
    setGhostTextEnabled(newGhostTextEnabled);
    savePreference('ghostTextEnabled', newGhostTextEnabled);
  };
  
  // Show reference toggle
  const toggleShowReference = () => {
    const newShowReferenceEnabled = !showReferenceEnabled;
    setShowReferenceEnabled(newShowReferenceEnabled);
    savePreference('showReferenceEnabled', newShowReferenceEnabled);
  };

  return (
    <div className={`min-h-screen px-4 py-8 transition-colors duration-300 leather-background ${darkMode ? 'dark' : ''}`}>
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button 
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-full transition-colors duration-300 ${darkMode ? 'bg-gray-600 text-indigo-400 hover:bg-gray-500' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
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
      </div>
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
            <h1 className="text-5xl font-bold mb-10 sticky top-0 z-10 leather-title py-2">
              Memory Whole
            </h1>
            <div className="w-full max-w-2xl h-[80vh] relative stitched-border paper-background p-8">
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
                    setReferenceExposed(false); // Reset reference exposed flag
                    window.startTime = Date.now();
                    // Reset time penalty when beginning a new test
                    localStorage.setItem('timePenalty', '0');
                  }}
                  onBack={handleReturnToMenu}
                  easyMode={easyMode}
                  onToggleEasyMode={toggleEasyMode}
                  ghostTextEnabled={ghostTextEnabled}
                  onToggleGhostText={toggleGhostText}
                  showReferenceEnabled={showReferenceEnabled}
                  onToggleShowReference={toggleShowReference}
                />
              )}
              
              {step === 3 && (
                <ReferenceTyping 
                  userInput={userInput}
                  selectedReference={selectedReference}
                  onInputChange={handleInputChange}
                  onBack={handleReturnToMenu}
                  isComplete={isComplete}
                  easyMode={easyMode}
                  onReferenceExposed={() => setReferenceExposed(true)}
                  ghostTextEnabled={ghostTextEnabled}
                  showReferenceEnabled={showReferenceEnabled}
                  inputError={inputError}
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
        /* Removed redundant scrollbar styles - Handled in modern.css */
        .h-[70vh]:hover::-webkit-scrollbar {
          opacity: 1;
        }
      `}
    </style>
  );
}
