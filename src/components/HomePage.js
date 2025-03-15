import { motion } from 'framer-motion';

function HomePage({ cards, onSelectReference }) {
  return (
    <>
      <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm py-4 px-4 mx-0 shadow-lg">
        <h2 className="text-2xl text-center font-semibold text-white">
          Choose a passage to practice your memory
        </h2>
      </div>
      <div className="overflow-y-auto h-[calc(70vh-120px)] pr-2">
        <div className="grid grid-cols-1 gap-6 mt-6">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`card-gradient-${card.id} p-6 rounded-lg shadow-lg border border-white/50 h-[200px] flex flex-col cursor-pointer transition-all duration-300`}
              onClick={() => onSelectReference(card.text)}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{card.title}</h3>
              <div className="flex-grow backdrop-blur-sm bg-white/20 p-3 rounded-lg">
                <p className="whitespace-pre-line text-gray-700">
                  {card.text.split('\n')[0].substring(0, 150)}...
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;