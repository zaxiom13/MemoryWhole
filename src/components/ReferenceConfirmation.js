import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { loadPersonalBestTimes, formatTime, formatDate, savePreference } from '../utils/memoryUtils';

/**
 * ReferenceConfirmation component - displays the selected reference text
 * and allows user to start the memory test
 */
export default function ReferenceConfirmation({ 
  selectedReference, 
  onBegin, 
  onBack, 
  easyMode, 
  onToggleEasyMode,
  ghostTextEnabled,
  onToggleGhostText,
  showReferenceEnabled,
  onToggleShowReference
}) {
  const [personalBestTimes, setPersonalBestTimes] = useState([]);
  const [localEasyMode, setLocalEasyMode] = useState(easyMode);
  const [localGhostTextEnabled, setLocalGhostTextEnabled] = useState(ghostTextEnabled);
  const [localShowReferenceEnabled, setLocalShowReferenceEnabled] = useState(showReferenceEnabled);

  // Load personal best times when the component mounts or reference changes
  useEffect(() => {
    if (selectedReference) {
      const bestTimes = loadPersonalBestTimes(selectedReference);
      setPersonalBestTimes(bestTimes);
    }
    // Initialize local state from props
    setLocalEasyMode(easyMode);
    setLocalGhostTextEnabled(ghostTextEnabled);
    setLocalShowReferenceEnabled(showReferenceEnabled);
  }, [selectedReference, easyMode, ghostTextEnabled, showReferenceEnabled]);

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
                    {/* Icons for helps used */}
                    <div className="flex ml-2">
                      {timeData.easyMode && (
                        <span 
                          className="ml-1 text-green-600 dark:text-green-400" 
                          title="Easy Mode was used"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
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
        )}
        
        <p className="mt-4 text-gray-600 dark:text-gray-400 italic">
          Take a moment to study this text. When ready, click "Begin" to test your recall.
        </p>
        
        {/* Feature Toggles Section */}
        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Study Options</h4>
          
          {/* Easy Mode Toggle */}
          <div className="flex items-center mb-3">
            <button 
              onClick={() => {
                const newEasyMode = !localEasyMode;
                setLocalEasyMode(newEasyMode);
                if (onToggleEasyMode) {
                  onToggleEasyMode(newEasyMode);
                }
                savePreference('easyMode', newEasyMode);
              }}
              className={`p-2 rounded-full transition-colors duration-300 ${localEasyMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              aria-label="Toggle easy mode"
              title={localEasyMode ? "Easy Mode: On" : "Easy Mode: Off"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {localEasyMode ? "Easy Mode: On" : "Easy Mode: Off"}
            </span>
            <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {localEasyMode ? "(Punctuation and case are handled automatically)" : "(Exact match required)"}
            </div>
          </div>
          
          {/* Ghost Text Toggle */}
          <div className="flex items-center mb-3">
            <button 
              onClick={() => {
                const newGhostTextEnabled = !localGhostTextEnabled;
                setLocalGhostTextEnabled(newGhostTextEnabled);
                if (onToggleGhostText) {
                  onToggleGhostText(newGhostTextEnabled);
                }
                savePreference('ghostTextEnabled', newGhostTextEnabled);
              }}
              className={`p-2 rounded-full transition-colors duration-300 ${localGhostTextEnabled ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              aria-label="Toggle ghost text"
              title={localGhostTextEnabled ? "Ghost Text: On" : "Ghost Text: Off"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {localGhostTextEnabled ? "Ghost Text: On" : "Ghost Text: Off"}
            </span>
            <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {localGhostTextEnabled ? "(Shows upcoming text after a pause)" : "(No typing assistance)"}
            </div>
          </div>
          
          {/* Show Reference Toggle */}
          <div className="flex items-center">
            <button 
              onClick={() => {
                const newShowReferenceEnabled = !localShowReferenceEnabled;
                setLocalShowReferenceEnabled(newShowReferenceEnabled);
                if (onToggleShowReference) {
                  onToggleShowReference(newShowReferenceEnabled);
                }
                savePreference('showReferenceEnabled', newShowReferenceEnabled);
              }}
              className={`p-2 rounded-full transition-colors duration-300 ${localShowReferenceEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              aria-label="Toggle show reference"
              title={localShowReferenceEnabled ? "Show Reference: On" : "Show Reference: Off"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {localShowReferenceEnabled ? "Show Reference: On" : "Show Reference: Off"}
            </span>
            <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {localShowReferenceEnabled ? "(View reference while typing)" : "(No reference available)"}
            </div>
          </div>
        </div>
        
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