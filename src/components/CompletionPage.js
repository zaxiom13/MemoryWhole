import { motion } from 'framer-motion';

function CompletionPage({ completionTime, onReturnToMenu, formatTime }) {
  return (
    <motion.div 
      className="text-center p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg text-white"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.h2 
        className="text-3xl mb-4 font-bold"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ duration: 0.5, repeat: 2, repeatType: "reverse" }}
      >
        Congratulations! 🎉
      </motion.h2>
      <p className="text-xl mb-6">
        You completed the task in <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">{formatTime(completionTime)}</span>
      </p>
      <button 
        onClick={onReturnToMenu}
        className="bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 font-bold shadow-md transition-all duration-300"
      >
        Return to Menu
      </button>
    </motion.div>
  );
}

export default CompletionPage;