import React from 'react';
import { motion } from 'framer-motion';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import Header from './Header';
import GlobalStyles from '../ui/GlobalStyles';

/**
 * Main application layout component
 */
function AppLayout({ children }) {
  // const { darkMode } = useUserPreferences(); // darkMode is used by UserPreferencesContext to set class on <html>, not directly here.
  useUserPreferences(); // Call the hook to ensure UserPreferencesContext logic (like setting <html> class) runs.
  
  return (
    // Enhanced main background with subtle gradient and better spacing
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 px-4 py-8 transition-all duration-500 flex flex-col items-center justify-center">
      <GlobalStyles />
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex flex-col items-center"
      >
        {/* Enhanced title with beautiful gradient and improved styling */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-extrabold mb-12 sticky top-4 z-20 py-4 text-center"
        >
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
            Memory Whole
          </span>
        </motion.h1>
        
        {/* Enhanced content area with improved styling */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-4xl min-h-[75vh] relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl shadow-indigo-100/50 dark:shadow-indigo-900/20 rounded-2xl border border-white/20 dark:border-gray-700/30 p-6 md:p-8 mx-auto ring-1 ring-gray-200/50 dark:ring-gray-700/50"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AppLayout;