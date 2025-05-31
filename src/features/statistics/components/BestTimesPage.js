import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loadAllPersonalBestTimes, loadAllDeckCompletionTimes, formatTime, formatDate } from '../../../utils/memoryUtils';

/**
 * BestTimesPage component - displays all personal best times
 */
function BestTimesPage({ onBack }) {
  const [allBestTimes, setAllBestTimes] = useState([]);
  const [allDeckTimes, setAllDeckTimes] = useState([]);
  
  // Load all personal best times when the component mounts
  useEffect(() => {
    const bestTimes = loadAllPersonalBestTimes();
    const deckTimes = loadAllDeckCompletionTimes();
    setAllBestTimes(bestTimes);
    setAllDeckTimes(deckTimes);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      {/* Sticky Header: Removed note-paper, added new bg and blur effect */}
      <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md shadow-sm py-4 px-4 mx-0 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">🏆</span> Personal Best Times
        </h2>
        <button
          onClick={onBack}
          className="icon-button rounded-full flex items-center justify-center" // Changed to icon-button
          title="Back to Home"
        >
          {/* Removed text-gray-700 dark:text-gray-300 to inherit text-white */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      {/* Scrollable Area: Adjusted min-h for mobile */}
      <div className="overflow-y-auto min-h-[calc(50vh-110px)] sm:min-h-[calc(70vh-120px)] pr-2">
        {allBestTimes.length === 0 && allDeckTimes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No personal best times recorded yet.
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Complete memory challenges to see your best times here!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Deck Completion Times Section */}
            {allDeckTimes.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                  <span className="mr-2">🎯</span> Deck Completion Times
                </h3>
                <div className="space-y-6">
                  {allDeckTimes.map((deckItem, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                        {deckItem.deckTitle}
                      </h4>
                      <div className="space-y-2">
                        {deckItem.times.slice(0, 3).map((timeData, timeIndex) => (
                          <div
                            key={timeIndex}
                            className="flex justify-between items-center p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800"
                          >
                            <div className="flex items-center">
                              <span className="text-lg font-bold mr-3">{timeIndex + 1}.</span>
                              <div className="flex flex-col">
                                <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                                  {formatTime(timeData.totalTime)}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {timeData.cardCount} cards • Avg: {formatTime(timeData.averageTime)}
                                </span>
                              </div>
                              {/* Icons for helps used */}
                              <div className="flex ml-3">
                                {timeData.easyMode && (
                                  <span
                                    className="ml-1 text-green-600 dark:text-green-400"
                                    title="Easy Mode was used"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                                      <line x1="16" y1="8" x2="2" y2="22"></line>
                                      <line x1="17.5" y1="15" x2="9" y2="15"></line>
                                    </svg>
                                  </span>
                                )}
                                {timeData.referenceExposed && (
                                  <span
                                    className="ml-1 text-blue-600 dark:text-blue-400"
                                    title="Reference text was viewed"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </span>
                                )}
                                {timeData.ghostTextUsed && (
                                  <span
                                    className="ml-1 text-purple-600 dark:text-purple-400"
                                    title="Ghost text assistance was used"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(timeData.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Card Times Section */}
            {allBestTimes.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                  <span className="mr-2">📝</span> Individual Card Times
                </h3>
                <div className="space-y-6">
                  {allBestTimes.map((item, index) => (
                    // Best Time Item Card: Removed leather-card, added new card styles
                    <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                        {item.referencePreview}...
                      </h4>
                      <div className="space-y-2">
                        {item.times.slice(0, 3).map((timeData, timeIndex) => (
                          // Time Data Row: Adjusted background
                          <div
                            key={timeIndex}
                            className="flex justify-between items-center p-2 rounded-md bg-gray-100 dark:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <span className="text-lg font-bold mr-2">{timeIndex + 1}.</span>
                              <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                                {formatTime(timeData.time)}
                              </span>
                              {/* Icons for helps used */}
                              <div className="flex ml-2">
                                {timeData.easyMode && (
                                  <span
                                    className="ml-1 text-green-600 dark:text-green-400"
                                    title="Easy Mode was used"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                                      <line x1="16" y1="8" x2="2" y2="22"></line>
                                      <line x1="17.5" y1="15" x2="9" y2="15"></line>
                                    </svg>
                                  </span>
                                )}
                                {timeData.referenceExposed && (
                                  <span
                                    className="ml-1 text-blue-600 dark:text-blue-400"
                                    title="Reference text was viewed"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </span>
                                )}
                                {timeData.ghostTextUsed && (
                                  <span
                                    className="ml-1 text-purple-600 dark:text-purple-400"
                                    title="Ghost text assistance was used"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(timeData.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BestTimesPage;