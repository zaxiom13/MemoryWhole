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
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      setIsCardComplete(false);
      // Reset state handled by useEffect above
    } else {
      setIsStackComplete(true); // All cards completed
    }
  }, [currentCardIndex, cards.length]);

  const handleToggleShowReference = useCallback(() => {
    setReferenceExposed(true); // Mark as exposed if toggled
    onToggleShowReference(); // Call the App level toggle
  }, [onToggleShowReference]);

  // Render Logic
  if (!stack) {
    return <p>Loading stack...</p>; // Or some loading indicator
  }

  if (isStackComplete) {
    // You might want a dedicated stack completion summary here
    // For now, just reuse the generic CompletionPage idea but with an Exit button
    return (
       <div className="text-center"><h2 className="text-2xl font-semibold mb-4">Stack "{stack.name}" Complete!</h2><button onClick={onExit} className="leather-button py-2 px-6">Back to Menu</button></div>
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
      <div className="mb-4 flex justify-between items-center"><h2 className="text-xl font-semibold">{stack.name} - Card {currentCardIndex + 1} of {cards.length}</h2><button onClick={onExit} className="leather-button text-sm px-3 py-1">Exit Stack</button></div>
      
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