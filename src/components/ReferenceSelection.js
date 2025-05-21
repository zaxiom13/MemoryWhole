import React from 'react';

export default function ReferenceSelection({ cards, onSelectReference }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8">
      {cards.map(card => (
        <div
          key={card.id}
          onClick={() => onSelectReference(card.text)}
          // Applied new card styling for consistency
          className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-lg p-4 md:p-6 transition-shadow duration-300 cursor-pointer min-h-[200px] flex flex-col border border-gray-200 dark:border-gray-700" // Added border for light mode consistency too
        >
          {/* Added dark mode text color */}
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{card.title}</h2>
          <div className="flex-1 overflow-hidden">
            {/* Added dark mode text color */}
            <p className="text-base md:text-lg overflow-y-auto h-full leading-relaxed text-gray-700 dark:text-gray-300">
              {card.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}