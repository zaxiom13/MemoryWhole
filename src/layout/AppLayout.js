import React from 'react';
import { motion } from 'framer-motion';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import Header from './Header';
import GlobalStyles from '../ui/GlobalStyles';

/**
 * Main application layout component
 */
function AppLayout({ children }) {
  const { darkMode } = useUserPreferences();
  
  return (
    <div className={`min-h-screen px-4 py-8 transition-colors duration-300 leather-background ${darkMode ? 'dark' : ''}`}>
      <GlobalStyles />
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center"
      >
        <h1 className="text-5xl font-bold mb-10 sticky top-0 z-10 leather-title py-2 text-center">
          Memory Whole
        </h1>
        <div className="w-full max-w-2xl h-[80vh] relative stitched-border paper-background p-8 mx-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default AppLayout;