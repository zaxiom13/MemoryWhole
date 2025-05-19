// useCardCollection.js - Custom hook for managing card collection
import { useState, useEffect } from 'react';
import CardCollection from '../models/CardCollection';
import { loadCardsFromStorage, saveCardsToStorage } from '../utils/memoryUtils';

/**
 * Default cards data - now with deckId references
 */
const defaultCards = [
  { 
    id: 1, 
    title: 'Ancient Wisdom', 
    text: `The journey of a thousand miles begins with a single step, but true mastery lies in understanding the terrain of the soul. Ancient philosophers taught that wisdom is not merely the accumulation of knowledge, but the alchemy of experience reflected through the prism of contemplation. 
    
    "He who knows others is learned; he who knows himself is wise," proclaimed Lao Tzu, reminding us that memory itself becomes transformative when intertwined with self-awareness. The Stoics of Athens would practice 'premeditatio malorum' - the premeditation of evils - not as pessimism, but as cognitive architecture to build resilience in the theater of the mind.`,
    createdAt: new Date('2023-01-01').getTime(),
    deckId: 1
  },
  { 
    id: 2, 
    title: 'Cosmic Perspective', 
    text: `In the vast cosmic arena, our pale blue dot floats like a mote of stardust in the infinite dark. Carl Sagan's iconic reflection takes new dimension when paired with the revelation that there are more potential neural connections in your brain than stars in the observable universe. 
    
    The Voyager Golden Record, carrying Earth's memories into interstellar space, becomes a mirror showing both our fragility and audacity. Recent discoveries of exoplanets in habitable zones suggest we might be living in a universe where the ancient question "Are we alone?" transforms into "How shall we introduce ourselves?" The James Webb Space Telescope peers not just through space, but through time, capturing light that began its journey when memory itself was first taking shape in primordial human brains.`,
    createdAt: new Date('2023-01-15').getTime(),
    deckId: 1
  },
  { 
    id: 3, 
    title: 'Technological Revolution', 
    text: `As we stand at the event horizon of the singularity, neural networks evolve from tools to collaborators. The AI alignment problem becomes the modern version of Prometheus' dilemma - how to harness fire without burning civilization. 
    
    Quantum computing threatens to crack SHA-256 encryption while promising unbreakable quantum keys, creating a paradoxical arms race against ourselves. Biohacking pioneers like Josiah Zayner demonstrate CRISPR's potential by editing their own DNA, blurring the line between human and technologist. Meanwhile, neuromorphic chips modeled on the human brain's architecture suggest that the next evolutionary leap might occur not in biological wetware, but in synthetic silicon substrates. The challenge becomes not memorization, but cultivating the wisdom to steer these tectonic forces.`,
    createdAt: new Date('2023-02-01').getTime(),
    deckId: 1
  },
  { 
    id: 4, 
    title: 'Neural Plasticity', 
    text: `The human brain's ability to rewire itself challenges our traditional understanding of learning. Every time we form a new memory, thousands of neurons forge fresh connections, literally reshaping our neural architecture. This process, known as neuroplasticity, continues throughout our entire lives, defying the old belief that adult brains are fixed and unchangeable.
    
    Research shows that London taxi drivers' hippocampi - the brain region associated with spatial memory - physically grow larger as they memorize the city's labyrinthine streets. This remarkable adaptation demonstrates how intensive memory practice can literally expand our brain's capabilities.`,
    createdAt: new Date('2023-02-15').getTime(),
    deckId: 2
  },
  { 
    id: 5, 
    title: 'Information Theory', 
    text: `Claude Shannon's revolutionary insight that information could be quantified transformed our understanding of communication. His mathematical framework showed that all messages, whether smoke signals or quantum bits, follow the same fundamental laws of information theory.
    
    Modern compression algorithms, built on Shannon's foundations, can detect patterns in seemingly random data, much like how human memory consolidates experiences by finding meaningful connections. The parallel between data compression and memory formation suggests deep links between information theory and cognitive science.`,
    createdAt: new Date('2023-03-01').getTime(),
    deckId: 2
  },
  { 
    id: 6, 
    title: 'Memory Palaces', 
    text: `The ancient technique of memory palaces, used by memory champions worldwide, demonstrates the power of spatial thinking. By mentally placing information within familiar architectural spaces, practitioners can recall vast amounts of data with remarkable accuracy.
    
    This method, also known as the Method of Loci, was used by ancient Greek and Roman orators to memorize hours-long speeches. Modern neuroscience confirms that spatial memory engages multiple brain regions, creating stronger and more resilient memory traces than rote memorization.`,
    createdAt: new Date('2023-03-15').getTime(),
    deckId: 3
  }
];

/**
 * Custom hook for managing card collection
 * @returns {Object} Card collection state and operations
 */
function useCardCollection() {
  const [collection, setCollection] = useState(null);
  const [sortedCards, setSortedCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [currentDeckId, setCurrentDeckId] = useState(null);

  // Load collection on mount
  useEffect(() => {
    const rawCards = loadCardsFromStorage(defaultCards);
    const cardCollection = CardCollection.fromArray(rawCards);
    setCollection(cardCollection);
  }, []);

  // Update sorted cards when collection or currentDeckId changes
  useEffect(() => {
    if (collection) {
      let cardsToSort = collection.getAll();
      
      // Filter by deck if a current deck is selected
      if (currentDeckId !== null) {
        cardsToSort = cardsToSort.filter(card => card.deckId === currentDeckId);
      }
      
      const sorted = cardsToSort.sort((a, b) => {
        const aDate = a.updatedAt || a.createdAt || 0;
        const bDate = b.updatedAt || b.createdAt || 0;
        return bDate - aDate; // Sort newest first
      });
      
      setSortedCards(sorted);
    }
  }, [collection, currentDeckId]);

  // Save collection when it changes
  useEffect(() => {
    if (collection) {
      saveCardsToStorage(collection.toArray());
    }
  }, [collection]);

  // Create a new card
  const handleCreateCard = (cardData) => {
    if (!collection || !cardData.deckId) return null;
    
    const newCard = collection.addCard(cardData);
    setCollection(new CardCollection([...collection.getAll()]));
    setEditingCard(null);
    return newCard;
  };

  // Update an existing card
  const handleUpdateCard = (cardData) => {
    if (!collection) return null;
    
    const updatedCard = collection.updateCard(cardData.id, cardData);
    if (updatedCard) {
      setCollection(new CardCollection([...collection.getAll()]));
      setEditingCard(null);
    }
    return updatedCard;
  };

  // Delete a card
  const handleDeleteCard = (cardId) => {
    if (!collection) return false;
    
    const success = collection.removeCard(cardId);
    if (success) {
      setCollection(new CardCollection([...collection.getAll()]));
    }
    return success;
  };

  // Set a card for editing
  const handleEditCard = (card) => {
    setEditingCard(card);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCard(null);
  };

  return {
    cards: sortedCards,
    editingCard,
    currentDeckId,
    setCurrentDeckId,
    createCard: handleCreateCard,
    updateCard: handleUpdateCard,
    deleteCard: handleDeleteCard,
    editCard: handleEditCard,
    cancelEdit: handleCancelEdit
  };
}

export default useCardCollection; 