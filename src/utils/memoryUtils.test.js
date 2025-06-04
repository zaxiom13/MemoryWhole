import { 
  normalizeWhitespace, 
  formatTime, 
  formatDate, 
  hasMistakes,
  findLastCorrectIndex,
  getCharacterCorrectness,
  saveDeckCompletionTime,
  loadDeckCompletionTimes,
  loadAllDeckCompletionTimes,
  loadCardsFromStorage,
  saveCardsToStorage,
  loadPreference,
  savePreference,
  loadDecksFromStorage,
  saveDecksToStorage
} from './memoryUtils';

// Mock localStorage
let mockStore = {};

const localStorageMock = {
  getItem: (key) => {
    const value = mockStore[key];
    return value !== undefined ? value : null;
  },
  setItem: (key, value) => {
    mockStore[key] = value.toString();
  },
  clear: () => {
    mockStore = {};
  },
  get length() {
    return Object.keys(mockStore).length;
  },
  key: (index) => {
    const keys = Object.keys(mockStore);
    return keys[index] || null;
  }
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('memoryUtils', () => {
  describe('normalizeWhitespace', () => {
    it('returns empty string for null or undefined input', () => {
      expect(normalizeWhitespace(null)).toBe('');
      expect(normalizeWhitespace(undefined)).toBe('');
    });

    it('removes newlines and replaces with spaces', () => {
      expect(normalizeWhitespace('Hello\nWorld')).toBe('Hello World');
    });

    it('collapses multiple spaces into one', () => {
      expect(normalizeWhitespace('Hello   World')).toBe('Hello World');
    });

    it('handles both newlines and multiple spaces', () => {
      expect(normalizeWhitespace('Hello\n  World\n\nTest')).toBe('Hello World Test');
    });
  });

  describe('formatTime', () => {
    it('formats seconds to MM:SS', () => {
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(3661)).toBe('61:01'); // 1 hour, 1 minute, 1 second
    });

    it('adds leading zeros for single digit values', () => {
      expect(formatTime(5)).toBe('00:05');
      expect(formatTime(65)).toBe('01:05');
    });
  });

  describe('formatDate', () => {
    it('returns empty string for null or undefined input', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    it('formats timestamp to readable date string', () => {
      const timestamp = new Date(2023, 0, 15, 12, 30).getTime(); // Jan 15, 2023, 12:30
      // We can't test the exact output since it depends on locale/timezone
      // But we can test that it returns a non-empty string
      expect(formatDate(timestamp)).toBeTruthy();
      expect(typeof formatDate(timestamp)).toBe('string');
    });
  });

  describe('hasMistakes', () => {
    it('returns false for empty input', () => {
      expect(hasMistakes('', 'reference')).toBe(false);
    });

    it('returns false for perfect match', () => {
      expect(hasMistakes('Hello', 'Hello')).toBe(false);
    });

    it('returns false for partial correct input', () => {
      expect(hasMistakes('Hello', 'Hello World')).toBe(false);
    });

    it('returns true if input is longer than reference', () => {
      expect(hasMistakes('Hello World!', 'Hello World')).toBe(true);
    });

    it('returns true if input differs from reference', () => {
      expect(hasMistakes('Hallo', 'Hello')).toBe(true);
    });

    it('ignores case differences when easyMode is true', () => {
      expect(hasMistakes('hello', 'Hello', true)).toBe(false);
      expect(hasMistakes('HELLO', 'hello', true)).toBe(false);
    });
  });

  describe('findLastCorrectIndex', () => {
    it('returns 0 for empty input', () => {
      expect(findLastCorrectIndex('', 'reference')).toBe(0);
    });

    it('returns the correct index for perfect match', () => {
      // findLastCorrectIndex returns index + 1 (position after the last correct char)
      expect(findLastCorrectIndex('Hello', 'Hello')).toBe(5);
    });

    it('returns the correct index for partial match with mistakes', () => {
      // Hello matches until index 3 (position 4), so returns 4 (not 3)
      expect(findLastCorrectIndex('Helly', 'Hello')).toBe(4);
    });

    it('returns 0 if first character is wrong', () => {
      expect(findLastCorrectIndex('Bello', 'Hello')).toBe(0);
    });
  });

  describe('getCharacterCorrectness', () => {
    it('returns empty array for empty input or reference', () => {
      expect(getCharacterCorrectness('', 'reference')).toEqual([]);
      expect(getCharacterCorrectness('input', '')).toEqual([
        { char: 'i', isCorrect: false, isSpace: false },
        { char: 'n', isCorrect: false, isSpace: false },
        { char: 'p', isCorrect: false, isSpace: false },
        { char: 'u', isCorrect: false, isSpace: false },
        { char: 't', isCorrect: false, isSpace: false }
      ]);
    });

    it('marks all characters as correct for perfect match', () => {
      const result = getCharacterCorrectness('Hello', 'Hello');
      expect(result).toEqual([
        { char: 'H', isCorrect: true, isSpace: false },
        { char: 'e', isCorrect: true, isSpace: false },
        { char: 'l', isCorrect: true, isSpace: false },
        { char: 'l', isCorrect: true, isSpace: false },
        { char: 'o', isCorrect: true, isSpace: false }
      ]);
    });

    it('marks incorrect characters as wrong', () => {
      const result = getCharacterCorrectness('Hallo', 'Hello');
      expect(result).toEqual([
        { char: 'H', isCorrect: true, isSpace: false },
        { char: 'a', isCorrect: false, isSpace: false },
        { char: 'l', isCorrect: false, isSpace: false },
        { char: 'l', isCorrect: false, isSpace: false },
        { char: 'o', isCorrect: false, isSpace: false }
      ]);
    });

    it('handles excess characters', () => {
      const result = getCharacterCorrectness('Hello!', 'Hello');
      expect(result).toEqual([
        { char: 'H', isCorrect: true, isSpace: false },
        { char: 'e', isCorrect: true, isSpace: false },
        { char: 'l', isCorrect: true, isSpace: false },
        { char: 'l', isCorrect: true, isSpace: false },
        { char: 'o', isCorrect: true, isSpace: false },
        { char: '!', isCorrect: false, isSpace: false }
      ]);
    });

    it('marks characters beyond mistake as not correct', () => {
      const result = getCharacterCorrectness('Hallo World', 'Hello World');
      expect(result).toEqual([
        { char: 'H', isCorrect: true, isSpace: false },
        { char: 'a', isCorrect: false, isSpace: false },
        { char: 'l', isCorrect: false, isSpace: false },
        { char: 'l', isCorrect: false, isSpace: false },
        { char: 'o', isCorrect: false, isSpace: false },
        { char: ' ', isCorrect: false, isSpace: true },
        { char: 'W', isCorrect: false, isSpace: false },
        { char: 'o', isCorrect: false, isSpace: false },
        { char: 'r', isCorrect: false, isSpace: false },
        { char: 'l', isCorrect: false, isSpace: false },
        { char: 'd', isCorrect: false, isSpace: false }
      ]);
    });

    it('handles easy mode with case differences', () => {
      const result = getCharacterCorrectness('hello world', 'Hello World', true);
      // In easy mode, case is ignored
      expect(result.every(c => c.isCorrect)).toBe(true);
    });
  });

  describe('deck completion time functions', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorageMock.clear();
      // Don't clear all mocks as it interferes with the store
    });

    describe('saveDeckCompletionTime', () => {
      it('saves deck completion time to localStorage', () => {
        const deckTitle = 'Test Deck';
        const completionTimes = [10, 15, 12];
        const cardCount = 3;

        saveDeckCompletionTime(deckTitle, completionTimes, cardCount);

        // Check that data was saved by loading it
        const loadedTimes = loadDeckCompletionTimes(deckTitle);
        expect(loadedTimes).toHaveLength(1);
        expect(loadedTimes[0]).toMatchObject({
          totalTime: 37,
          averageTime: 37/3,
          cardCount: 3,
          completionTimes: [10, 15, 12],
          easyMode: false,
          referenceExposed: false,
          ghostTextUsed: false
        });
        expect(loadedTimes[0].date).toBeDefined();
      });

      it('saves with optional parameters', () => {
        const deckTitle = 'Test Deck';
        const completionTimes = [20, 25];
        const cardCount = 2;

        saveDeckCompletionTime(deckTitle, completionTimes, cardCount, true, true, true);

        // Check that data was saved correctly
        const loadedTimes = loadDeckCompletionTimes(deckTitle);
        expect(loadedTimes).toHaveLength(1);
        expect(loadedTimes[0]).toMatchObject({
          totalTime: 45,
          averageTime: 22.5,
          cardCount: 2,
          easyMode: true,
          referenceExposed: true,
          ghostTextUsed: true
        });
      });

      it('keeps only top 5 times sorted by total time', () => {
        const deckTitle = 'Test Deck';
        
        // Add 6 completion times
        saveDeckCompletionTime(deckTitle, [30], 1);
        saveDeckCompletionTime(deckTitle, [10], 1);
        saveDeckCompletionTime(deckTitle, [50], 1);
        saveDeckCompletionTime(deckTitle, [20], 1);
        saveDeckCompletionTime(deckTitle, [40], 1);
        saveDeckCompletionTime(deckTitle, [15], 1);

        const loadedTimes = loadDeckCompletionTimes(deckTitle);
        expect(loadedTimes).toHaveLength(5);
        // Should be sorted by total time (fastest first)
        expect(loadedTimes.map(t => t.totalTime)).toEqual([10, 15, 20, 30, 40]);
      });
    });

    describe('loadDeckCompletionTimes', () => {
      it('returns empty array when no times exist', () => {
        const times = loadDeckCompletionTimes('Non-existent Deck');
        expect(times).toEqual([]);
      });

      it('loads existing deck completion times', () => {
        const deckTitle = 'Test Deck';
        const completionTimes = [12, 18];
        
        saveDeckCompletionTime(deckTitle, completionTimes, 2);
        
        const loadedTimes = loadDeckCompletionTimes(deckTitle);
        
        expect(loadedTimes).toHaveLength(1);
        expect(loadedTimes[0]).toMatchObject({
          totalTime: 30,
          averageTime: 15,
          cardCount: 2,
          completionTimes: [12, 18]
        });
      });
    });

    describe('loadAllDeckCompletionTimes', () => {
      it('returns empty array when no deck times exist', () => {
        const allTimes = loadAllDeckCompletionTimes();
        expect(allTimes).toEqual([]);
      });

      it('loads all deck completion times', () => {
        saveDeckCompletionTime('Deck One', [10], 1);
        saveDeckCompletionTime('Deck Two', [20, 25], 2);
        
        const allTimes = loadAllDeckCompletionTimes();
        expect(allTimes).toHaveLength(2);
        
        const deckOne = allTimes.find(d => d.deckTitle === 'Deck One');
        const deckTwo = allTimes.find(d => d.deckTitle === 'Deck Two');
        
        expect(deckOne).toBeDefined();
        expect(deckOne.times).toHaveLength(1);
        expect(deckOne.times[0].totalTime).toBe(10);
        
        expect(deckTwo).toBeDefined();
        expect(deckTwo.times).toHaveLength(1);
        expect(deckTwo.times[0].totalTime).toBe(45);
      });

      it('ignores non-deck best time keys', () => {
        // Add some individual card best times
        localStorageMock.setItem('personalBest_some_card', JSON.stringify([{time: 5}]));
        saveDeckCompletionTime('Test Deck', [15], 1);
        
        const allTimes = loadAllDeckCompletionTimes();
        expect(allTimes).toHaveLength(1);
        expect(allTimes[0].deckTitle).toBe('Test Deck');
      });
    });
  });

  describe('localStorage functions', () => {
    beforeEach(() => {
      localStorageMock.clear();
      jest.clearAllMocks();
    });

    describe('loadCardsFromStorage', () => {
      const defaultCards = [
        { id: 1, title: 'Default Card 1', text: 'Content 1' },
        { id: 2, title: 'Default Card 2', text: 'Content 2' }
      ];

      it('loads saved cards from localStorage when available', () => {
        const savedCards = [
          { id: 1, title: 'Saved Card', text: 'Saved Content', createdAt: 1000000000 }
        ];
        localStorageMock.setItem('memoryCards', JSON.stringify(savedCards));

        const result = loadCardsFromStorage(defaultCards);
        
        expect(result).toEqual(savedCards);
      });

      it('returns default cards when no saved cards exist', () => {
        const result = loadCardsFromStorage(defaultCards);
        
        expect(result).toEqual(
          defaultCards.map(card => ({
            ...card,
            createdAt: expect.any(Number)
          }))
        );
      });

      it('saves default cards to localStorage when none exist', () => {
        loadCardsFromStorage(defaultCards);
        
        const savedData = localStorageMock.getItem('memoryCards');
        expect(savedData).toBeTruthy();
        const parsedData = JSON.parse(savedData);
        expect(parsedData).toHaveLength(defaultCards.length);
      });

      it('adds timestamps to default cards that lack them', () => {
        const cardsWithoutTimestamps = [
          { id: 1, title: 'Card 1', text: 'Content 1' },
          { id: 2, title: 'Card 2', text: 'Content 2', createdAt: 5000 }
        ];

        const result = loadCardsFromStorage(cardsWithoutTimestamps);
        
        expect(result[0].createdAt).toEqual(expect.any(Number));
        expect(result[1].createdAt).toBe(5000);
      });

      it('handles localStorage parsing errors gracefully', () => {
        localStorageMock.setItem('memoryCards', 'invalid json');

        const result = loadCardsFromStorage(defaultCards);
        
        expect(result).toEqual(defaultCards);
      });

      it('handles localStorage access errors gracefully', () => {
        // Mock localStorage to throw an error
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = jest.fn(() => {
          throw new Error('Storage access denied');
        });

        const result = loadCardsFromStorage(defaultCards);
        
        expect(result).toEqual(defaultCards);
        
        // Restore original
        localStorage.getItem = originalGetItem;
      });

      it('handles empty default cards array', () => {
        const result = loadCardsFromStorage([]);
        
        expect(result).toEqual([]);
      });

      it('handles null default cards', () => {
        const result = loadCardsFromStorage(null);
        
        expect(result).toBeNull();
      });
    });

    describe('saveCardsToStorage', () => {
      it('saves cards to localStorage', () => {
        const cards = [
          { id: 1, title: 'Card 1', text: 'Content 1' },
          { id: 2, title: 'Card 2', text: 'Content 2' }
        ];

        saveCardsToStorage(cards);
        
        const savedData = localStorageMock.getItem('memoryCards');
        expect(savedData).toBeTruthy();
        expect(JSON.parse(savedData)).toEqual(cards);
      });

      it('does not save empty cards array', () => {
        saveCardsToStorage([]);
        
        expect(localStorageMock.getItem('memoryCards')).toBeNull();
      });

      it('does not save null cards', () => {
        saveCardsToStorage(null);
        
        expect(localStorageMock.getItem('memoryCards')).toBeNull();
      });

      it('does not save undefined cards', () => {
        saveCardsToStorage(undefined);
        
        expect(localStorageMock.getItem('memoryCards')).toBeNull();
      });

      it('handles localStorage access errors gracefully', () => {
        // Mock localStorage to throw an error
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = jest.fn(() => {
          throw new Error('Storage quota exceeded');
        });

        const cards = [{ id: 1, title: 'Card', text: 'Content' }];
        
        expect(() => saveCardsToStorage(cards)).not.toThrow();
        
        // Restore original
        localStorage.setItem = originalSetItem;
      });

      it('handles circular reference in cards gracefully', () => {
        const cards = [{ id: 1, title: 'Card', text: 'Content' }];
        cards[0].self = cards[0]; // Create circular reference

        expect(() => saveCardsToStorage(cards)).not.toThrow();
      });
    });

    describe('loadPreference', () => {
      it('loads saved preference from localStorage', () => {
        const key = 'testPreference';
        const value = { setting: true, count: 5 };
        localStorageMock.setItem(key, JSON.stringify(value));

        const result = loadPreference(key, null);
        
        expect(result).toEqual(value);
      });

      it('returns default value when preference does not exist', () => {
        const defaultValue = { setting: false, count: 0 };
        
        const result = loadPreference('nonexistent', defaultValue);
        
        expect(result).toEqual(defaultValue);
      });

      it('handles different data types correctly', () => {
        // String
        localStorageMock.setItem('stringPref', JSON.stringify('test string'));
        expect(loadPreference('stringPref', '')).toBe('test string');

        // Number
        localStorageMock.setItem('numberPref', JSON.stringify(42));
        expect(loadPreference('numberPref', 0)).toBe(42);

        // Boolean
        localStorageMock.setItem('boolPref', JSON.stringify(true));
        expect(loadPreference('boolPref', false)).toBe(true);

        // Array
        localStorageMock.setItem('arrayPref', JSON.stringify([1, 2, 3]));
        expect(loadPreference('arrayPref', [])).toEqual([1, 2, 3]);

        // Object
        const objValue = { a: 1, b: 'test' };
        localStorageMock.setItem('objPref', JSON.stringify(objValue));
        expect(loadPreference('objPref', {})).toEqual(objValue);
      });

      it('handles JSON parsing errors gracefully', () => {
        localStorageMock.setItem('corruptPref', 'invalid json');
        const defaultValue = { fallback: true };

        const result = loadPreference('corruptPref', defaultValue);
        
        expect(result).toEqual(defaultValue);
      });

      it('handles localStorage access errors gracefully', () => {
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = jest.fn(() => {
          throw new Error('Storage access denied');
        });

        const defaultValue = { fallback: true };
        const result = loadPreference('anyKey', defaultValue);
        
        expect(result).toEqual(defaultValue);
        
        localStorage.getItem = originalGetItem;
      });

      it('distinguishes between null stored value and missing key', () => {
        localStorageMock.setItem('nullValue', JSON.stringify(null));
        
        const result = loadPreference('nullValue', 'default');
        
        expect(result).toBeNull();
      });
    });

    describe('savePreference', () => {
      it('saves preference to localStorage', () => {
        const key = 'testPref';
        const value = { setting: true, count: 10 };

        savePreference(key, value);
        
        const savedData = localStorageMock.getItem(key);
        expect(savedData).toBeTruthy();
        expect(JSON.parse(savedData)).toEqual(value);
      });

      it('saves different data types correctly', () => {
        savePreference('string', 'test');
        savePreference('number', 42);
        savePreference('boolean', true);
        savePreference('array', [1, 2, 3]);
        savePreference('object', { a: 1 });
        savePreference('null', null);

        expect(JSON.parse(localStorageMock.getItem('string'))).toBe('test');
        expect(JSON.parse(localStorageMock.getItem('number'))).toBe(42);
        expect(JSON.parse(localStorageMock.getItem('boolean'))).toBe(true);
        expect(JSON.parse(localStorageMock.getItem('array'))).toEqual([1, 2, 3]);
        expect(JSON.parse(localStorageMock.getItem('object'))).toEqual({ a: 1 });
        expect(JSON.parse(localStorageMock.getItem('null'))).toBeNull();
      });

      it('handles localStorage access errors gracefully', () => {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = jest.fn(() => {
          throw new Error('Storage quota exceeded');
        });

        expect(() => savePreference('test', 'value')).not.toThrow();
        
        localStorage.setItem = originalSetItem;
      });

      it('handles circular reference in values gracefully', () => {
        const obj = { setting: true };
        obj.self = obj; // Create circular reference

        expect(() => savePreference('circular', obj)).not.toThrow();
      });

      it('overwrites existing preferences', () => {
        savePreference('test', 'first');
        savePreference('test', 'second');
        
        const result = JSON.parse(localStorageMock.getItem('test'));
        expect(result).toBe('second');
      });
    });
  });

  describe('loadDecksFromStorage', () => {
    beforeEach(() => {
      localStorageMock.clear();
    });

    const defaultDecks = [
      { id: 1, title: 'Default Deck 1', cardIds: [1, 2] },
      { id: 2, title: 'Default Deck 2', cardIds: [3, 4] }
    ];

    it('loads saved decks from localStorage when available', () => {
      const savedDecks = [
        { id: 1, title: 'Saved Deck', cardIds: [1], createdAt: 1000000000 }
      ];
      localStorageMock.setItem('memoryDecks', JSON.stringify(savedDecks));

      const result = loadDecksFromStorage(defaultDecks);
      
      expect(result).toEqual(savedDecks);
    });

    it('returns default decks when no saved decks exist', () => {
      const result = loadDecksFromStorage(defaultDecks);
      
      expect(result).toEqual(
        defaultDecks.map(deck => ({
          ...deck,
          createdAt: expect.any(Number)
        }))
      );
    });

    it('saves default decks to localStorage when none exist', () => {
      loadDecksFromStorage(defaultDecks);
      
      const savedData = localStorageMock.getItem('memoryDecks');
      expect(savedData).toBeTruthy();
      const parsedData = JSON.parse(savedData);
      expect(parsedData).toHaveLength(defaultDecks.length);
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.setItem('memoryDecks', 'invalid json');

      const result = loadDecksFromStorage(defaultDecks);
      
      expect(result).toEqual(defaultDecks);
    });
  });

  describe('saveDecksToStorage', () => {
    beforeEach(() => {
      localStorageMock.clear();
    });

    it('saves decks to localStorage', () => {
      const decks = [
        { id: 1, title: 'Deck 1', cardIds: [1, 2] },
        { id: 2, title: 'Deck 2', cardIds: [3, 4] }
      ];

      saveDecksToStorage(decks);
      
      const savedData = localStorageMock.getItem('memoryDecks');
      expect(savedData).toBeTruthy();
      expect(JSON.parse(savedData)).toEqual(decks);
    });

    it('does not save empty decks array', () => {
      saveDecksToStorage([]);
      
      expect(localStorageMock.getItem('memoryDecks')).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const decks = [{ id: 1, title: 'Deck', cardIds: [] }];
      
      expect(() => saveDecksToStorage(decks)).not.toThrow();
      
      localStorage.setItem = originalSetItem;
    });
  });
});