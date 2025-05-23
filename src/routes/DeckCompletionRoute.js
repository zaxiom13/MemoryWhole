import React from 'react';
import { DeckCompletionPage } from '../features/completion';

/**
 * Deck completion route component
 */
export default function DeckCompletionRoute({
  completionTimes,
  deckTitle,
  cardCount,
  onReturnToMenu
}) {
  return (
    <DeckCompletionPage
      completionTimes={completionTimes}
      deckTitle={deckTitle}
      cardCount={cardCount}
      onReturnToMenu={onReturnToMenu}
    />
  );
}