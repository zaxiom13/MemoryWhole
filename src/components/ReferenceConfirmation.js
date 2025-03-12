import React from 'react';

export default function ReferenceConfirmation({ selectedReference, onConfirm, onBack }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mt-8 p-4 border rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Selected Reference</h3>
        <p>{selectedReference}</p>
      </div>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        onClick={onConfirm}
      >
        Confirm
      </button>
      <button 
        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}