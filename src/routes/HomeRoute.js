import React from 'react';
import HomePage from '../features/home/HomePage';

/**
 * Home route component
 */
export default function HomeRoute({ 
  cards, 
  decks,
  currentDeckId,
  setCurrentDeckId,
  onSelectReference,
  onCreateCard,
  onEditCard,
  onDeleteCard,
  editingCard,
  onUpdateCard,
  onCreateNewCard,
  onCancelEdit,
  onCreateDeck,
  onEditDeck,
  onDeleteDeck,
  editingDeck,
  onUpdateDeck,
  onCreateNewDeck,
  onCancelEditDeck,
  onViewBestTimes,
  onStartDeckStudy
}) {
  return (
    <HomePage
      cards={cards}
      decks={decks}
      currentDeckId={currentDeckId}
      setCurrentDeckId={setCurrentDeckId}
      onSelectReference={onSelectReference}
      onCreateCard={onCreateCard}
      onEditCard={onEditCard}
      onDeleteCard={onDeleteCard}
      editingCard={editingCard}
      onUpdateCard={onUpdateCard}
      onCreateNewCard={onCreateNewCard}
      onCancelEdit={onCancelEdit}
      onCreateDeck={onCreateDeck}
      onEditDeck={onEditDeck}
      onDeleteDeck={onDeleteDeck}
      editingDeck={editingDeck}
      onUpdateDeck={onUpdateDeck}
      onCreateNewDeck={onCreateNewDeck}
      onCancelEditDeck={onCancelEditDeck}
      onViewBestTimes={onViewBestTimes}
      onStartDeckStudy={onStartDeckStudy}
    />
  );
}