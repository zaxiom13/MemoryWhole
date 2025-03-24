import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { formatDate } from '../utils/memoryUtils';
import Card from '../models/Card';
import BatchUploadPage from './BatchUploadPage';

/**
 * Card form component for creating/editing cards
 */
function CardForm({ card, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ title: '', text: '' });

  // Initialize form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        text: card.text || ''
      });
    } else {
      setFormData({ title: '', text: '' });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.text.trim()) {
      alert("Title and text are required!");
      return;
    }
    
    onSubmit(formData);
    setFormData({ title: '', text: '' });
  };

  return (
    <div className="overflow-y-auto h-[calc(70vh-70px)] pr-2">
      <div className="sticky top-0 z-20 note-paper py-4 px-4 mx-0 shadow-sm mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {card && card.id ? 'Edit Card' : 'Create New Card'}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 leather-button rounded-lg transition-all duration-300"
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
            value={formData.text}
            onChange={handleChange}
            rows="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
            placeholder="Card Content"
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="leather-button font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
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
      className="leather-card p-8 h-[280px] flex flex-col cursor-pointer relative group"
    >
      <div 
        className="absolute top-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(card)}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-full transition-all duration-300"
          title="Edit Card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this card?')) {
              onDelete(card.id);
            }
          }}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/40 p-2 rounded-full transition-all duration-300"
          title="Delete Card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <h3 className="text-1xl font-semibold mb-3 text-gray-800 dark:text-gray-100 pr-20 h-[3rem] overflow-hidden text-ellipsis whitespace-nowrap">
        {card.title}
      </h3>
      <div className="flex-grow note-paper p-4 rounded-xl mt-2 h-[12rem] overflow-hidden">
        <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 text-ellipsis overflow-hidden">
          {card instanceof Card ? card.getPreview() : card.text.split('\n')[0].substring(0, 30) + '...'}
        </p>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {` · Last modified: ${formatDate(card.updatedAt || card.createdAt)}`}
        </div>
        <button
          onClick={() => onSelect(card.text)}
          className="px-4 py-2 leather-button text-sm font-medium hover:scale-105 transform transition-transform duration-200"
        >
          Study
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Card list component
 */
function CardList({ cards, onSelectReference, onCreateCard, onEditCard, onDeleteCard }) {
  return (
    <>
      <div className="sticky top-0 z-20 note-paper py-4 px-4 mx-0 shadow-sm flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Choose a passage to practice your memory
        </h2>
        <div>
          <button 
            onClick={onCreateCard}
            className="p-2 leather-button rounded-full transition-all duration-300 flex items-center justify-center"
            title="Add New Card"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(70vh-120px)] pr-2">
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
      </div>
    </>
  );
}

/**
 * HomePage component
 */
function HomePage({ 
  cards, 
  onSelectReference, 
  onCreateCard, 
  onEditCard, 
  onDeleteCard,
  editingCard,
  onUpdateCard,
  onCreateNewCard,
  onCancelEdit
}) {
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  const handleFormSubmit = (formData) => {
    if (editingCard && editingCard.id) {
      onUpdateCard({ ...editingCard, ...formData });
    } else {
      onCreateNewCard(formData);
    }
    setShowCardForm(false);
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
      onCreateNewCard(cardData);
    });
    setShowBatchUpload(false);
    setShowCardForm(false);
  };

  const handleCreateCard = () => {
    setShowCardForm(true);
  };

  const handleCancelCreate = () => {
    setShowCardForm(false);
    onCancelEdit();
  };

  if (editingCard !== null) {
    return (
      <CardForm 
        card={editingCard} 
        onSubmit={handleFormSubmit}
        onCancel={onCancelEdit}
      />
    );
  }

  if (showBatchUpload) {
    return (
      <BatchUploadPage 
        onCreateCards={handleCreateCards}
        onCancel={handleBatchCancel}
      />
    );
  }

  if (showCardForm) {
    return (
      <div className="overflow-y-auto h-[calc(70vh-70px)] pr-2">
        <div className="sticky top-0 z-20 note-paper py-4 px-4 mx-0 shadow-sm mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Create New Card
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleBatchUpload}
              className="px-4 py-2 leather-button rounded-lg transition-all duration-300"
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
        
        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit({ title: e.target.title.value, text: e.target.text.value }); }} className="space-y-4">
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
          
          <div className="flex justify-end">
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

  return (
    <CardList
      cards={cards}
      onSelectReference={onSelectReference}
      onCreateCard={handleCreateCard}
      onEditCard={onEditCard}
      onDeleteCard={onDeleteCard}
    />
  );
}

export default HomePage;