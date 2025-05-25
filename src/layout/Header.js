import React from 'react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Using Heroicons for a more polished look

/**
 * Application header component with dark mode toggle
 */
function Header() {
  const { darkMode, toggleDarkMode } = useUserPreferences();
  
  return (
    <header className="fixed top-6 right-6 z-50">
      <button
        onClick={toggleDarkMode}
        className="icon-button rounded-full p-2.5 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <SunIcon className="h-6 w-6 text-yellow-400" />
        ) : (
          <MoonIcon className="h-6 w-6 text-indigo-300" />
        )}
      </button>
    </header>
  );
}

export default Header;