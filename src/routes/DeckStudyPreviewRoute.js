import React from 'react';
import { DeckStudyPreview } from '../features/deck-study';

/**
 * Deck study preview route component
 */
export default function DeckStudyPreviewRoute({ onBegin }) {
  return <DeckStudyPreview onBegin={onBegin} />;
}
