import React from 'react';

export default function ReferenceSelection({ cards, onSelectReference }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8">
      {cards.map(card => (
        <div 
          key={card.id}
          onClick={() => onSelectReference(card.text)}
          className="border rounded-lg p-4 md:p-6 shadow-md cursor-pointer 
            hover:shadow-lg transition-transform duration-200 ease-in-out
            bg-white min-h-[200px] flex flex-col"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-2">{card.title}</h2>
          <div className="flex-1 overflow-hidden">
            <p className="text-base md:text-lg overflow-y-auto h-full
              leading-relaxed text-gray-700">
              {card.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}