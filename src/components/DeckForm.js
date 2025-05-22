import { useState, useEffect } from 'react';

/**
 * Deck form component for creating/editing decks
 */
function DeckForm({ deck, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Initialize form data when deck changes
  useEffect(() => {
    if (deck) {
      setFormData({
        title: deck.title || '',
        description: deck.description || ''
      });
    } else {
      setFormData({ title: '', description: '' });
    }
  }, [deck]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Title is required!");
      return;
    }
    
    onSubmit(formData);
    setFormData({ title: '', description: '' });
  };

  return (
    // Main scrollable div: Adjusted min-h for mobile
    <div className="overflow-y-auto min-h-[calc(50vh-60px)] sm:min-h-[calc(70vh-70px)] pr-2">
      {/* Sticky Header: Removed note-paper, added new bg and blur effect */}
      <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md shadow-sm py-4 px-4 mx-0 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {deck && deck.id ? 'Edit Deck' : 'Create New Deck'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="leather-button" // Removed px-4 py-2 to use leather-button default padding
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
            placeholder="Deck Title"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            className="enhanced-textarea"
            placeholder="Deck Description"
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="leather-button" // Removed py-2 px-6 to use leather-button default padding
          >
            {deck && deck.id ? 'Update Deck' : 'Create Deck'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeckForm;