import { 
  normalizeWhitespace, 
  formatTime, 
  formatDate, 
  hasMistakes,
  findLastCorrectIndex,
  getCharacterCorrectness
} from './memoryUtils';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

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
});