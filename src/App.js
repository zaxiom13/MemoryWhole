import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReferenceConfirmation from './components/ReferenceConfirmation';
import ReferenceTyping from './components/ReferenceTyping';
import TutorialGuide from './components/TutorialGuide';
import HomePage from './components/HomePage';
import CompletionPage from './components/CompletionPage';

const cards = [
  { 
    id: 1, 
    title: 'Ancient Wisdom', 
    text: `The journey of a thousand miles begins with a single step, but true mastery lies in understanding the terrain of the soul. Ancient philosophers taught that wisdom is not merely the accumulation of knowledge, but the alchemy of experience reflected through the prism of contemplation. 
    
    "He who knows others is learned; he who knows himself is wise," proclaimed Lao Tzu, reminding us that memory itself becomes transformative when intertwined with self-awareness. The Stoics of Athens would practice 'premeditatio malorum' - the premeditation of evils - not as pessimism, but as cognitive architecture to build resilience in the theater of the mind.` 
  },
  { 
    id: 2, 
    title: 'Cosmic Perspective', 
    text: `In the vast cosmic arena, our pale blue dot floats like a mote of stardust in the infinite dark. Carl Sagan's iconic reflection takes new dimension when paired with the revelation that there are more potential neural connections in your brain than stars in the observable universe. 
    
    The Voyager Golden Record, carrying Earth's memories into interstellar space, becomes a mirror showing both our fragility and audacity. Recent discoveries of exoplanets in habitable zones suggest we might be living in a universe where the ancient question "Are we alone?" transforms into "How shall we introduce ourselves?" The James Webb Space Telescope peers not just through space, but through time, capturing light that began its journey when memory itself was first taking shape in primordial human brains.` 
  },
  { 
    id: 3, 
    title: 'Technological Revolution', 
    text: `As we stand at the event horizon of the singularity, neural networks evolve from tools to collaborators. The AI alignment problem becomes the modern version of Prometheus' dilemma - how to harness fire without burning civilization. 
    
    Quantum computing threatens to crack SHA-256 encryption while promising unbreakable quantum keys, creating a paradoxical arms race against ourselves. Biohacking pioneers like Josiah Zayner demonstrate CRISPR's potential by editing their own DNA, blurring the line between human and technologist. Meanwhile, neuromorphic chips modeled on the human brain's architecture suggest that the next evolutionary leap might occur not in biological wetware, but in synthetic silicon substrates. The challenge becomes not memorization, but cultivating the wisdom to steer these tectonic forces.` 
  },
  { 
    id: 4, 
    title: 'Neural Plasticity', 
    text: `The human brain's ability to rewire itself challenges our traditional understanding of learning. Every time we form a new memory, thousands of neurons forge fresh connections, literally reshaping our neural architecture. This process, known as neuroplasticity, continues throughout our entire lives, defying the old belief that adult brains are fixed and unchangeable.
    
    Research shows that London taxi drivers' hippocampi - the brain region associated with spatial memory - physically grow larger as they memorize the city's labyrinthine streets. This remarkable adaptation demonstrates how intensive memory practice can literally expand our brain's capabilities.`
  },
  { 
    id: 5, 
    title: 'Information Theory', 
    text: `Claude Shannon's revolutionary insight that information could be quantified transformed our understanding of communication. His mathematical framework showed that all messages, whether smoke signals or quantum bits, follow the same fundamental laws of information theory.
    
    Modern compression algorithms, built on Shannon's foundations, can detect patterns in seemingly random data, much like how human memory consolidates experiences by finding meaningful connections. The parallel between data compression and memory formation suggests deep links between information theory and cognitive science.`
  },
  { 
    id: 6, 
    title: 'Memory Palaces', 
    text: `The ancient technique of memory palaces, used by memory champions worldwide, demonstrates the power of spatial thinking. By mentally placing information within familiar architectural spaces, practitioners can recall vast amounts of data with remarkable accuracy.
    
    This method, also known as the Method of Loci, was used by ancient Greek and Roman orators to memorize hours-long speeches. Modern neuroscience confirms that spatial memory engages multiple brain regions, creating stronger and more resilient memory traces than rote memorization.`
  }
];

// Modify initial state
export default function App() {
  const [step, setStep] = useState(localStorage.getItem('tutorialComplete') ? 1 : 0);
  const [selectedReference, setSelectedReference] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUserInput(newValue);
    
    if (newValue.length === selectedReference.length && 
        newValue === selectedReference) {
      setIsComplete(true);
      setCompletionTime(Math.floor((Date.now() - window.startTime) / 1000));
    }
  };

  const handleSelectReference = (text) => {
    setSelectedReference(text);
    setUserInput('');
    setStep(2);
  };

  const handleTypingBack = () => {
    setUserInput('');
    setStep(2);
    window.startTime = null;
  };

  const handleReturnToMenu = () => {
    setStep(1);
    setIsComplete(false);
    setUserInput('');
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <AnimatePresence>
        {step === 0 ? (
          <TutorialGuide onComplete={() => {
            localStorage.setItem('tutorialComplete', 'true');
            setStep(1);
          }} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <style>
              {`
                ::-webkit-scrollbar {
                  width: 6px;
                  opacity: 0;
                  transition: opacity 0.2s;
                }
                ::-webkit-scrollbar-track {
                  background: rgba(241, 241, 241, 0.5);
                  border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                  background: linear-gradient(to bottom, #6366f1, #8b5cf6, #ec4899);
                  border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(to bottom, #4f46e5, #7c3aed, #db2777);
                }
                .h-[70vh]:hover::-webkit-scrollbar {
                  opacity: 1;
                }
                .card-gradient-1 { background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); }
                .card-gradient-2 { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); }
                .card-gradient-3 { background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%); }
                .card-gradient-4 { background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); }
                .card-gradient-5 { background: linear-gradient(135deg, #ede9fe 0%, #fbcfe8 100%); }
                .card-gradient-6 { background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); }
              `}
            </style>
            <h1 className="text-5xl font-bold mb-6 sticky top-0 z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-2">
              Memory Whole
            </h1>
            <div className="w-full max-w-2xl h-[80vh] relative backdrop-blur-sm bg-white/30 rounded-xl shadow-xl p-6 border border-white/50">
              {step === 1 && (
                <HomePage 
                  cards={cards} 
                  onSelectReference={handleSelectReference} 
                />
              )}
              {step === 2 && (
                <ReferenceConfirmation 
                  selectedReference={selectedReference}
                  onConfirm={() => {
                    setStep(3);
                    window.startTime = Date.now();
                  }}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <>
                  {isComplete ? (
                    <CompletionPage 
                      completionTime={completionTime}
                      onReturnToMenu={handleReturnToMenu}
                      formatTime={formatTime}
                    />
                  ) : (
                    <ReferenceTyping 
                      userInput={userInput}
                      selectedReference={selectedReference}
                      onInputChange={handleInputChange}
                      onBack={handleTypingBack}
                      isComplete={isComplete}
                    />
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
