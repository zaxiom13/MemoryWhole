import React from 'react';
import { CompletionPage } from '../features/completion';

/**
 * Completion route component
 */
export default function CompletionRoute({
  completionTime,
  selectedReference,
  onReturnToMenu,
  onTryAgain
}) {
  return (
    <CompletionPage
      completionTime={completionTime}
      selectedReference={selectedReference}
      onReturnToMenu={onReturnToMenu}
      onTryAgain={onTryAgain}
    />
  );
}