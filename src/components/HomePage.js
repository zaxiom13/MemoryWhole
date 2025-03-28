import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { formatDate, normalizeWhitespace } from '../utils/memoryUtils';
import Card from '../models/Card';
import Stack from '../models/Stack';
import BatchUploadPage from './BatchUploadPage';

/**
 * Card form component for creating/editing cards
 */
function CardForm({ card, onSubmit, onCancel, stacks }) {
  const [formData, setFormData] = useState({ title: '', text: '', stackId: null });
  
  // Determine if we're adding a card to a specific stack
  const isAddingToStack = card && !card.id && card.stackId !== undefined && card.stackId !== null;
  
  // Get the stack name if needed
  const stackName = useMemo(() => {
    if (isAddingToStack && stacks) {
      const stack = stacks.find(s => s.id === card.stackId);
      return stack ? stack.name : '';
    }
    return '';
  }, [isAddingToStack, card, stacks]);

  // Initialize form data when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        text: card.text || '',
        stackId: card.stackId === undefined ? null : card.stackId
      });
    } else {
      setFormData({ title: '', text: '', stackId: null });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'stackId' ? (value === '' ? null : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.text.trim()) {
      alert("Title and text are required!");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="overflow-y-auto h-[calc(65vh-70px)]">
      <div className="sticky top-0 z-20 note-paper py-3 px-4 mx-0 shadow-sm mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {card && card.id ? 'Edit Card' : 
            (isAddingToStack ? `Add Card to "${stackName}"` : 'Create New Card')}
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
        
        {!isAddingToStack && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="stackId">
              Stack (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <select
                id="stackId"
                name="stackId"
                value={formData.stackId === null ? '' : formData.stackId}
                onChange={handleChange}
                className="enhanced-input flex-grow"
              >
                <option value="">-- Unassigned --</option>
                {stacks && stacks.map(stack => (
                  <option key={stack.id} value={stack.id}>
                    {stack.name}
                  </option>
                ))}
              </select>
              {formData.stackId === null && (
                <span className="text-xs text-indigo-600 dark:text-indigo-400 italic">
                  Card will appear in 'Unassigned'
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="leather-button py-2 px-6"
          >
            {card && card.id ? 'Update Card' : 
              (isAddingToStack ? 'Add to Stack' : 'Create Card')}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Card item component
 */
function CardItem({ card, onSelect, onEdit, onDelete, stackName, stacks, onUpdateCard }) {
  const [showStackMenu, setShowStackMenu] = useState(false);

  const handleStackChange = (stackId) => {
    // If stackId is "unassign", set to null, otherwise parse as number
    const newStackId = stackId === "unassign" ? null : Number(stackId);
    onUpdateCard({ ...card, stackId: newStackId });
    setShowStackMenu(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`leather-card p-6 h-[320px] flex flex-col cursor-pointer relative group hover:shadow-lg ${!stackName ? 'border-l-4 border-gray-300 dark:border-gray-600' : ''}`}
    >
      <div 
        className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={() => setShowStackMenu(!showStackMenu)}
            className="p-2 rounded-full transition-colors duration-200 bg-white/50 hover:bg-white/80 dark:bg-gray-700/50 dark:hover:bg-gray-600/70"
            title="Stack Options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
          
          {showStackMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Move to Stack
                </div>
                <button 
                  onClick={() => handleStackChange("unassign")} 
                  className={`block w-full text-left px-4 py-2 text-sm ${!card.stackId ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  Unassigned
                </button>
                
                {stacks && stacks.map(stack => (
                  <button 
                    key={stack.id} 
                    onClick={() => handleStackChange(stack.id)}
                    className={`block w-full text-left px-4 py-2 text-sm ${card.stackId === stack.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {stack.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={() => onEdit(card)}
          className="p-2 rounded-full transition-colors duration-200 bg-white/50 hover:bg-white/80 dark:bg-gray-700/50 dark:hover:bg-gray-600/70"
          title="Edit Card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this card?')) {
              onDelete(card.id);
            }
          }}
          className="p-2 rounded-full transition-colors duration-200 bg-white/50 hover:bg-red-100/80 dark:bg-gray-700/50 dark:hover:bg-red-900/50"
          title="Delete Card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 overflow-hidden text-ellipsis whitespace-nowrap pr-12">
        {card.title}
      </h3>
      {stackName && (
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 rounded px-2 py-0.5 mb-2 self-start">
          {stackName}
        </span>
      )}
      <div className={`flex-grow note-paper p-4 rounded-lg mt-1 overflow-hidden ${stackName ? 'h-[calc(12rem-1.5rem)]': 'h-[12rem]'}`}>
        <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300 text-ellipsis overflow-hidden">
          {card instanceof Card ? card.getPreview(80) : normalizeWhitespace(card.text).substring(0, 80) + '...'}
        </p>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {`Modified: ${formatDate(card.updatedAt || card.createdAt)}`}
        </div>
        <button
          onClick={() => onSelect(normalizeWhitespace(card.text))}
          className="px-4 py-1.5 leather-button text-sm font-medium"
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
function CardList({ cards, onSelectReference, onCreateCard, onEditCard, onDeleteCard, onUpdateCard, stacks, filterStackId, onFilterChange }) {
  const getStackName = useCallback((stackId) => {
    if (!stackId || !stacks) return null;
    const stack = stacks.find(s => s.id === stackId);
    return stack ? stack.name : null;
  }, [stacks]);

  return (
    <>
      <div className="sticky top-0 z-20 note-paper py-3 px-4 mx-0 shadow-sm flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {filterStackId === 'none' ? 'Unassigned Passages' : 
           (filterStackId ? `Passages in "${stacks.find(s => s.id === filterStackId)?.name}"` : 'All Passages')}
        </h2>
        <div className="flex items-center space-x-2">
          <select
            value={filterStackId === null ? 'all' : (filterStackId === 'none' ? 'none' : filterStackId)}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange(value === 'all' ? null : (value === 'none' ? 'none' : Number(value)));
            }}
            className="enhanced-input text-sm py-1 px-2 mr-2 w-40"
          >
            <option value="all">All Stacks</option>
            <option value="none">Unassigned</option>
            {stacks && stacks.map(stack => (
              <option key={stack.id} value={stack.id}>
                {stack.name}
              </option>
            ))}
          </select>
          <button 
            onClick={onCreateCard}
            className="p-2 rounded-full transition-colors duration-200 bg-white/50 hover:bg-white/80 dark:bg-gray-700/50 dark:hover:bg-gray-600/70"
            title="Add New Card"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(65vh-100px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
          {cards.map((card) => (
            <CardItem 
              key={card.id}
              card={card}
              onSelect={onSelectReference}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              stackName={getStackName(card.stackId)}
              stacks={stacks}
              onUpdateCard={onUpdateCard}
            />
          ))}
          {cards.length === 0 && (
            <div className="md:col-span-2 py-8">
              <div className="leather-card p-8 flex flex-col items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 dark:text-indigo-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                
                {filterStackId === null ? (
                  <>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      You haven't created any passages yet. Create your first one to start memorizing.
                    </p>
                    <button 
                      onClick={onCreateCard}
                      className="leather-button py-2 px-6 flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create First Passage</span>
                    </button>
                  </>
                ) : filterStackId === 'none' ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    No unassigned passages found. All your passages have been organized into stacks.
                  </p>
                ) : (
                  <>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      No passages found in this stack. Add some to start studying.
                    </p>
                    <button 
                      onClick={onCreateCard}
                      className="leather-button py-2 px-6 flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create New Passage</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Stack form component for creating/editing stacks
 */
function StackForm({ stack, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (stack) {
      setFormData({
        name: stack.name || '',
        description: stack.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [stack]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Stack name is required!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="overflow-y-auto h-[calc(65vh-70px)]">
      <div className="sticky top-0 z-20 note-paper py-3 px-4 mx-0 shadow-sm mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {stack && stack.id ? 'Edit Stack' : 'Create New Stack'}
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
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="stack-name">
            Stack Name
          </label>
          <input
            type="text"
            id="stack-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="enhanced-input"
            placeholder="Enter stack name"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="stack-description">
            Description (Optional)
          </label>
          <textarea
            id="stack-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="enhanced-textarea"
            placeholder="Enter stack description"
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="leather-button py-2 px-6"
          >
            {stack && stack.id ? 'Update Stack' : 'Create Stack'}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Stack item component
 */
function StackItem({ stack, onEdit, onDelete, onStudy, cardsCount }) {
  // Format the timestamp to a readable date
  const formatLastStudied = (timestamp) => {
    if (!timestamp) return 'Never studied';
    const date = new Date(timestamp);
    return `Last studied: ${date.toLocaleDateString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="leather-card p-5 group"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {stack.name}
          </h3>
          {stack.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {stack.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onStudy(stack.id)}
            className="p-2 rounded-full transition-colors duration-200 bg-white/50 hover:bg-indigo-100/80 dark:bg-gray-700/50 dark:hover:bg-indigo-900/50"
            title="Study Stack"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(stack)}
            className="p-2 rounded-full transition-colors duration-200 bg-white/50 hover:bg-white/80 dark:bg-gray-700/50 dark:hover:bg-gray-600/70"
            title="Edit Stack"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete the stack "${stack.name}"? This will NOT delete the cards inside.`)) {
                onDelete(stack.id);
              }
            }}
            className="p-2 rounded-full transition-colors duration-200 bg-white/50 hover:bg-red-100/80 dark:bg-gray-700/50 dark:hover:bg-red-900/50"
            title="Delete Stack"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex space-x-3">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {cardsCount} {cardsCount === 1 ? 'card' : 'cards'}
          </span>
          
          {stack.completedSessions > 0 && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {stack.completedSessions} {stack.completedSessions === 1 ? 'session' : 'sessions'}
            </span>
          )}
        </div>
        
        <span className="italic">
          {formatLastStudied(stack.lastStudied)}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Stack list component
 */
function StackList({ stacks, onShowStackForm, onEditStack, onDeleteStack, onStudyStack, getCardsByStackId }) {
  // Calculate card count for each stack
  const getStackCardsCount = (stackId) => {
    const cards = getCardsByStackId(stackId);
    return cards.length;
  };

  return (
    <>
      <div className="sticky top-0 z-20 note-paper py-3 px-4 mx-0 shadow-sm flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Stacks
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onShowStackForm}
            className="p-2 rounded-full transition-colors duration-200 bg-white/50 hover:bg-white/80 dark:bg-gray-700/50 dark:hover:bg-gray-600/70"
            title="Add New Stack"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(65vh-100px)]">
        <div className="space-y-4 mt-6">
          {stacks.length > 0 ? (
            stacks.map((stack) => (
              <StackItem 
                key={stack.id}
                stack={stack}
                onEdit={onEditStack}
                onDelete={onDeleteStack}
                onStudy={onStudyStack}
                cardsCount={getStackCardsCount(stack.id)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="leather-card p-8 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 dark:text-indigo-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Organize your passages into stacks for better organization and focused study sessions.
                </p>
                <button 
                  onClick={onShowStackForm}
                  className="leather-button py-2 px-6 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Your First Stack</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Component for managing cards in a newly created stack
 */
function StackCardsView({ stack, stackCards, availableCards, onAddCard, onRemoveCard, onCreateCard, onFinish }) {
  return (
    <div className="overflow-y-auto h-[calc(65vh-70px)]">
      <div className="sticky top-0 z-20 note-paper py-3 px-4 mx-0 shadow-sm mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Set Up Stack: {stack?.name}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={onFinish}
            className="leather-button px-4 py-2"
          >
            Finish Setup
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
          Cards in This Stack
        </h3>
        {stackCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stackCards.map(card => (
              <div key={card.id} className="leather-card p-4 flex justify-between items-center">
                <div className="truncate mr-2">
                  <p className="font-medium">{card.title}</p>
                </div>
                <button
                  onClick={() => onRemoveCard(card)}
                  className="p-1.5 rounded-full bg-white/50 hover:bg-red-100 dark:bg-gray-700/50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                  title="Remove from stack"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="note-paper p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              This stack is empty. Add cards below or create new ones.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Available Cards
        </h3>
        <button
          onClick={onCreateCard}
          className="leather-button py-1.5 px-4 flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Card
        </button>
      </div>
      
      {availableCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCards.map(card => (
            <div key={card.id} className="leather-card p-4 flex justify-between items-center opacity-70 hover:opacity-100">
              <div className="truncate mr-2">
                <p className="font-medium">{card.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {card.text?.substring(0, 60)}...
                </p>
              </div>
              <button
                onClick={() => onAddCard(card)}
                className="p-1.5 rounded-full bg-white/50 hover:bg-green-100 dark:bg-gray-700/50 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400"
                title="Add to stack"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="note-paper p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No more cards available to add. Create new cards to add to this stack.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * HomePage component
 */
function HomePage({ 
  cards, 
  onSelectReference, 
  onEditCard, 
  onDeleteCard,
  editingCard,
  onUpdateCard,
  onCreateNewCard,
  onCancelEdit,

  // Stack Props
  stacks,
  editingStack,
  onShowStackForm,
  onEditStack,
  onDeleteStack,
  onUpdateStack,
  onCreateStack,
  onCancelEditStack,
  onStudyStack,
  getCardsByStackId
}) {
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [filterStackId, setFilterStackId] = useState(null);
  const [newStackId, setNewStackId] = useState(null); // Track newly created stack

  useEffect(() => {
    if (editingCard) {
      setViewMode('card-form');
      setShowBatchUpload(false);
    } else if (editingStack) {
      setViewMode('stack-form');
      setShowBatchUpload(false);
    }
  }, [editingCard, editingStack]);

  const handleCardFormSubmit = useCallback((formData) => {
    if (editingCard && editingCard.id) {
      onUpdateCard({ ...editingCard, ...formData });
    } else {
      onCreateNewCard(formData);
    }
    
    // If we were adding a card to a new stack, stay in the same view
    if (newStackId && formData.stackId === newStackId) {
      // Don't change view mode, just clear the editingCard
      onCancelEdit();
      return;
    }
    
    setViewMode('cards');
  }, [editingCard, onUpdateCard, onCreateNewCard, newStackId, onCancelEdit]);

  const handleStackFormSubmit = useCallback((formData) => {
    if (editingStack && editingStack.id) {
      onUpdateStack({ ...editingStack, ...formData });
      setViewMode('stacks');
    } else {
      // Create a new stack
      const newStack = onCreateStack(formData);
      setNewStackId(newStack.id);
      // Switch to stack cards view for the new stack
      setViewMode('stack-cards');
    }
  }, [editingStack, onUpdateStack, onCreateStack]);

  const showCardList = useCallback(() => {
    setViewMode('cards');
    onCancelEdit();
    onCancelEditStack();
    setShowBatchUpload(false);
    setNewStackId(null);
  }, [onCancelEdit, onCancelEditStack]);

  const showStackList = useCallback(() => {
    setViewMode('stacks');
    onCancelEdit();
    onCancelEditStack();
    setShowBatchUpload(false);
    setNewStackId(null);
  }, [onCancelEdit, onCancelEditStack]);

  const handleCreateNewCardClick = useCallback((initialStackId = null) => {
    // Initialize with a stack ID if provided
    onEditCard({ stackId: initialStackId });
  }, [onEditCard]);

  const handleCreateNewStackClick = useCallback(() => {
    onShowStackForm();
  }, [onShowStackForm]);
  
  // Handler for finishing stack setup
  const handleFinishStackSetup = useCallback(() => {
    setNewStackId(null);
    setViewMode('stacks');
  }, []);

  const handleCancelCardForm = useCallback(() => {
    onCancelEdit();
    
    // If we're setting up a new stack, go back to the stack cards view
    if (newStackId) {
      setViewMode('stack-cards');
    } else {
      setViewMode('cards');
    }
  }, [onCancelEdit, newStackId]);

  const handleCancelStackForm = useCallback(() => {
    onCancelEditStack();
    setViewMode('stacks');
  }, [onCancelEditStack]);

  const handleBatchUploadClick = () => {
    setShowBatchUpload(true);
    setViewMode('cards');
    onCancelEdit();
    onCancelEditStack();
  };

  const handleBatchCancel = () => {
    setShowBatchUpload(false);
  };

  const handleCreateCardsFromBatch = (cardsData) => {
    cardsData.forEach(cardData => {
      onCreateNewCard(cardData);
    });
    setShowBatchUpload(false);
    setViewMode('cards');
  };

  const filteredCards = useMemo(() => {
    if (filterStackId === null) {
      return cards;
    }
    if (filterStackId === 'none') {
      return cards.filter(card => card.stackId === null);
    }
    return cards.filter(card => card.stackId === filterStackId);
  }, [cards, filterStackId]);

  // Cards that can be added to the stack (cards not already in this stack)
  const availableCards = useMemo(() => {
    if (!newStackId) return [];
    return cards.filter(card => card.stackId !== newStackId);
  }, [cards, newStackId]);

  // For showing which cards are in the current new stack
  const stackCards = useMemo(() => {
    if (!newStackId) return [];
    return cards.filter(card => card.stackId === newStackId);
  }, [cards, newStackId]);

  const renderContent = () => {
    if (showBatchUpload) {
      return (
        <BatchUploadPage 
          onUpload={handleCreateCardsFromBatch}
          onCancel={handleBatchCancel}
        />
      );
    }

    switch (viewMode) {
      case 'card-form':
        return (
          <CardForm 
            key={editingCard?.id || 'new-card'}
            card={editingCard} 
            onSubmit={handleCardFormSubmit} 
            onCancel={handleCancelCardForm} 
            stacks={stacks}
          />
        );
      case 'stack-form':
        return (
          <StackForm 
            key={editingStack?.id || 'new-stack'}
            stack={editingStack} 
            onSubmit={handleStackFormSubmit} 
            onCancel={handleCancelStackForm} 
          />
        );
      case 'stack-cards':
        // This is the new view for managing stack cards
        return (
          <StackCardsView
            stack={stacks.find(s => s.id === newStackId)}
            stackCards={stackCards}
            availableCards={availableCards}
            onAddCard={(card) => onUpdateCard({...card, stackId: newStackId})}
            onRemoveCard={(card) => onUpdateCard({...card, stackId: null})}
            onCreateCard={() => handleCreateNewCardClick(newStackId)}
            onFinish={handleFinishStackSetup}
          />
        );
      case 'stacks':
        return (
          <StackList 
            stacks={stacks} 
            onShowStackForm={handleCreateNewStackClick} 
            onEditStack={onEditStack}
            onDeleteStack={onDeleteStack}
            onStudyStack={onStudyStack}
            getCardsByStackId={getCardsByStackId}
          />
        );
      case 'cards':
      default:
        return (
          <CardList 
            cards={filteredCards}
            onSelectReference={onSelectReference} 
            onCreateCard={handleCreateNewCardClick}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
            onUpdateCard={onUpdateCard}
            stacks={stacks}
            filterStackId={filterStackId}
            onFilterChange={setFilterStackId}
          />
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mb-6 flex justify-center space-x-4">
        <button 
          onClick={showCardList}
          className={`py-2 px-4 rounded-md transition-colors ${(viewMode === 'cards' || viewMode === 'card-form' || viewMode === 'stack-cards') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          Cards
        </button>
        <button 
          onClick={showStackList}
          className={`py-2 px-4 rounded-md transition-colors ${viewMode === 'stacks' || viewMode === 'stack-form' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          Stacks
        </button>
      </div>

      {renderContent()} 
    </motion.div>
  );
}

export default HomePage;