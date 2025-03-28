// useCardCollection.js - Custom hook for managing card collection
import { useState, useEffect, useCallback } from 'react';
import CardCollection from '../models/CardCollection';
import Card from '../models/Card'; // Import Card model
import Stack from '../models/Stack'; // Import Stack model
import { 
  loadCardsFromStorage, 
  saveCardsToStorage, 
  loadStacksFromStorage, 
  saveStacksToStorage 
} from '../utils/memoryUtils';

/**
 * Default cards data
 */
const defaultCards = [
  { 
    id: 1, 
    title: 'Ancient Wisdom', 
    text: `The journey of a thousand miles begins with a single step, but true mastery lies in understanding the terrain of the soul. Ancient philosophers taught that wisdom is not merely the accumulation of knowledge, but the alchemy of experience reflected through the prism of contemplation. 
    
    "He who knows others is learned; he who knows himself is wise," proclaimed Lao Tzu, reminding us that memory itself becomes transformative when intertwined with self-awareness. The Stoics of Athens would practice 'premeditatio malorum' - the premeditation of evils - not as pessimism, but as cognitive architecture to build resilience in the theater of the mind.`,
    createdAt: new Date('2023-01-01').getTime()
  },
  { 
    id: 2, 
    title: 'Cosmic Perspective', 
    text: `In the vast cosmic arena, our pale blue dot floats like a mote of stardust in the infinite dark. Carl Sagan's iconic reflection takes new dimension when paired with the revelation that there are more potential neural connections in your brain than stars in the observable universe. 
    
    The Voyager Golden Record, carrying Earth's memories into interstellar space, becomes a mirror showing both our fragility and audacity. Recent discoveries of exoplanets in habitable zones suggest we might be living in a universe where the ancient question "Are we alone?" transforms into "How shall we introduce ourselves?" The James Webb Space Telescope peers not just through space, but through time, capturing light that began its journey when memory itself was first taking shape in primordial human brains.`,
    createdAt: new Date('2023-01-15').getTime()
  },
  { 
    id: 3, 
    title: 'Technological Revolution', 
    text: `As we stand at the event horizon of the singularity, neural networks evolve from tools to collaborators. The AI alignment problem becomes the modern version of Prometheus' dilemma - how to harness fire without burning civilization. 
    
    Quantum computing threatens to crack SHA-256 encryption while promising unbreakable quantum keys, creating a paradoxical arms race against ourselves. Biohacking pioneers like Josiah Zayner demonstrate CRISPR's potential by editing their own DNA, blurring the line between human and technologist. Meanwhile, neuromorphic chips modeled on the human brain's architecture suggest that the next evolutionary leap might occur not in biological wetware, but in synthetic silicon substrates. The challenge becomes not memorization, but cultivating the wisdom to steer these tectonic forces.`,
    createdAt: new Date('2023-02-01').getTime()
  },
  { 
    id: 4, 
    title: 'Neural Plasticity', 
    text: `The human brain's ability to rewire itself challenges our traditional understanding of learning. Every time we form a new memory, thousands of neurons forge fresh connections, literally reshaping our neural architecture. This process, known as neuroplasticity, continues throughout our entire lives, defying the old belief that adult brains are fixed and unchangeable.
    
    Research shows that London taxi drivers' hippocampi - the brain region associated with spatial memory - physically grow larger as they memorize the city's labyrinthine streets. This remarkable adaptation demonstrates how intensive memory practice can literally expand our brain's capabilities.`,
    createdAt: new Date('2023-02-15').getTime()
  },
  { 
    id: 5, 
    title: 'Information Theory', 
    text: `Claude Shannon's revolutionary insight that information could be quantified transformed our understanding of communication. His mathematical framework showed that all messages, whether smoke signals or quantum bits, follow the same fundamental laws of information theory.
    
    Modern compression algorithms, built on Shannon's foundations, can detect patterns in seemingly random data, much like how human memory consolidates experiences by finding meaningful connections. The parallel between data compression and memory formation suggests deep links between information theory and cognitive science.`,
    createdAt: new Date('2023-03-01').getTime()
  },
  { 
    id: 6, 
    title: 'Memory Palaces', 
    text: `The ancient technique of memory palaces, used by memory champions worldwide, demonstrates the power of spatial thinking. By mentally placing information within familiar architectural spaces, practitioners can recall vast amounts of data with remarkable accuracy.
    
    This method, also known as the Method of Loci, was used by ancient Greek and Roman orators to memorize hours-long speeches. Modern neuroscience confirms that spatial memory engages multiple brain regions, creating stronger and more resilient memory traces than rote memorization.`,
    createdAt: new Date('2023-03-15').getTime()
  }
];

/**
 * Custom hook for managing card collection and stacks
 * @returns {Object} Card and stack collection state and operations
 */
