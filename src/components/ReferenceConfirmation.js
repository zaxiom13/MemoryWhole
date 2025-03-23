import React from 'react';
import { motion } from 'framer-motion';

/**
 * ReferenceConfirmation component - displays the selected reference text
 * and allows user to start the memory test
 */
export default function ReferenceConfirmation({ selectedReference, onBegin, onBack }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-screen-sm"
    >
      <div className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Ready to Test Your Memory?</h3>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 max-h-[50vh] overflow-y-auto">
          <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Selected Reference:</h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {selectedReference}
          </p>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 italic">
          Take a moment to study this text. When ready, click "Begin" to test your recall.
        </p>
        
        <div className="flex justify-end gap-3 mt-6">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-300"
            onClick={onBack}
          >
            Back
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-700 dark:to-purple-800 dark:hover:from-indigo-800 dark:hover:to-purple-900 text-white font-medium rounded-lg transition-all duration-300"
            onClick={onBegin}
          >
            Begin Test
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}