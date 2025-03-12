import React from 'react';

export default function ReferenceSelection({ cards, onSelectReference }) {
  return (
    <div className="flex gap-6">
      {cards.map(card => (
        <div 
          key={card.id}
          onClick={() => onSelectReference(card.text)}
          className="border rounded-lg p-6 shadow-md cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
          <p>{card.text}</p>
        </div>
      ))}
    </div>
  );
}