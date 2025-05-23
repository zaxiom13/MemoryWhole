import { motion } from 'framer-motion';
import { formatTime } from '../../../utils/memoryUtils';

/**
 * CompletionPage component - displays completion metrics and animation
 */
function CompletionPage({ completionTime, onReturnToMenu, onTryAgain }) {
  return (
    // Main container: Removed note-paper, applied new card styles, adjusted padding
    <motion.div
      className="text-center bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700"
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
        <svg className="w-24 h-24 mx-auto text-green-600 dark:text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            d="M22 11.08V12a10 10 0 1 1-5.93-9.14" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            d="M22 4L12 14.01l-3-3" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      
      <motion.h2 
        className="text-3xl mb-4 font-bold text-gray-800 dark:text-gray-200"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ duration: 0.5, delay: 1.5, repeat: 1, repeatType: "reverse" }}
      >
        Congratulations! 🎉
      </motion.h2>
      
      <motion.p 
        className="text-xl mb-6 text-gray-700 dark:text-gray-300 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
      >
        You completed the task in{' '}
        {/* Completion Time Display: Removed leather-card, styled as a badge */}
        <span className="font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-5 py-3 rounded-lg mt-3 inline-flex justify-center items-center min-w-32 shadow-md">
          {formatTime(completionTime)}
        </span>
      </motion.p>
      
      <motion.div
        className="flex justify-center space-x-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1 }}
      >
        <button
          onClick={onReturnToMenu}
          className="leather-button" // Removed custom padding & redundant classes
        >
          Return to Menu
        </button>
        
        <button
          onClick={onTryAgain}
          className="leather-button" // Removed custom padding & redundant classes
        >
          Try Again
        </button>
      </motion.div>
    </motion.div>
  );
}

export default CompletionPage;