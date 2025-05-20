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
      <div className="overflow-y-auto h-[calc(70vh-70px)] pr-2">
        <div className="sticky top-0 z-20 note-paper py-4 px-4 mx-0 shadow-sm mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center flex-grow">
            {`Create New Card in "${selectedDeck ? selectedDeck.title : 'Deck'}"`}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleBatchUpload}
              className="leather-button px-4 py-2"
              title="Upload multiple cards from JSON"
            >
              Batch Upload
            </button>
            <button 
              onClick={handleCancelCreate}
              className="px-4 py-2 leather-button rounded-lg transition-all duration-300"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
              placeholder="Card Content"
            ></textarea>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="leather-button font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
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

export default HomePage;