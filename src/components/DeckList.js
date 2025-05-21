import { motion } from 'framer-motion';
import { formatDate } from '../utils/memoryUtils';

/**
 * Deck item component
 */
function DeckItem({ deck, onSelect, onEdit, onDelete }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 p-8 flex flex-col cursor-pointer relative group"
      onClick={() => onSelect(deck)}
    >
      <div
        className="absolute top-4 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => { 
            e.stopPropagation();
            onEdit(deck);
          }}
          className="icon-button rounded-full" // Changed to icon-button
          title="Edit Deck"
        >
          {/* text-white is inherited from icon-button */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this deck and all its cards?')) {
              onDelete(deck.id);
            }
          }}
          className="icon-button rounded-full" // Changed to icon-button, custom hover removed
          title="Delete Deck"
        >
          {/* text-white is inherited from icon-button */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
        {deck.title}
      </h3>
      {/* Inner div: Removed note-paper, added new bg and rounded-md */}
      <div className="flex-grow bg-gray-50 dark:bg-gray-700 p-4 rounded-md overflow-hidden">
        {/* Text color should be fine with new bg: text-gray-700 dark:text-gray-300 */}
        <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 text-ellipsis overflow-hidden">
          {deck.description}
        </p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {`${deck.cardIds.length} cards · Last modified: ${formatDate(deck.updatedAt || deck.createdAt)}`}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(deck);
          }}
          // Standardized leather-button classes
          className="leather-button text-sm"
        >
          View Cards
        </button>
      </div>
    </motion.div>
  );
}

/**
 * DeckList component
 */
function DeckList({ decks, onSelectDeck, onCreateDeck, onEditDeck, onDeleteDeck, onViewBestTimes }) {
  return (
    <>
      {/* Sticky Header: Removed note-paper, added new bg and blur effect */}
      <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md shadow-sm py-4 px-4 mx-0 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Choose a Deck to Practice Your Memory
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onViewBestTimes}
            className="icon-button rounded-full flex items-center justify-center" // Changed to icon-button
            title="View Best Times"
          >
            {/* text-white is inherited from icon-button */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={onCreateDeck}
            className="icon-button rounded-full flex items-center justify-center" // Changed to icon-button
            title="Create New Deck"
          >
            {/* text-white is inherited from icon-button */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      {/* Scrollable Area: Adjusted min-h for mobile */}
      <div className="overflow-y-auto min-h-[calc(50vh-110px)] sm:min-h-[calc(70vh-120px)] pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
          {decks.map((deck) => (
            <DeckItem 
              key={deck.id}
              deck={deck}
              onSelect={onSelectDeck}
              onEdit={onEditDeck}
              onDelete={onDeleteDeck}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default DeckList;