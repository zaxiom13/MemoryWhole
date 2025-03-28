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
          {card && card.id ? 'Edit Card' : 'Create New Card'}
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
        
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="stackId">
            Stack (Optional)
          </label>
          <select
            id="stackId"
            name="stackId"
            value={formData.stackId === null ? '' : formData.stackId}
            onChange={handleChange}
            className="enhanced-input"
          >
            <option value="">-- No Stack --</option>
            {stacks && stacks.map(stack => (
              <option key={stack.id} value={stack.id}>
                {stack.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end">
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
function CardItem({ card, onSelect, onEdit, onDelete, stackName }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="leather-card p-6 h-[320px] flex flex-col cursor-pointer relative group hover:shadow-lg"
    >
      <div 
        className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
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
function CardList({ cards, onSelectReference, onCreateCard, onEditCard, onDeleteCard, stacks, filterStackId, onFilterChange }) {
  const getStackName = useCallback((stackId) => {
    if (!stackId || !stacks) return null;
    const stack = stacks.find(s => s.id === stackId);
    return stack ? stack.name : null;
  }, [stacks]);

  return (
    <>
      <div className="sticky top-0 z-20 note-paper py-3 px-4 mx-0 shadow-sm flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Passages
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
            />
          ))}
          {cards.length === 0 && (
             <p className="text-center text-gray-500 dark:text-gray-400 italic mt-8 md:col-span-2">
               {filterStackId === null ? 'No passages created yet.' : 'No passages found in this stack.'}
             </p>
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
  const [name, setName] = useState('');

  useEffect(() => {
    if (stack) {
      setName(stack.name || '');
    } else {
      setName('');
    }
  }, [stack]);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Stack name is required!");
      return;
    }
    onSubmit({ name });
    setName('');
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
            value={name}
            onChange={handleChange}
            className="enhanced-input"
            placeholder="Enter stack name"
            required
          />
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
function StackItem({ stack, onEdit, onDelete, onStudy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="leather-card p-4 flex justify-between items-center group"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {stack.name}
      </h3>
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
    </motion.div>
  );
}

/**
 * Stack list component
 */
function StackList({ stacks, onCreateStack, onEditStack, onDeleteStack, onStudyStack }) {
  return (
    <>
      <div className="sticky top-0 z-20 note-paper py-3 px-4 mx-0 shadow-sm flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Stacks
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onCreateStack}
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
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 italic mt-8">
              No stacks created yet. Click the '+' button to add one.
            </p>
          )}
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
  onEditCard, 
  onDeleteCard,
  editingCard,
  onUpdateCard,
  onCreateNewCard,
  onCancelEdit,

  // Stack Props
  stacks,
  editingStack,
  onCreateStack,
  onEditStack,
  onDeleteStack,
  onUpdateStack,
  onCancelEditStack,
  onStudyStack
}) {
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [filterStackId, setFilterStackId] = useState(null);

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
  }, [editingCard, onUpdateCard, onCreateNewCard]);

  const handleStackFormSubmit = useCallback((formData) => {
    if (editingStack && editingStack.id) {
      onUpdateStack({ ...editingStack, ...formData });
    } else {
      onCreateStack(formData);
    }
  }, [editingStack, onUpdateStack, onCreateStack]);

  const showCardList = useCallback(() => {
    setViewMode('cards');
    onCancelEdit();
    onCancelEditStack();
    setShowBatchUpload(false);
  }, [onCancelEdit, onCancelEditStack]);

  const showStackList = useCallback(() => {
    setViewMode('stacks');
    onCancelEdit();
    onCancelEditStack();
    setShowBatchUpload(false);
  }, [onCancelEdit, onCancelEditStack]);

  const handleCreateNewCardClick = useCallback(() => {
    onEditCard({});
  }, [onEditCard]);

  const handleCreateNewStackClick = useCallback(() => {
    onEditStack({});
  }, [onEditStack]);

  const handleCancelCardForm = useCallback(() => {
    onCancelEdit();
    setViewMode('cards');
  }, [onCancelEdit]);

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
      case 'stacks':
        return (
          <StackList 
            stacks={stacks} 
            onCreateStack={handleCreateNewStackClick} 
            onEditStack={onEditStack}
            onDeleteStack={onDeleteStack}
            onStudyStack={onStudyStack}
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
          className={`py-2 px-4 rounded-md transition-colors ${viewMode === 'cards' || viewMode === 'card-form' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
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