import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppStateProvider, useAppState } from './contexts/AppStateContext';
import { UserPreferencesProvider, useUserPreferences } from './contexts/UserPreferencesContext';
import useTyping from './features/typing/useTyping';
import useStatistics from './features/statistics/useStatistics';

import TutorialGuide from './components/TutorialGuide';
import ReferenceConfirmation from './components/ReferenceConfirmation';
import ReferenceTyping from './components/ReferenceTyping';
import CompletionPage from './components/CompletionPage';
import DeckStudyMode from './components/DeckStudyMode';
import DeckCompletionPage from './components/DeckCompletionPage';
import BestTimesPage from './components/BestTimesPage';
import HomePage from './features/home/HomePage';
import AppLayout from './layout/AppLayout';

import './styles/main-styles.css';

/**
 * Main application component
 */
function AppContent() {
  const { 
    step, 
    cards, 
    decks, 
    editingCard,
    createCard,
    updateCard,
    deleteCard,
    editCard,
    cancelEdit,
    currentDeckId,
    setCurrentDeckId,
    editingDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    editDeck,
    cancelEdit: cancelEditDeck,
    completeTutorial,
    isComplete,
    isDeckStudyMode,
    deckStudyComplete,
    studyDeckId,
    deckCompletionTimes,
    exitDeckStudy
  } = useAppState();

  const { 
    userInput,
    selectedReference,
    completionTime,
    inputError,
    handleInputChange,
    handleSelectReference,
    handleBeginTyping,
    handleRetryTyping,
    handleReturnToMenu,
    handleStartDeckStudy,
    loadNextStudyCard,
    beginNextCard,
    onReferenceExposed
  } = useTyping();

  const { handleViewBestTimes } = useStatistics();
  
  // For user preferences access in components
  const { easyMode, toggleEasyMode, ghostTextEnabled, toggleGhostText, showReferenceEnabled, toggleShowReference } = useUserPreferences();

  // Handler for returning from deck study
  const handleExitDeckStudy = () => {
    exitDeckStudy();
    handleReturnToMenu();
  };

  // Conditional rendering based on application step
  return (
    <AnimatePresence>
      {step === 0 ? (
        <TutorialGuide onComplete={completeTutorial} />
      ) : (
        <AppLayout>
          {step === 1 && (
            <HomePage 
              cards={cards} 
              decks={decks}
              currentDeckId={currentDeckId}
              setCurrentDeckId={setCurrentDeckId}
              onSelectReference={handleSelectReference}
              onCreateCard={() => editCard({})}
              onEditCard={editCard}
              onDeleteCard={deleteCard}
              editingCard={editingCard}
              onUpdateCard={updateCard}
              onCreateNewCard={createCard}
              onCancelEdit={cancelEdit}
              onCreateDeck={() => editDeck({})}
              onEditDeck={editDeck}
              onDeleteDeck={deleteDeck}
              editingDeck={editingDeck}
              onUpdateDeck={updateDeck}
              onCreateNewDeck={createDeck}
              onCancelEditDeck={cancelEditDeck}
              onViewBestTimes={handleViewBestTimes}
              onStartDeckStudy={handleStartDeckStudy}
            />
          )}
          
          {step === 2 && (
            <ReferenceConfirmation 
              selectedReference={selectedReference}
              onBegin={handleBeginTyping}
              onBack={handleReturnToMenu}
              easyMode={easyMode}
              onToggleEasyMode={toggleEasyMode}
              ghostTextEnabled={ghostTextEnabled}
              onToggleGhostText={toggleGhostText}
              showReferenceEnabled={showReferenceEnabled}
              onToggleShowReference={toggleShowReference}
            />
          )}
          
          {step === 3 && isDeckStudyMode ? (
            <DeckStudyMode
              userInput={userInput}
              selectedReference={selectedReference}
              onInputChange={handleInputChange}
              onBack={handleExitDeckStudy}
              isComplete={isComplete}
              easyMode={easyMode}
              onReferenceExposed={onReferenceExposed}
              ghostTextEnabled={ghostTextEnabled}
              showReferenceEnabled={showReferenceEnabled}
              inputError={inputError}
              loadNextStudyCard={loadNextStudyCard}
              completionTime={completionTime}
              beginNextCard={beginNextCard}
            />
          ) : step === 3 && (
            <ReferenceTyping 
              userInput={userInput}
              selectedReference={selectedReference}
              onInputChange={handleInputChange}
              onBack={handleReturnToMenu}
              isComplete={isComplete}
              easyMode={easyMode}
              onReferenceExposed={onReferenceExposed}
              ghostTextEnabled={ghostTextEnabled}
              showReferenceEnabled={showReferenceEnabled}
              inputError={inputError}
            />
          )}
          
          {step === 4 && (
            <BestTimesPage 
              onBack={handleReturnToMenu}
            />
          )}
          
          {isComplete && !isDeckStudyMode && (
            <CompletionPage 
              completionTime={completionTime}
              selectedReference={selectedReference}
              onReturnToMenu={handleReturnToMenu}
              onTryAgain={handleRetryTyping}
            />
          )}

          {deckStudyComplete && (
            <DeckCompletionPage
              completionTimes={deckCompletionTimes}
              deckTitle={decks.find(d => d.id === studyDeckId)?.title || 'Deck Study'}
              cardCount={deckCompletionTimes.length}
              onReturnToMenu={handleReturnToMenu}
            />
          )}
        </AppLayout>
      )}
    </AnimatePresence>
  );
}

// Application root with context providers
export default function App() {
  return (
    <UserPreferencesProvider>
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </UserPreferencesProvider>
  );
}
