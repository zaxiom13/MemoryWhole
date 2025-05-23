import React from 'react';
import CardItem from './CardItem';

/**
 * Card list component for a specific deck
 */
function CardList({ deck, cards, onSelectReference, onCreateCard, onEditCard, onDeleteCard, onBackToDeckList, onStudyAllCards }) {
  return (
    <>
      {/* Sticky Header: Removed note-paper, added new bg and blur effect */}
      <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md shadow-sm py-4 px-4 mx-0 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToDeckList}
            className="icon-button rounded-full flex items-center justify-center" // Changed to icon-button
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
        <div className="flex space-x-2">
          {cards.length > 0 && (
            <button 
              onClick={() => onStudyAllCards(deck)}
              className="leather-button px-4 py-2 rounded-lg bg-indigo-600 flex items-center justify-center"
              title="Study All Cards"
            >
              <span className="mr-1">Study All</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <button 
            onClick={onCreateCard}
            className="icon-button rounded-full flex items-center justify-center" // Changed to icon-button
            title="Add New Card"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      {/* Scrollable Area: Adjusted min-h for mobile */}
      <div className="overflow-y-auto min-h-[calc(50vh-110px)] sm:min-h-[calc(70vh-120px)] pr-2">
        {cards.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center p-8">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">No cards in this deck yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first card to start practicing</p>
            <button
              onClick={onCreateCard}
              className="leather-button flex items-center justify-center" // Removed custom padding and text-lg
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

export default CardList;