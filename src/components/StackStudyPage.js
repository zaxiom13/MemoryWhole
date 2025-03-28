import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReferenceTyping from './ReferenceTyping'; // Reuse the typing component
import CompletionPage from './CompletionPage'; // Reuse completion page for the final step
import { normalizeWhitespace, savePersonalBestTime } from '../utils/memoryUtils';

function StackStudyPage({ 
  stackId,
  getStackById,
  getCardsByStackId,
  onExit,
  easyMode,
  ghostTextEnabled,
  showReferenceEnabled,
  onToggleShowReference // Pass this down if ReferenceTyping needs it directly
}) {
  const [stack, setStack] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [referenceExposed, setReferenceExposed] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [isStackComplete, setIsStackComplete] = useState(false);
  const [stackStats, setStackStats] = useState({
    totalTime: 0,
    cardsCompleted: 0,
    exposedCount: 0
  });

  // Load stack and cards
  useEffect(() => {
    const loadedStack = getStackById(stackId);
    const loadedCards = getCardsByStackId(stackId).sort((a, b) => a.createdAt - b.createdAt); // Sort by creation date (oldest first)
    setStack(loadedStack);
    setCards(loadedCards);
    setCurrentCardIndex(0); // Start at the first card
    setIsStackComplete(false); // Reset completion state
  }, [stackId, getStackById, getCardsByStackId]);

  const currentCard = cards[currentCardIndex];
  const currentReference = currentCard ? normalizeWhitespace(currentCard.text) : '';

  // Input change handler specific to stack study
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setUserInput(newValue);

    // Basic error check (can enhance)
    let isIncorrect = false;
    if (currentReference && newValue.length > 0) {
      const referenceSubstring = currentReference.substring(0, newValue.length);
      isIncorrect = newValue !== referenceSubstring;
    }
    setInputError(isIncorrect);
    if (isIncorrect) {
       setTimeout(() => setInputError(false), 500);
    }

    // Check for card completion
    const checkCompletion = (currentValue) => {
      if (!currentReference) return false;
      const lastCharRef = currentReference.charAt(currentReference.length - 1);
      const isPunctuation = /[.,?!]/.test(lastCharRef);
      if (easyMode && isPunctuation && 
          currentValue.length === currentReference.length - 1 && 
          currentValue === currentReference.slice(0, -1)) {
        return true;
      }
      if (currentValue.length === currentReference.length && currentValue === currentReference) {
        return true;
      }
      return false;
    };

    if (checkCompletion(newValue)) {
      const time = Math.floor((Date.now() - (window.cardStartTime || Date.now())) / 1000);
      setCompletionTime(time);
      setIsCardComplete(true);
      savePersonalBestTime(currentReference, time, easyMode, referenceExposed, ghostTextEnabled);
    }
  }, [currentReference, easyMode, referenceExposed, ghostTextEnabled]);

  // Start timing for the current card
  useEffect(() => {
    if (currentCard && !isCardComplete) {
      setUserInput('');
      setIsCardComplete(false);
      setReferenceExposed(false); // Reset exposure for each card
      window.cardStartTime = Date.now();
      localStorage.setItem('timePenalty', '0'); // Reset penalty for each card
    }
  }, [currentCardIndex, currentCard, isCardComplete]); // Depend on index and card

  const goToNextCard = useCallback(() => {
    // Update stats
    setStackStats(prev => ({
      totalTime: prev.totalTime + completionTime,
      cardsCompleted: prev.cardsCompleted + 1,
      exposedCount: prev.exposedCount + (referenceExposed ? 1 : 0)
    }));

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      setIsCardComplete(false);
      // Reset state handled by useEffect above
    } else {
      setIsStackComplete(true); // All cards completed
    }
  }, [currentCardIndex, cards.length, completionTime, referenceExposed]);

  const handleToggleShowReference = useCallback(() => {
    setReferenceExposed(true); // Mark as exposed if toggled
    onToggleShowReference(); // Call the App level toggle
  }, [onToggleShowReference]);

  // Render Logic
  if (!stack) {
    return <p>Loading stack...</p>; // Or some loading indicator
  }

  if (isStackComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-2xl mx-auto p-6"
      >
        <div className="leather-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Stack Complete! 🎉</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="note-paper p-4 rounded-lg">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stackStats.cardsCompleted}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cards Completed</p>
            </div>
            
            <div className="note-paper p-4 rounded-lg">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stackStats.totalTime}s</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
            </div>
            
            <div className="note-paper p-4 rounded-lg">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {stackStats.exposedCount > 0 ? 
                  `${Math.round((stackStats.exposedCount / stackStats.cardsCompleted) * 100)}%` : 
                  '0%'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">References Viewed</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => onExit(true, stackStats.totalTime)} 
              className="leather-button py-2 px-6 text-lg"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentCard) {
    return <p>No cards found in this stack.</p>;
  }

  return (
    <motion.div 
      key={currentCardIndex} // Change key to force re-render on card change
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 flex justify-between items-center"><h2 className="text-xl font-semibold">{stack.name} - Card {currentCardIndex + 1} of {cards.length}</h2><button onClick={() => onExit(false, 0)} className="leather-button text-sm px-3 py-1">Exit Stack</button></div>
      
      {!isCardComplete ? (
        <ReferenceTyping 
          referenceText={currentReference} 
          userInput={userInput} 
          onInputChange={handleInputChange} 
          easyMode={easyMode}
          ghostTextEnabled={ghostTextEnabled}
          showReferenceEnabled={showReferenceEnabled}
          onToggleShowReference={handleToggleShowReference} // Use wrapped handler
          inputError={inputError}
          onBack={onExit} // Simple exit for now, could add previous card later
          // Pass isComplete=false or remove if ReferenceTyping uses it for internal logic
        />
      ) : (
        // Simple completion message for the card
        <div className="text-center p-8"><h3 className="text-lg font-semibold mb-4">Card Complete!</h3><p className="mb-4">Time: {completionTime}s</p><button onClick={goToNextCard} className="leather-button py-2 px-6">{currentCardIndex < cards.length - 1 ? 'Next Card' : 'Finish Stack'}</button></div>
      )}
    </motion.div>
  );
}

export default StackStudyPage; 