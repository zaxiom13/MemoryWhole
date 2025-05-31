import React, { useState } from 'react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { SunIcon, MoonIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Using Heroicons for a more polished look
import ResetConfirmationModal from '../components/ResetConfirmationModal'; // Import the modal

/**
 * Application header component with dark mode toggle and reset button
 */
function Header() {
  const { darkMode, toggleDarkMode } = useUserPreferences();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleResetClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmReset = () => {
    console.log('Reset confirmed in Header. Clearing localStorage and reloading...');
    localStorage.clear(); // Clear all data from localStorage
    window.location.reload(); // Reload the application
    setIsModalOpen(false); // Close the modal (though page reload might make this redundant)
  };

  const handleCancelReset = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <header className="fixed top-6 right-6 z-50 flex items-center"> {/* Ensure buttons are in a flex container if needed */}
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
        <button
          onClick={handleResetClick} // Updated onClick handler
          className="ml-2 icon-button rounded-full p-2.5 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          aria-label="Reset application"
        >
          <ArrowPathIcon className="h-6 w-6 text-red-500 dark:text-red-400" />
        </button>
      </header>
      {isModalOpen && (
        <ResetConfirmationModal
          onConfirm={handleConfirmReset}
          onCancel={handleCancelReset}
        />
      )}
    </>
  );
}

export default Header;