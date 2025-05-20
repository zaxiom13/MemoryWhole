import React from 'react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

/**
 * Application header component with dark mode toggle
 */
function Header() {
  const { darkMode, toggleDarkMode } = useUserPreferences();
  
  return (
    <div className="fixed top-4 right-4 flex gap-2 z-50">
      <button 
        onClick={toggleDarkMode}
        className={`p-2.5 rounded-full transition-colors duration-300 ${darkMode ? 'bg-gray-600 text-indigo-400 hover:bg-gray-500' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default Header;