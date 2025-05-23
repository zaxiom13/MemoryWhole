import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../../../utils/memoryUtils';

/**
 * DeckCompletionPage component - displays completion metrics for deck study
 */
function DeckCompletionPage({ 
  completionTimes, 
  deckTitle, 
  cardCount, 
  onReturnToMenu 
}) {
  // Calculate total time and average time
  const totalTime = completionTimes.reduce((acc, time) => acc + time, 0);
  const averageTime = completionTimes.length > 0 ? totalTime / completionTimes.length : 0;

  return (
    <motion.div 
      className="text-center p-8 rounded-xl shadow-lg note-paper border border-gray-200 dark:border-gray-700"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.div
        className="mb-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
          Congratulations!
        </h2>
      </motion.div>

      <motion.p
        className="text-xl mb-8 text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        You've completed all cards in the deck
        <br />
        <span className="font-bold">{deckTitle}</span>
      </motion.p>

      <motion.div
        className="grid grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <div className="text-center bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Cards Completed</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{cardCount}</p>
        </div>
        <div className="text-center bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Total Time</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{formatTime(totalTime)}</p>
        </div>
      </motion.div>

      <motion.p
        className="text-xl mb-6 text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        Average time per card:{' '}
        <span className="font-bold leather-card px-5 py-3 rounded-lg mt-3 text-gray-800 dark:text-gray-200 inline-flex justify-center min-w-32">
          {formatTime(averageTime)}
        </span>
      </motion.p>
      
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
      >
        <button 
          onClick={onReturnToMenu}
          className="leather-button px-6 py-3 rounded-lg font-bold shadow-md transition-all duration-300"
        >
          Return to Menu
        </button>
      </motion.div>
    </motion.div>
  );
}

export default DeckCompletionPage;