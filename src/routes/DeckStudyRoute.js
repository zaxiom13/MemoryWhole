import React from 'react';
import { DeckStudyMode } from '../features/deck-study';

/**
 * Deck study route component
 */
export default function DeckStudyRoute({
  userInput,
  selectedReference,
  onInputChange,
  onBack,
  isComplete,
  easyMode,
  onReferenceExposed,
  ghostTextEnabled,
  showReferenceEnabled,
  inputError,
  loadNextStudyCard,
  completionTime,
  beginNextCard
}) {
  return (
    <DeckStudyMode
      userInput={userInput}
      selectedReference={selectedReference}
      onInputChange={onInputChange}
      onBack={onBack}
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
  );
}