import React from 'react';
import { motion } from 'framer-motion';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import Header from './Header';
import GlobalStyles from '../ui/GlobalStyles';

/**
 * Main application layout component
 */
function AppLayout({ children }) {
 // const { darkMode } = useUserPreferences(); // darkMode is still used by UserPreferencesContext to set class on <html>
  
  return (
    // Main div: Removed leather-background and darkMode ternary. Added flex properties.
    <div className="min-h-screen px-4 py-8 transition-colors duration-300 flex flex-col items-center justify-center">
      <GlobalStyles />
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // Removed flex properties from here, moved to parent div.
        // This div can be further simplified if it only serves as a motion container.
        // For now, keeping it as is for minimal structural change beyond class moves.
        className="w-full flex flex-col items-center" // Ensure it still takes full width and centers content if needed before content area
      >
        {/* Title h1: Updated classes */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-10 sticky top-0 z-10 py-2 text-center bg-gray-100 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm">
          Memory Whole
        </h1>
        {/* Content area div: Updated classes */}
        <div className="w-full max-w-2xl min-h-[75vh] relative bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 mx-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default AppLayout;
