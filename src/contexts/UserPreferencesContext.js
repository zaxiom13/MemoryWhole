import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadPreference, savePreference } from '../utils/memoryUtils';

// Create context
const UserPreferencesContext = createContext();

// Custom hook to use the preferences
export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}

// Provider component
export function UserPreferencesProvider({ children }) {
  // User preferences state
  const [darkMode, setDarkMode] = useState(false);
  const [easyMode, setEasyMode] = useState(false);
  const [ghostTextEnabled, setGhostTextEnabled] = useState(true);
  const [showReferenceEnabled, setShowReferenceEnabled] = useState(false);
  
  // Load preferences on mount
  useEffect(() => {
    const savedDarkMode = loadPreference('darkMode', false);
    const savedEasyMode = loadPreference('easyMode', false);
    const savedGhostTextEnabled = loadPreference('ghostTextEnabled', true);
    const savedShowReferenceEnabled = loadPreference('showReferenceEnabled', false);
    
    setDarkMode(savedDarkMode);
    setEasyMode(savedEasyMode);
    setGhostTextEnabled(savedGhostTextEnabled);
    setShowReferenceEnabled(savedShowReferenceEnabled);
  }, []);
  
  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    savePreference('darkMode', darkMode);
  }, [darkMode]);
  
  // Save preferences when they change
  useEffect(() => {
    savePreference('easyMode', easyMode);
  }, [easyMode]);
  
  useEffect(() => {
    savePreference('ghostTextEnabled', ghostTextEnabled);
  }, [ghostTextEnabled]);
  
  useEffect(() => {
    savePreference('showReferenceEnabled', showReferenceEnabled);
  }, [showReferenceEnabled]);
  
  // Toggle handlers
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  const toggleEasyMode = () => {
    setEasyMode(prevMode => !prevMode);
  };
  
  const toggleGhostText = () => {
    setGhostTextEnabled(prevEnabled => !prevEnabled);
  };
  
  const toggleShowReference = () => {
    setShowReferenceEnabled(prevEnabled => !prevEnabled);
  };
  
  const value = {
    // Preference values
    darkMode,
    easyMode,
    ghostTextEnabled,
    showReferenceEnabled,
    
    // Toggle handlers
    toggleDarkMode,
    toggleEasyMode,
    toggleGhostText,
    toggleShowReference
  };
  
  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export default UserPreferencesContext;