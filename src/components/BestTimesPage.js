import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loadAllPersonalBestTimes, formatTime, formatDate } from '../utils/memoryUtils';
import { useAppState } from '../contexts/AppStateContext';

/**
 * BestTimesPage component - displays all personal best times
 */
function BestTimesPage({ onBack }) {
  const [allBestTimes, setAllBestTimes] = useState([]);
  const { cards, decks } = useAppState();
  
  // Load all personal best times when the component mounts
  useEffect(() => {
    const bestTimes = loadAllPersonalBestTimes();
    setAllBestTimes(bestTimes);
  }, []);

  // Helper function to find card and deck based on reference text
  const findCardAndDeck = (referencePreview) => {
    if (!cards || !decks) return { cardTitle: null, deckTitle: null };
    
    // Try to find a matching card based on the text content
    const matchingCard = cards.find(card => {
      const normalizedCardText = card.text.replace(/\s+/g, ' ');
      return normalizedCardText.substring(0, 50).includes(referencePreview.substring(0, 40));
    });
    
    if (!matchingCard) return { cardTitle: null, deckTitle: null };
    
    // Find the deck this card belongs to
    const matchingDeck = decks.find(deck => deck.id === matchingCard.deckId);
    
    return { 
      cardTitle: matchingCard.title, 
      deckTitle: matchingDeck ? matchingDeck.title : 'Unknown Deck' 
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <div className="sticky top-0 z-20 note-paper py-4 px-4 mx-0 shadow-sm flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">🏆</span> Personal Best Times
        </h2>
        <button
          onClick={onBack}
          className="leather-button p-2 rounded-full flex items-center justify-center"
          title="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(70vh-120px)] pr-2">
        {allBestTimes.length === 0 ? (
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
            {allBestTimes.map((item, index) => {
              const { cardTitle, deckTitle } = findCardAndDeck(item.referencePreview);
              
              return (
                <div key={index} className="p-4 rounded-lg leather-card border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                    {cardTitle ? `${cardTitle} (${deckTitle})` : `${item.referencePreview}...`}
                  </h4>
                  <div className="space-y-2">
                  {item.times.slice(0, 3).map((timeData, timeIndex) => (
                    <div
                      key={timeIndex}
                      className="flex justify-between items-center p-2 rounded-lg bg-white/50 dark:bg-gray-800/50"
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
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BestTimesPage;