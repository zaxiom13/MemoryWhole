import React from 'react';

export default function ReferenceConfirmation({ selectedReference, onConfirm, onBack }) {
  return (
    <div className="w-full max-w-screen-sm h-[50]% ">
      <div className="mt-4 p-4 border rounded shadow bg-white  overflow-y-auto">
        <h3 className="text-lg md:text-xl font-semibold mb-2">Selected Reference</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {selectedReference}
        </p>
      </div>
      {/* Buttons container remains the same but with responsive spacing */}
      <div className="flex flex-col md:flex-row gap-2 mt-4 px-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded shadow 
            hover:bg-blue-600 transition w-full md:w-auto"
          onClick={onConfirm}
        >
          Confirm
        </button>
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded shadow 
            hover:bg-gray-600 transition w-full md:w-auto"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}