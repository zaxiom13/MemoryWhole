import { useState } from 'react';
/**
 * BatchUploadPage component for creating multiple cards from JSON
 */
function BatchUploadPage({ onCreateCards, onCancel }) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  // Handle JSON input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);
    setError('');
    setPreview(null);
  };

  // Validate JSON and generate preview
  const handleValidate = () => {
    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      
      // Check if it's an array
      if (!Array.isArray(parsed)) {
        setError('JSON must be an array of card objects');
        return;
      }

      // Validate each card object
      const validCards = [];
      const invalidIndices = [];

      parsed.forEach((item, index) => {
        if (!item.title || !item.text || typeof item.title !== 'string' || typeof item.text !== 'string') {
          invalidIndices.push(index);
        } else {
          validCards.push(item);
        }
      });

      if (invalidIndices.length > 0) {
        setError(`Invalid card objects at indices: ${invalidIndices.join(', ')}. Each card must have a title and text property.`);
        return;
      }

      if (validCards.length === 0) {
        setError('No valid card objects found');
        return;
      }

      setPreview(validCards);
    } catch (error) {
      setError(`Invalid JSON format: ${error.message}`);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!preview) {
      handleValidate();
      return;
    }
    
    onCreateCards(preview);
  };

  return (
    <div className="overflow-y-auto h-[calc(70vh-70px)] pr-2">
      <div className="sticky top-0 z-20 note-paper py-4 px-4 mx-0 shadow-sm mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Batch Upload Cards
        </h2>
        <button 
          onClick={onCancel}
          className="px-4 py-2 leather-button rounded-lg transition-all duration-300"
        >
          Cancel
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="jsonInput">
            JSON Data
          </label>
          <textarea
            id="jsonInput"
            name="jsonInput"
            value={jsonInput}
            onChange={handleInputChange}
            rows="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 font-mono"
            placeholder='[
  {
    "title": "Card Title 1",
    "text": "Card content 1"
  },
  {
    "title": "Card Title 2",
    "text": "Card content 2"
  }
]'
          ></textarea>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        {preview && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Preview ({preview.length} cards)
            </h3>
            <div className="max-h-60 overflow-y-auto border rounded p-3 bg-gray-50 dark:bg-gray-800">
              {preview.map((card, index) => (
                <div key={index} className="mb-3 p-2 border-b last:border-b-0">
                  <p className="font-semibold">{card.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {card.text.length > 100 ? card.text.substring(0, 100) + '...' : card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleValidate}
            className="leather-button font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
          >
            Validate JSON
          </button>
          <button
            type="submit"
            disabled={!preview}
            className={`leather-button font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ${!preview ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Create Cards
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Instructions</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Paste valid JSON array containing card objects</li>
          <li>Each card object must have a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">title</code> and <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">text</code> property</li>
          <li>Click "Validate JSON" to check your input</li>
          <li>Review the preview before creating cards</li>
        </ul>
      </div>
    </div>
  );
}

export default BatchUploadPage;