function useCardCollection() {
  const [collection, setCollection] = useState(null);
  const [sortedCards, setSortedCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [stacks, setStacks] = useState([]); // State for stacks
  const [editingStack, setEditingStack] = useState(null); // State for editing stack

  // --- Data Loading --- 

  // Load cards on mount
  useEffect(() => {
    const rawCards = loadCardsFromStorage(defaultCards);
    const cardCollection = CardCollection.fromArray(rawCards);
    setCollection(cardCollection);
  }, []);

  // Load stacks on mount
  useEffect(() => {
    const rawStacks = loadStacksFromStorage();
    const stackObjects = rawStacks.map(stackData => Stack.fromObject(stackData));
    setStacks(stackObjects);
  }, []);

  // --- Data Persistence --- 

  // Save cards when collection changes
  useEffect(() => {
    if (collection) {
      saveCardsToStorage(collection.toArray());
    }
  }, [collection]);

  // Save stacks when stacks state changes
  useEffect(() => {
    const rawStacks = stacks.map(stack => stack.toObject());
    saveStacksToStorage(rawStacks);
  }, [stacks]);

  // --- Computed State --- 

  // Update sorted cards when collection changes
  useEffect(() => {
    if (collection) {
      // Sort by creation date, newest first
      const sorted = collection.getAll().sort((a, b) => b.createdAt - a.createdAt);
      setSortedCards(sorted);
    }
  }, [collection]);

  // --- Card Operations --- 

  // Create a new card
  const handleCreateCard = useCallback((cardData) => {
    if (!collection) return null;
    
    // Ensure stackId is handled correctly (null or number)
    const dataWithStackId = { 
      ...cardData, 
      stackId: cardData.stackId !== undefined ? Number(cardData.stackId) : null 
    };
    const newCard = collection.addCard(dataWithStackId); // CardCollection handles ID generation
    setCollection(new CardCollection([...collection.getAll()])); // Trigger update
    setEditingCard(null);
    return newCard;
  }, [collection]);

  // Update an existing card
  const handleUpdateCard = useCallback((cardData) => {
    if (!collection) return null;
    
    // Ensure stackId is handled correctly
    const dataWithStackId = { 
      ...cardData, 
      stackId: cardData.stackId !== undefined ? Number(cardData.stackId) : null 
    };
    const updatedCard = collection.updateCard(cardData.id, dataWithStackId);
    if (updatedCard) {
      setCollection(new CardCollection([...collection.getAll()])); // Trigger update
      setEditingCard(null);
    }
    return updatedCard;
  }, [collection]);

  // Delete a card
  const handleDeleteCard = useCallback((cardId) => {
    if (!collection) return false;
    
    const success = collection.removeCard(cardId);
    if (success) {
      setCollection(new CardCollection([...collection.getAll()])); // Trigger update
    }
    return success;
  }, [collection]);

  // Set a card for editing
  const handleEditCard = useCallback((card) => {
    setEditingCard(card);
  }, []);

  // Cancel editing card
  const handleCancelEditCard = useCallback(() => {
    setEditingCard(null);
  }, []);

  // --- Stack Operations --- 

  // Create a new stack
  const handleCreateStack = useCallback((stackData) => {
    const newStack = new Stack({ 
      ...stackData, 
      id: Date.now() // Simple ID generation for now
    });
    setStacks(prevStacks => [...prevStacks, newStack]);
    setEditingStack(null); // Close edit form if open
    return newStack;
  }, []);

  // Update an existing stack
  const handleUpdateStack = useCallback((stackData) => {
    setStacks(prevStacks => 
      prevStacks.map(stack => 
        stack.id === stackData.id ? stack.update(stackData) : stack
      )
    );
    setEditingStack(null); // Close edit form
    return stacks.find(s => s.id === stackData.id); // Return the updated stack (or undefined)
  }, [stacks]);

  // Delete a stack and optionally its cards
  const handleDeleteStack = useCallback((stackId, deleteCards = false) => {
    setStacks(prevStacks => prevStacks.filter(stack => stack.id !== stackId));

    if (deleteCards && collection) {
      const cardsToDelete = collection.getAll().filter(card => card.stackId === stackId);
      cardsToDelete.forEach(card => collection.removeCard(card.id));
      setCollection(new CardCollection([...collection.getAll()])); // Trigger card update
    }
  }, [collection]);

  // Set a stack for editing
  const handleEditStack = useCallback((stack) => {
    setEditingStack(stack);
  }, []);

  // Cancel editing stack
  const handleCancelEditStack = useCallback(() => {
    setEditingStack(null);
  }, []);

  return {
    // Cards
    cards: sortedCards,
    editingCard,
    createCard: handleCreateCard,
    updateCard: handleUpdateCard,
    deleteCard: handleDeleteCard,
    editCard: handleEditCard,
    cancelEditCard: handleCancelEditCard,
    getCardById: collection ? collection.getById.bind(collection) : () => null,
    getCardsByStackId: collection ? (stackId) => collection.getAll().filter(card => card.stackId === stackId) : () => [],

    // Stacks
    stacks, 
    editingStack,
    createStack: handleCreateStack,
    updateStack: handleUpdateStack,
    deleteStack: handleDeleteStack,
    editStack: handleEditStack,
    cancelEditStack: handleCancelEditStack,
    getStackById: (id) => stacks.find(s => s.id === id)
  };
}

export default useCardCollection; 