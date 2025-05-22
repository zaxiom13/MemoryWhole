import { useState } from 'react';

function BatchUploadPage({ onCreateCards, onCancel }) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState('');

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

  const handleGenerateWithAI = () => {
    // Hardcoded response for demonstration
    const mockAIResponse = [
      {
        "title": "Ancient Rome",
        "text": "The Roman Empire was one of the largest and most influential civilizations in world history."
      },
      {
        "title": "Renaissance Art",
        "text": "The Renaissance period marked a great revival of classical learning and wisdom after the Middle Ages."
      },
      {
        "title": "Industrial Revolution",
        "text": "A period of major industrialization that transformed largely rural societies into industrial ones."
      }
    ];

    setJsonInput(JSON.stringify(mockAIResponse, null, 2));
    setError('');
    setPreview(null);
  };

  return (
    // Main scrollable div: Adjusted min-h for mobile
    <div className="overflow-y-auto min-h-[calc(50vh-60px)] sm:min-h-[calc(70vh-70px)] pr-2">
      {/* Sticky Header: Removed note-paper, added new bg and blur effect */}
      <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md shadow-sm py-4 px-4 mx-0 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Batch Upload Cards
        </h2>
        <button
          onClick={onCancel}
          className="leather-button" // Removed custom padding & redundant classes
        >
          Cancel
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="prompt">
            AI Prompt
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="enhanced-input flex-1" // Applied enhanced-input
              placeholder="Enter a prompt for AI generation..."
            />
            <button
              type="button"
              onClick={handleGenerateWithAI}
              className="leather-button" // Removed custom padding & redundant classes
            >
              Generate with AI
            </button>
          </div>
        </div>

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
            className="enhanced-textarea font-mono" // Applied enhanced-textarea, kept font-mono
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
            {/* Adjusted preview area bg and added shadow */}
            <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700 shadow-sm">
              {preview.map((card, index) => (
                <div key={index} className="mb-3 p-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{card.title}</p>
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
            className="leather-button" // Removed custom padding & redundant classes
          >
            Validate JSON
          </button>
          <button
            type="submit"
            disabled={!preview}
            className={`leather-button ${!preview ? 'opacity-50 cursor-not-allowed' : ''}`} // Removed custom padding & redundant classes
          >
            Create Cards
          </button>
        </div>
      </form>

      {/* Instructions Area: Adjusted bg and added shadow */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Instructions</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Paste valid JSON array containing card objects</li>
          <li>Each card object must have a <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">title</code> and <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">text</code> property</li> {/* Adjusted code bg for dark mode */}
          <li>Click "Validate JSON" to check your input</li>
          <li>Review the preview before creating cards</li>
        </ul>
      </div>
    </div>
  );
}

export default BatchUploadPage;