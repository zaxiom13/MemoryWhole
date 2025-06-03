import { useAppState } from '../../contexts/AppStateContext';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { isInputCorrect, isTypingComplete, handleCompletion } from '../../utils/typingUtils';
import { normalizeWhitespace } from '../../utils/memoryUtils';

/**
 * Custom hook for managing typing state and logic
 * @returns {Object} Typing state and handlers
 */
function useTyping() {
  const {
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
    setStep,
    // Deck study mode related
    isDeckStudyMode,
    studyCardIds,
    currentCardIndex,
    cards,
    startDeckStudy
  } = useAppState();
  
  const { easyMode, ghostTextEnabled } = useUserPreferences();
  
  // Input change handler
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUserInput(newValue);

    // Check if the input is correct and update error state
    const isIncorrect = !isInputCorrect(newValue, selectedReference);
    
    if (isIncorrect) {
      setInputError(true);
      setTimeout(() => setInputError(false), 500); // Match animation duration
    } else {
      setInputError(false); // Reset if correct or deleting
    }
    
    // Check if typing is complete
    if (isTypingComplete(newValue, selectedReference, easyMode)) {
      setIsComplete(true);
      const time = handleCompletion(
        selectedReference, 
        easyMode, 
        referenceExposed, 
        ghostTextEnabled
      );
      setCompletionTime(time);

      // If in deck study mode and not the last card, automatically load the next card
      if (isDeckStudyMode && currentCardIndex < studyCardIds.length - 1) {
        const nextCardId = studyCardIds[currentCardIndex + 1];
        const nextCard = cards.find(card => card.id === nextCardId);
        if (nextCard) {
          // We'll let the DeckStudyMode component handle the transition
          // via its useEffect that watches isComplete
        }
      }
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
  
  // Begin typing handler
  const handleBeginTyping = () => {
    setStep(3);
    setReferenceExposed(false); // Reset reference exposed flag
    window.startTime = Date.now();
    // Reset time penalty when beginning a new test
    localStorage.setItem('timePenalty', '0');
  };
  
  // Return to typing handler
  const handleRetryTyping = () => {
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
  
  // Start deck study mode
  const handleStartDeckStudy = (deck) => {
    // Get all cards for this deck
    const deckCards = cards.filter(card => deck.cardIds.includes(card.id));
    if (deckCards.length === 0) return;

    // Set up deck study mode
    const cardIds = deckCards.map(card => card.id);
    startDeckStudy(deck.id, cardIds);

    // Show preview step before selecting first card
    setStep(2);
  };

  // Begin deck study after preview
  const handleBeginDeckStudy = () => {
    if (studyCardIds.length === 0) return;
    const firstCard = cards.find(card => card.id === studyCardIds[0]);
    if (firstCard) {
      handleSelectReference(firstCard.text);
      handleBeginTyping();
    }
  };
  
  // Load the next card in deck study mode
  const loadNextStudyCard = () => {
    if (!isDeckStudyMode || currentCardIndex >= studyCardIds.length - 1) return;
    
    const nextCardId = studyCardIds[currentCardIndex + 1];
    const nextCard = cards.find(card => card.id === nextCardId);
    if (nextCard) {
      setUserInput('');
      setIsComplete(false);
      setReferenceExposed(false);
      window.startTime = Date.now();
      localStorage.setItem('timePenalty', '0');
      
      // Update the reference text
      const normalizedText = normalizeWhitespace(nextCard.text);
      setSelectedReference(normalizedText);
    }
  };
  
  return {
    userInput,
    selectedReference,
    isComplete,
    completionTime,
    inputError,
    handleInputChange,
    handleSelectReference,
    handleBeginTyping,
    handleRetryTyping,
    handleReturnToMenu,
    handleBeginDeckStudy,
    handleStartDeckStudy,
    loadNextStudyCard,
    beginNextCard: () => {
      // Reset state for the next card
      setUserInput('');
      setIsComplete(false);
      setReferenceExposed(false);
      window.startTime = Date.now();
      localStorage.setItem('timePenalty', '0');
    },
    onReferenceExposed: () => setReferenceExposed(true)
  };
}

export default useTyping;