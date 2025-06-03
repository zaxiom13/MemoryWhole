import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../../contexts/AppStateContext';

/**
 * DeckStudyPreview component - displays deck information before starting study
 */
function DeckStudyPreview({ onBegin }) {
  const { studyDeckId, studyCardIds, decks, cards } = useAppState();

  const deck = decks.find(d => d.id === studyDeckId);
  const deckCards = studyCardIds
    .map(id => cards.find(c => c.id === id))
    .filter(Boolean);
  const previewCards = deckCards.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full overflow-y-auto max-h-screen pb-24 md:pb-4"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {deck ? deck.title : 'Deck Study'}
        </h3>
        {deck && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
            {deck.description}
          </p>
        )}
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {studyCardIds.length} cards
        </p>
        <div className="space-y-2 mb-4">
          {previewCards.map(card => (
            <div
              key={card.id}
              className="p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              {card.text.slice(0, 50)}{card.text.length > 50 ? '...' : ''}
            </div>
          ))}
        </div>
        <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-4">
          Easy Mode, Ghost Text and Show Reference settings apply to all cards.
        </p>
        <div className="flex justify-end">
          <button onClick={onBegin} className="leather-button px-6 py-2 rounded-lg">
            Begin Deck Study
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default DeckStudyPreview;
