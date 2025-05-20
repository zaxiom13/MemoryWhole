import { useState } from 'react';
import { useAppState } from '../../contexts/AppStateContext';

/**
 * Custom hook for managing home page data and state
 * @returns {Object} Home page state and handlers
 */
function useHomeData() {
  const {
    cards, 
    decks,
    editingCard,
    createCard,
    updateCard,
    deleteCard,
    editCard,
    cancelEdit,
    currentDeckId,
    setCurrentDeckId,
    editingDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    editDeck,
    cancelEdit: cancelEditDeck,
  } = useAppState();
  
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showDeckForm, setShowDeckForm] = useState(false);
  
  // Form submission handlers
  const handleCardSubmit = (formData) => {
    if (editingCard && editingCard.id) {
      updateCard({ ...editingCard, ...formData });
    } else {
      createCard(formData);
    }
    setShowCardForm(false);
  };
  
  const handleDeckSubmit = (formData) => {
    if (editingDeck && editingDeck.id) {
      updateDeck({ ...editingDeck, ...formData });
      setShowDeckForm(false);
    } else {
      // Create new deck and navigate to its cards view
      const newDeck = createDeck(formData);
      if (newDeck && newDeck.id) {
        setCurrentDeckId(newDeck.id);
      }
      setShowDeckForm(false);
    }
  };
  
  // UI state handlers
  const handleShowBatchUpload = () => {
    setShowBatchUpload(true);
    setShowCardForm(false);
  };
  
  const handleBatchCancel = () => {
    setShowBatchUpload(false);
    setShowCardForm(true);
  };
  
  const handleCreateCards = (cardsData) => {
    // Create multiple cards from the batch data
    cardsData.forEach(cardData => {
      createCard({ ...cardData, deckId: currentDeckId });
    });
    setShowBatchUpload(false);
    setShowCardForm(false);
  };
  
  const handleCreateCard = () => {
    setShowCardForm(true);
    setShowDeckForm(false);
  };
  
  const handleCreateDeck = () => {
    setShowDeckForm(true);
    setShowCardForm(false);
  };
  
  const handleCancelCreate = () => {
    setShowCardForm(false);
    cancelEdit();
  };
  
  const handleCancelCreateDeck = () => {
    setShowDeckForm(false);
    cancelEditDeck();
  };
  
  const handleSelectDeck = (deck) => {
    setCurrentDeckId(deck.id);
  };
  
  const handleBackToDeckList = () => {
    setCurrentDeckId(null);
  };
  
  return {
    // Data
    cards,
    decks,
    editingCard,
    editingDeck,
    currentDeckId,
    
    // UI state
    showBatchUpload,
    showCardForm,
    showDeckForm,
    
    // Card operations
    createCard,
    updateCard,
    deleteCard,
    editCard,
    cancelEdit,
    
    // Deck operations
    createDeck,
    updateDeck,
    deleteDeck,
    editDeck,
    cancelEditDeck,
    
    // Form handlers
    handleCardSubmit,
    handleDeckSubmit,
    
    // UI handlers
    handleShowBatchUpload,
    handleBatchCancel,
    handleCreateCards,
    handleCreateCard,
    handleCreateDeck,
    handleCancelCreate,
    handleCancelCreateDeck,
    handleSelectDeck,
    handleBackToDeckList,
    setCurrentDeckId
  };
}

export default useHomeData;