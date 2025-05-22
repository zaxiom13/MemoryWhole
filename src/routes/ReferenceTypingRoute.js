import React from 'react';
import { ReferenceTyping } from '../features/typing';

/**
 * Reference typing route component
 */
export default function ReferenceTypingRoute({
  userInput,
  selectedReference,
  onInputChange,
  onBack,
  isComplete,
  easyMode,
  onReferenceExposed,
  ghostTextEnabled,
  showReferenceEnabled,
  inputError
}) {
  return (
    <ReferenceTyping
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
    />
  );
}