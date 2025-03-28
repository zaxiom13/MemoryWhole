import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReferenceConfirmation from './components/ReferenceConfirmation';
import ReferenceTyping from './components/ReferenceTyping';
import TutorialGuide from './components/TutorialGuide';
import HomePage from './components/HomePage';
import CompletionPage from './components/CompletionPage';
import StackStudyPage from './components/StackStudyPage';
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
    cancelEditCard,
    getCardById,
    getCardsByStackId,
    stacks,
    editingStack,
    createStack,
    updateStack,
    deleteStack,
    editStack,
    cancelEditStack,
    getStackById
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
  const [referenceExposed, setReferenceExposed] = useState(false);
  const [studyStackId, setStudyStackId] = useState(null);

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

  // Input change handler
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setUserInput(newValue);

    let isIncorrect = false;
    if (selectedReference && newValue.length > 0) {
      const referenceSubstring = selectedReference.substring(0, newValue.length);
      isIncorrect = newValue !== referenceSubstring;
    }

    if (isIncorrect) {
      setInputError(true);
      setTimeout(() => setInputError(false), 500);
    } else {
      setInputError(false);
    }
    
    // Check for completion
    const checkCompletion = (currentValue) => {
      if (!selectedReference) return false;

      // Easy mode punctuation handling
      const lastCharRef = selectedReference.charAt(selectedReference.length - 1);
      const isPunctuation = /[.,?!]/.test(lastCharRef);
      if (easyMode && isPunctuation && 
          currentValue.length === selectedReference.length - 1 && 
          currentValue === selectedReference.slice(0, -1)) {
        return true;
      }
      
      // Standard completion
      if (currentValue.length === selectedReference.length && currentValue === selectedReference) {
        return true;
      }

      return false;
    };

    if (checkCompletion(newValue)) {
      setIsComplete(true);
      const baseTime = Math.floor((Date.now() - (window.startTime || Date.now())) / 1000);
      setCompletionTime(baseTime);
      savePersonalBestTime(selectedReference, baseTime, easyMode, referenceExposed, ghostTextEnabled);
      
      // If in Stack Study mode, move to next card or completion
      if (step === 4) {
        // Logic to advance in StackStudyPage will handle this
      } else {
         setStep(5); // Go to standard completion page
      }
    }
  }, [selectedReference, easyMode, referenceExposed, ghostTextEnabled, step]);

  // Reference selection handler
  const handleSelectReference = useCallback((text) => {
    const normalizedText = normalizeWhitespace(text);
    setSelectedReference(normalizedText);
    setUserInput('');
    setIsComplete(false);
    setReferenceExposed(false);
    window.startTime = null;
    localStorage.setItem('timePenalty', '0');
    setStep(2);
  }, []);

  // Stack study handler
  const handleStudyStack = useCallback((stackId) => {
    setStudyStackId(stackId);
    setSelectedReference('');
    setUserInput('');
    setIsComplete(false);
    setReferenceExposed(false);
    window.startTime = null;
    localStorage.setItem('timePenalty', '0');
    setStep(4);
  }, []);

  // Start typing handler
  const handleStartTyping = useCallback(() => {
    setUserInput('');
    setIsComplete(false);
    setReferenceExposed(false);
    window.startTime = Date.now();
    localStorage.setItem('timePenalty', '0');
    setStep(3);
  }, []);

  // Return to menu handler
  const handleReturnToMenu = useCallback(() => {
    setStep(1);
    setIsComplete(false);
    setUserInput('');
    setSelectedReference('');
    setReferenceExposed(false);
    setStudyStackId(null);
    localStorage.setItem('timePenalty', '0');
  }, []);

  // Return to confirmation handler
  const handleReturnToConfirmation = useCallback(() => {
    setUserInput('');
    setIsComplete(false);
    setReferenceExposed(false);
    window.startTime = null;
    localStorage.setItem('timePenalty', '0');
    setStep(2);
  }, []);

  // Exit stack study handler
  const handleExitStackStudy = useCallback(() => {
    setStep(1);
    setStudyStackId(null);
    setSelectedReference('');
    setUserInput('');
    setIsComplete(false);
  }, []);

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
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300 leather-background ${darkMode ? 'dark' : ''}`}>
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button 
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors duration-300 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/60 text-indigo-300' : 'bg-white/50 hover:bg-white/70 text-indigo-600 shadow-sm'}`}
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
      <AnimatePresence mode='wait'>
        {step === 0 && (
          <motion.div key="tutorial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TutorialGuide onComplete={() => {
              savePreference('tutorialComplete', true);
              setStep(1);
            }} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <GlobalStyles />
            <h1 className="text-5xl font-bold mb-10 leather-title py-2 text-center">
              Memory Whole
            </h1>
            <div className="w-full max-w-2xl min-h-[65vh] relative stitched-border paper-background p-8 overflow-y-auto">
              <HomePage 
                cards={cards} 
                onSelectReference={handleSelectReference}
                onCreateCard={() => editCard({})}
                onEditCard={editCard}
                onDeleteCard={deleteCard}
                editingCard={editingCard}
                onUpdateCard={updateCard}
                onCreateNewCard={createCard}
                onCancelEdit={cancelEditCard}
                stacks={stacks}
                editingStack={editingStack}
                onCreateStack={() => editStack({})}
                onEditStack={editStack}
                onDeleteStack={deleteStack}
                onUpdateStack={updateStack}
                onCreateNewStack={createStack}
                onCancelEditStack={cancelEditStack}
                onStudyStack={handleStudyStack}
              />
            </div>
          </motion.div>
        )}
        {step === 2 && selectedReference && (
          <motion.div key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <GlobalStyles />
            <h1 className="text-5xl font-bold mb-10 leather-title py-2 text-center">
              Memory Whole
            </h1>
            <div className="w-full max-w-2xl min-h-[65vh] relative stitched-border paper-background p-8">
              <ReferenceConfirmation 
                referenceText={selectedReference} 
                onConfirm={handleStartTyping}
                onBack={handleReturnToMenu} 
              />
            </div>
          </motion.div>
        )}
        {step === 3 && selectedReference && (
          <motion.div key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <GlobalStyles />
            <h1 className="text-5xl font-bold mb-10 leather-title py-2 text-center">
              Memory Whole
            </h1>
            <div className="w-full max-w-2xl min-h-[65vh] relative stitched-border paper-background p-8">
              <ReferenceTyping 
                referenceText={selectedReference} 
                userInput={userInput} 
                onInputChange={handleInputChange} 
                easyMode={easyMode}
                ghostTextEnabled={ghostTextEnabled}
                showReferenceEnabled={showReferenceEnabled}
                onToggleShowReference={() => { 
                  setShowReferenceEnabled(prev => !prev);
                  setReferenceExposed(true);
                }}
                inputError={inputError}
                onBack={handleReturnToConfirmation}
              />
            </div>
          </motion.div>
        )}
        {step === 4 && studyStackId && (
          <motion.div key="stack-study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <GlobalStyles />
            <h1 className="text-5xl font-bold mb-10 leather-title py-2 text-center">
              Memory Whole - Stack Study
            </h1>
            <div className="w-full max-w-2xl min-h-[65vh] relative stitched-border paper-background p-8">
              <StackStudyPage
                stackId={studyStackId}
                getStackById={getStackById}
                getCardsByStackId={getCardsByStackId}
                onExit={handleExitStackStudy}
                easyMode={easyMode}
                ghostTextEnabled={ghostTextEnabled}
                showReferenceEnabled={showReferenceEnabled}
                onToggleShowReference={() => { 
                  setShowReferenceEnabled(prev => !prev);
                }}
              />
            </div>
          </motion.div>
        )}
        {step === 5 && isComplete && (
          <motion.div key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <GlobalStyles />
            <h1 className="text-5xl font-bold mb-10 leather-title py-2 text-center">
              Memory Whole
            </h1>
            <div className="w-full max-w-2xl min-h-[65vh] relative stitched-border paper-background p-8">
              <CompletionPage 
                referenceText={selectedReference} 
                completionTime={completionTime} 
                onTryAgain={handleReturnToConfirmation}
                onReturnToMenu={handleReturnToMenu}
                easyMode={easyMode}
              />
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
