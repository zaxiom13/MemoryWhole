import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const tutorialSteps = [
  {
    title: "Welcome to MemoryWhole 🧠",
    content: "Train your memory like ancient philosophers with modern neuroscience techniques.",
    icon: "📚"
  },
  {
    title: "Choose Your Wisdom",
    content: "Select from philosophical texts, scientific concepts, or literary masterpieces.",
    icon: "✨"
  },
  {
    title: "Color-Coded Feedback",
    content: "As you type, green text shows correct characters while red highlights mistakes, providing instant feedback on your progress.",
    icon: "🎯"
  },
  {
    title: "Ghost Text Assistance",
    content: "If you get stuck, ghost text will appear after a brief pause to help you continue without starting over.",
    icon: "👻"
  },
  {
    title: "Time Tracking",
    content: "Your time is tracked, so you can compare your progress with others.",
    icon: "🧪"
  }
];

export default function TutorialGuide({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 flex flex-col items-center justify-center p-8">
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl text-center"
        >
          <div className="text-8xl mb-6 animate-bounce">
            {tutorialSteps[currentStep].icon}
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            {tutorialSteps[currentStep].title}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {tutorialSteps[currentStep].content}
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
            )}
            
            {currentStep < tutorialSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors animate-pulse"
              >
                Begin Your Journey
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}