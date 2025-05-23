import React, { useState, useEffect } from 'react';

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
    // Scrollable div: Adjusted min-h for mobile
    <div className="overflow-y-auto min-h-[calc(50vh-60px)] sm:min-h-[calc(70vh-70px)] pr-2">
      {/* Sticky Header: Removed note-paper, added new bg and blur effect */}
      <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md shadow-sm py-4 px-4 mx-0 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center flex-grow">
          {card && card.id ? 'Edit Card' : `Create New Card in "${deck ? deck.title : 'Deck'}"` }
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="leather-button" // Removed custom padding
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
            className="leather-button" // Removed custom padding
          >
            {card && card.id ? 'Update Card' : 'Create Card'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CardForm;