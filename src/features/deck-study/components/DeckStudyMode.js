import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../../contexts/AppStateContext';
import { ReferenceTyping } from '../../typing';

/**
 * DeckStudyMode component - handles sequential study of cards in a deck
 */
function DeckStudyMode({ 
  userInput,
  selectedReference,
  onInputChange, 
  onBack, 
  isComplete, 
  easyMode = false,
  onReferenceExposed,
  ghostTextEnabled = true,
  showReferenceEnabled = false,
  inputError,
  completionTime,
  loadNextStudyCard,
  beginNextCard
}) {
  const { 
    studyDeckId,
    studyCardIds,
    currentCardIndex,
    decks,
    nextStudyCard,
    completeDeckStudy
  } = useAppState();

  // Get current deck and card
  const currentDeck = decks.find(deck => deck.id === studyDeckId);
  const totalCards = studyCardIds.length;
  
  // Check if all cards are completed
  useEffect(() => {
    if (isComplete && currentCardIndex < studyCardIds.length - 1) {
      // Move to next card with the completion time
      nextStudyCard(completionTime);
      // Load the next card
      loadNextStudyCard();
      // Begin typing the next card
      beginNextCard();
    } else if (isComplete && currentCardIndex === studyCardIds.length - 1) {
      // All cards completed
      completeDeckStudy();
    }
  }, [isComplete, currentCardIndex, studyCardIds.length, completionTime, nextStudyCard, completeDeckStudy, loadNextStudyCard, beginNextCard]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full flex flex-col items-center"
    >
      <div className="w-full max-w-lg mb-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-700 dark:text-gray-300">
            <h2 className="text-lg font-semibold">{currentDeck ? currentDeck.title : 'Deck Study'}</h2>
            <p className="text-sm">
              Card {currentCardIndex + 1} of {totalCards}
            </p>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full">
            <span className="text-indigo-800 dark:text-indigo-200 text-sm font-medium">
              {Math.round((currentCardIndex / totalCards) * 100)}% Complete
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
          <div 
            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${(currentCardIndex / totalCards) * 100}%` }}
          ></div>
        </div>
      </div>

      <ReferenceTyping
        userInput={userInput}
        selectedReference={selectedReference}
        onInputChange={onInputChange}
        onBack={onBack}
        isComplete={isComplete}
        easyMode={easyMode}
        onReferenceExposed={onReferenceExposed}
        ghostTextEnabled={ghostTextEnabled}
        showReferenceEnabled={showReferenceEnabled}
        inputError={inputError}
      />
    </motion.div>
  );
}

export default DeckStudyMode;