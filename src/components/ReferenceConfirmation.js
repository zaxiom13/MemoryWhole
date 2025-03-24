 import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { loadPersonalBestTimes, formatTime, formatDate } from '../utils/memoryUtils';

/**
 * ReferenceConfirmation component - displays the selected reference text
 * and allows user to start the memory test
 */
export default function ReferenceConfirmation({ selectedReference, onBegin, onBack }) {
  const [personalBestTimes, setPersonalBestTimes] = useState([]);

  // Load personal best times when the component mounts or reference changes
  useEffect(() => {
    if (selectedReference) {
      const bestTimes = loadPersonalBestTimes(selectedReference);
      setPersonalBestTimes(bestTimes);
    }
  }, [selectedReference]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-screen-sm"
    >
      <div className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 note-paper transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Ready to Test Your Memory?</h3>
        <div className="p-4 rounded-lg note-paper border border-gray-200 dark:border-gray-700 max-h-[50vh] overflow-y-auto">
          <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Selected Reference:</h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {selectedReference}
          </p>
        </div>
        
        {/* Personal Best Times Section */}
        {personalBestTimes.length > 0 && (
          <div className="mt-6 p-4 rounded-lg leather-card border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300 flex items-center">
              <span className="mr-2">🏆</span> Personal Best Times
            </h4>
            <div className="space-y-2">
              {personalBestTimes.slice(0, 3).map((timeData, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-2 rounded-lg bg-white/50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-2">{index + 1}.</span>
                    <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                      {formatTime(timeData.time)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(timeData.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
            className="leather-button px-5 py-2"
            onClick={onBegin}
          >
            Begin Test
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}