import React, { createContext, useContext, useState, useEffect } from 'react';
import useCardCollection from '../hooks/useCardCollection';
import useDeckCollection from '../hooks/useDeckCollection';
import { loadPreference, savePreference } from '../utils/memoryUtils';

// Create context
const AppStateContext = createContext();

// Custom hook to use the app state
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

// Provider component
export function AppStateProvider({ children }) {
  // Card collection state
  const cardCollection = useCardCollection();
  
  // Deck collection state
  const deckCollection = useDeckCollection();
  
  // App flow state
  const [step, setStep] = useState(0);
  const [selectedReference, setSelectedReference] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [referenceExposed, setReferenceExposed] = useState(false);
  const [inputError, setInputError] = useState(false);
  
  // Deck study mode state
  const [studyDeckId, setStudyDeckId] = useState(null);
  const [studyCardIds, setStudyCardIds] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeckStudyMode, setIsDeckStudyMode] = useState(false);
  const [deckStudyComplete, setDeckStudyComplete] = useState(false);
  const [deckCompletionTimes, setDeckCompletionTimes] = useState([]);
  
  // Set initial step based on tutorial completion
  useEffect(() => {
    const tutorialComplete = loadPreference('tutorialComplete', false);
    setStep(tutorialComplete ? 1 : 0);
  }, []);

  // Enhanced card operations that also update deck collection
  const enhancedCardOperations = {
    // Create card and add it to the deck
    createCard: (cardData) => {
      // Create the card in the card collection
      const newCard = cardCollection.createCard(cardData);
      
      // If the card is created and has a deckId, add it to the deck
      if (newCard && newCard.id && newCard.deckId) {
        deckCollection.addCardToDeck(newCard.deckId, newCard.id);
      }
      
      return newCard;
    },
    
    // Delete card and remove it from deck
    deleteCard: (cardId) => {
      // Get the card before deletion to know which deck it belongs to
      const cardToDelete = cardCollection.cards.find(card => card.id === cardId);
      
      // Delete the card from the card collection
      const success = cardCollection.deleteCard(cardId);
      
      // If deletion succeeded and the card had a deckId, remove it from the deck
      if (success && cardToDelete && cardToDelete.deckId) {
        deckCollection.removeCardFromDeck(cardToDelete.deckId, cardId);
      }
      
      return success;
    }
  };

  // Value object with all state and handlers
  const value = {
    // Card and deck state
    ...cardCollection,
    ...deckCollection,
    // Override card operations with enhanced versions
    ...enhancedCardOperations,
    
    // App flow state
    step,
    setStep,
    selectedReference,
    setSelectedReference,
    userInput, 
    setUserInput,
    isComplete,
    setIsComplete,
    completionTime,
    setCompletionTime,
    referenceExposed,
    setReferenceExposed,
    inputError,
    setInputError,
    
    // Deck study mode state
    studyDeckId,
    setStudyDeckId,
    studyCardIds,
    setStudyCardIds,
    currentCardIndex,
    setCurrentCardIndex,
    isDeckStudyMode,
    setIsDeckStudyMode,
    deckStudyComplete,
    setDeckStudyComplete,
    deckCompletionTimes,
    setDeckCompletionTimes,
    
    // Start deck study mode
    startDeckStudy: (deckId, cardIds) => {
      setStudyDeckId(deckId);
      setStudyCardIds(cardIds);
      setCurrentCardIndex(0);
      setIsDeckStudyMode(true);
      setDeckStudyComplete(false);
      setDeckCompletionTimes([]);
    },
    
    // Move to the next card in deck study mode
    nextStudyCard: (completedTime) => {
      setDeckCompletionTimes(prev => [...prev, completedTime]);
      setCurrentCardIndex(prev => prev + 1);
      setIsComplete(false);
      setUserInput('');
    },
    
    // Complete deck study mode
    completeDeckStudy: () => {
      setDeckStudyComplete(true);
      setIsDeckStudyMode(false);
    },
    
    // Exit deck study mode early
    exitDeckStudy: () => {
      setStudyDeckId(null);
      setStudyCardIds([]);
      setCurrentCardIndex(0);
      setIsDeckStudyMode(false);
      setDeckStudyComplete(false);
      // Note: we don't clear completionTimes to preserve records
    },
    
    // Tutorial completion
    completeTutorial: () => {
      savePreference('tutorialComplete', true);
      setStep(1);
    },
  };
  
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export default AppStateContext;