import React from 'react';
import { motion } from 'framer-motion';
import { formatDate, normalizeWhitespace } from '../../../utils/memoryUtils';
import Card from '../../../models/Card';

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

export default CardItem;