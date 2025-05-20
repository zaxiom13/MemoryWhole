import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { formatDate, normalizeWhitespace } from '../utils/memoryUtils';
import Card from '../models/Card';
import BatchUploadPage from './BatchUploadPage';
import DeckList from './DeckList';
import DeckForm from './DeckForm';

/**
 * Card form component for creating/editing cards
 */
function CardForm({ card, deck, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ title: '', text: '', deckId: null });

  // Initialize form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        text: card.text || '',
        deckId: card.deckId || (deck ? deck.id : null)
      });
    } else if (deck) {
      setFormData({ title: '', text: '', deckId: deck.id });
    } else {
      setFormData({ title: '', text: '', deckId: null });
    }
  }, [card, deck]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.text.trim() || !formData.deckId) {
      alert("Title, text, and deck are required!");
      return;
    }
    
    onSubmit(formData);
    setFormData({ title: '', text: '', deckId: deck ? deck.id : null });
  };

  return (
    <div className="overflow-y-auto h-[calc(70vh-70px)] pr-2">
      <div className="sticky top-0 z-20 note-paper py-4 px-4 mx-0 shadow-sm mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center flex-grow">
          {card && card.id ? 'Edit Card' : `Create New Card in "${deck ? deck.title : 'Deck'}"` }
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={onCancel}
            className="leather-button px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="enhanced-input"
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
            value={formData.text}
            onChange={handleChange}
            rows="10"
            className="enhanced-textarea"
            placeholder="Card Content"
          ></textarea>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="leather-button py-2 px-6"
          >
            {card && card.id ? 'Update Card' : 'Create Card'}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Card item component
 */
function CardItem({ card, onSelect, onEdit, onDelete }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="leather-card p-8 h-[280px] flex flex-col cursor-pointer relative group hover:shadow-lg"
    >
      <div 
        className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(card)}
          className="leather-button p-2 rounded-full"
          title="Edit Card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this card?')) {
              onDelete(card.id);
            }
          }}
          className="leather-button p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40"
          title="Delete Card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-100 h-[3rem] w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {card.title}
      </h3>
      <div className="flex-grow note-paper p-4 rounded-xl mt-2 h-[12rem] overflow-hidden">
        <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 text-ellipsis overflow-hidden">
          {card instanceof Card ? card.getPreview() : normalizeWhitespace(card.text).substring(0, 70) + '...'}
        </p>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {` · Last modified: ${formatDate(card.updatedAt || card.createdAt)}`}
        </div>
        <button
          onClick={() => onSelect(normalizeWhitespace(card.text))}
          className="px-4 py-2 leather-button text-sm font-medium hover:scale-105 transform transition-transform duration-200"
        >
          Study
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Card list component for a specific deck
 */
function CardList({ deck, cards, onSelectReference, onCreateCard, onEditCard, onDeleteCard, onBackToDeckList }) {
  return (
    <>
      <div className="sticky top-0 z-20 note-paper py-4 px-4 mx-0 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBackToDeckList}
            className="leather-button p-2 rounded-full flex items-center justify-center"
            title="Back to Decks"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center flex-grow">
            {deck.title}: Choose a card to practice
          </h2>
        </div>
        <div>
          <button 
            onClick={onCreateCard}
            className="leather-button p-2 rounded-full flex items-center justify-center"
            title="Add New Card"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(70vh-120px)] pr-2">
        {cards.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center p-8">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">No cards in this deck yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first card to start practicing</p>
            <button 
              onClick={onCreateCard}
              className="leather-button py-2 px-6 text-lg flex items-center justify-center"
            >
              Create Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
            {cards.map((card) => (
              <CardItem 
                key={card.id}
                card={card}
                onSelect={onSelectReference}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

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
  onViewBestTimes
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
    />
  );
}

export default HomePage;