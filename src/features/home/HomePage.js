import React, { useState } from 'react';
import CardForm from './components/CardForm';
import CardList from './components/CardList';
import DeckList from '../../components/DeckList';
import DeckForm from '../../components/DeckForm';
import BatchUploadPage from '../../components/BatchUploadPage';

/**
 * HomePage component
 */
function HomePage({ 
  cards, 
  decks,
  currentDeckId,
  setCurrentDeckId,
  onSelectReference, 
  onCreateCard, 
  onEditCard, 
  onDeleteCard,
  editingCard,
  onUpdateCard,
  onCreateNewCard,
  onCancelEdit,
  onCreateDeck,
  onEditDeck,
  onDeleteDeck,
  editingDeck,
  onUpdateDeck,
  onCreateNewDeck,
  onCancelEditDeck,
  onViewBestTimes,
  onStartDeckStudy
}) {
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showDeckForm, setShowDeckForm] = useState(false);

  const handleFormSubmit = (formData) => {
    if (editingCard && editingCard.id) {
      onUpdateCard({ ...editingCard, ...formData });
    } else {
      onCreateNewCard(formData);
    }
    setShowCardForm(false);
  };

  const handleDeckFormSubmit = (formData) => {
    if (editingDeck && editingDeck.id) {
      onUpdateDeck({ ...editingDeck, ...formData });
      setShowDeckForm(false);
    } else {
      // Create new deck and navigate to its cards view
      const newDeck = onCreateNewDeck(formData);
      if (newDeck && newDeck.id) {
        setCurrentDeckId(newDeck.id); // Navigate to the cards view for the new deck
      }
      setShowDeckForm(false);
    }
  };

  const handleBatchUpload = () => {
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
      // Make sure each card has the current deck ID
      onCreateNewCard({ ...cardData, deckId: currentDeckId });
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
    onCancelEdit();
  };

  const handleCancelCreateDeck = () => {
    setShowDeckForm(false);
    onCancelEditDeck();
  };

  const handleSelectDeck = (deck) => {
    setCurrentDeckId(deck.id);
  };

  const handleBackToDeckList = () => {
    setCurrentDeckId(null);
  };

  // If editing a card, show card form
  if (editingCard !== null) {
    const deck = decks.find(d => d.id === editingCard.deckId) || null;
    return (
      <CardForm 
        card={editingCard} 
        deck={deck}
        onSubmit={handleFormSubmit}
        onCancel={onCancelEdit}
      />
    );
  }

  // If editing a deck, show deck form
  if (editingDeck !== null) {
    return (
      <DeckForm 
        deck={editingDeck} 
        onSubmit={handleDeckFormSubmit}
        onCancel={onCancelEditDeck}
      />
    );
  }

  // If batch uploading
  if (showBatchUpload) {
    return (
      <BatchUploadPage 
        onCreateCards={handleCreateCards}
        onCancel={handleBatchCancel}
      />
    );
  }

  // If creating a new card in a deck
  if (showCardForm && currentDeckId) {
    const selectedDeck = decks.find(d => d.id === currentDeckId) || null;
    return (
      // Scrollable div: Adjusted min-h for mobile
      <div className="overflow-y-auto min-h-[calc(50vh-60px)] sm:min-h-[calc(70vh-70px)] pr-2">
        {/* Sticky Header: Removed note-paper, added new bg and blur effect */}
        <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md shadow-sm py-4 px-4 mx-0 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center flex-grow">
            {`Create New Card in "${selectedDeck ? selectedDeck.title : 'Deck'}"`}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleBatchUpload}
              className="leather-button" // Removed custom padding
              title="Upload multiple cards from JSON"
            >
              Batch Upload
            </button>
            <button
              onClick={handleCancelCreate}
              className="leather-button" // Removed custom padding & redundant classes
            >
              Cancel
            </button>
          </div>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit({
            title: e.target.title.value,
            text: e.target.text.value,
            deckId: currentDeckId
          });
        }} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="enhanced-input" // Applied enhanced-input
              placeholder="Card Title"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="text">
              Text
            </label>
            <textarea
              id="text"
              name="text"
              rows="10"
              className="enhanced-textarea" // Applied enhanced-textarea
              placeholder="Card Content"
            ></textarea>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="leather-button" // Removed custom padding & redundant classes
            >
              Create Card
            </button>
          </div>
        </form>
      </div>
    );
  }

  // If creating a new deck
  if (showDeckForm) {
    return (
      <DeckForm 
        deck={null} 
        onSubmit={handleDeckFormSubmit}
        onCancel={handleCancelCreateDeck}
      />
    );
  }

  // If a deck is selected, show its cards
  if (currentDeckId) {
    const selectedDeck = decks.find(d => d.id === currentDeckId) || null;
    if (!selectedDeck) return null;

    return (
      <CardList
        deck={selectedDeck}
        cards={cards}
        onSelectReference={onSelectReference}
        onCreateCard={handleCreateCard}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
        onBackToDeckList={handleBackToDeckList}
        onStudyAllCards={onStartDeckStudy}
      />
    );
  }

  // Default: show deck list
  return (
    <DeckList
      decks={decks}
      onSelectDeck={handleSelectDeck}
      onCreateDeck={handleCreateDeck}
      onEditDeck={onEditDeck}
      onDeleteDeck={onDeleteDeck}
      onViewBestTimes={onViewBestTimes}
      onStudyDeck={onStartDeckStudy}
    />
  );
}

export default HomePage;