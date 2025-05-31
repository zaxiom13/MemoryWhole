import { 
  isInputCorrect, 
  isTypingComplete, 
  handleCompletion, 
  checkCorrectness,
  getGhostText,
  calculateAccuracy
} from './typingUtils';
import { savePersonalBestTime } from './memoryUtils';

// Mock memoryUtils functions
jest.mock('./memoryUtils', () => ({
  savePersonalBestTime: jest.fn(),
}));

describe('typingUtils', () => {
  describe('isInputCorrect', () => {
    it('returns true for empty input', () => {
      expect(isInputCorrect('', 'reference')).toBe(true);
    });

    it('returns true for empty reference', () => {
      expect(isInputCorrect('input', '')).toBe(true);
    });

    it('returns true for matching input', () => {
      expect(isInputCorrect('Hello', 'Hello World')).toBe(true);
    });

    it('returns false for non-matching input', () => {
      expect(isInputCorrect('Hallo', 'Hello World')).toBe(false);
    });

    it('is case sensitive', () => {
      expect(isInputCorrect('hello', 'Hello')).toBe(false);
    });

    it('respects whitespace', () => {
      expect(isInputCorrect('Hello ', 'Hello World')).toBe(true);
      expect(isInputCorrect('Hello  ', 'Hello World')).toBe(false);
    });
  });

  describe('isTypingComplete', () => {
    it('returns false for empty input', () => {
      expect(isTypingComplete('', 'reference', false)).toBe(false);
    });

    it('returns false for empty reference', () => {
      expect(isTypingComplete('input', '', false)).toBe(false);
    });

    it('returns true for exact match', () => {
      expect(isTypingComplete('Hello World', 'Hello World', false)).toBe(true);
    });

    it('returns false for partial match', () => {
      expect(isTypingComplete('Hello', 'Hello World', false)).toBe(false);
    });

    describe('easy mode', () => {
      it('returns true when missing only final punctuation', () => {
        expect(isTypingComplete('Hello World', 'Hello World.', true)).toBe(true);
        expect(isTypingComplete('Hello World', 'Hello World,', true)).toBe(true);
        expect(isTypingComplete('Hello World', 'Hello World!', true)).toBe(true);
        expect(isTypingComplete('Hello World', 'Hello World?', true)).toBe(true);
      });

      it('returns false when missing non-punctuation final character', () => {
        expect(isTypingComplete('Hello Worl', 'Hello World', true)).toBe(false);
      });
      
      it('returns false when missing multiple characters', () => {
        expect(isTypingComplete('Hello Wor', 'Hello World.', true)).toBe(false);
      });

      it('returns false when text differs beyond punctuation', () => {
        expect(isTypingComplete('Hello Word', 'Hello World.', true)).toBe(false);
      });
    });
  });

  describe('handleCompletion', () => {
    beforeEach(() => {
      // Clear mock history
      savePersonalBestTime.mockClear();
    });

    it('calls savePersonalBestTime with the correct parameters', () => {
      // Set up a controlled test environment
      const oldStartTime = window.startTime;
      const mockStartTime = Date.now() - 5000; // 5 seconds ago
      window.startTime = mockStartTime;
      
      // Call the function
      const result = handleCompletion('test reference', true, false, true);
      
      // Verify it called the save function with the right parameters
      // We can't test the exact time since it will vary, but we can check other params
      expect(savePersonalBestTime).toHaveBeenCalledWith(
        'test reference', 
        expect.any(Number), // don't test the exact time value
        true, 
        false, 
        true
      );
      
      // Verify return value is a number (time in seconds)
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      
      // Clean up
      window.startTime = oldStartTime;
    });

    it('calculates completion time correctly', () => {
      const oldStartTime = window.startTime;
      const mockStartTime = Date.now() - 3000; // 3 seconds ago
      window.startTime = mockStartTime;
      
      const result = handleCompletion('test', false, false, false);
      
      // Should be approximately 3 seconds (allowing some variance for execution time)
      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThanOrEqual(4);
      
      window.startTime = oldStartTime;
    });

    it('works with different parameter combinations', () => {
      const oldStartTime = window.startTime;
      window.startTime = Date.now() - 1000;

      // Test all boolean combinations
      handleCompletion('ref1', true, true, true);
      handleCompletion('ref2', false, false, false);
      handleCompletion('ref3', true, false, true);
      handleCompletion('ref4', false, true, false);

      expect(savePersonalBestTime).toHaveBeenCalledTimes(4);
      
      window.startTime = oldStartTime;
    });
  });

  describe('checkCorrectness', () => {
    it('returns correct object for empty inputs', () => {
      expect(checkCorrectness('', '')).toEqual({ isCorrect: true, correctIndex: 0 });
      expect(checkCorrectness('reference', '')).toEqual({ isCorrect: true, correctIndex: 0 });
      expect(checkCorrectness('', 'input')).toEqual({ isCorrect: true, correctIndex: 0 });
    });

    it('returns correct index for matching characters', () => {
      const result = checkCorrectness('Hello World', 'Hello');
      expect(result).toEqual({ isCorrect: true, correctIndex: 5 });
    });

    it('returns correct index for partial match', () => {
      const result = checkCorrectness('Hello World', 'Hell');
      expect(result).toEqual({ isCorrect: true, correctIndex: 4 });
    });

    it('identifies first incorrect character', () => {
      const result = checkCorrectness('Hello World', 'Hallo');
      expect(result).toEqual({ isCorrect: false, correctIndex: 1 });
    });

    it('handles case sensitivity', () => {
      const result = checkCorrectness('Hello', 'hello');
      expect(result).toEqual({ isCorrect: false, correctIndex: 0 });
    });

    it('handles whitespace differences', () => {
      const result = checkCorrectness('Hello World', 'Hello  World');
      expect(result).toEqual({ isCorrect: false, correctIndex: 5 });
    });

    it('works when input is longer than reference', () => {
      const result = checkCorrectness('Hi', 'Hello');
      expect(result).toEqual({ isCorrect: false, correctIndex: 0 });
    });

    it('handles exact match', () => {
      const result = checkCorrectness('Test', 'Test');
      expect(result).toEqual({ isCorrect: true, correctIndex: 4 });
    });

    it('handles single character inputs', () => {
      expect(checkCorrectness('A', 'A')).toEqual({ isCorrect: true, correctIndex: 1 });
      expect(checkCorrectness('A', 'B')).toEqual({ isCorrect: false, correctIndex: 0 });
    });

    it('ignores easyMode parameter (not used in current implementation)', () => {
      // The function currently doesn't use easyMode, but test that it doesn't break
      const result1 = checkCorrectness('Hello', 'Hell', true);
      const result2 = checkCorrectness('Hello', 'Hell', false);
      expect(result1).toEqual(result2);
    });
  });

  describe('getGhostText', () => {
    it('returns empty string for empty inputs', () => {
      expect(getGhostText('', '')).toBe('');
      expect(getGhostText('reference', '')).toBe('');
      expect(getGhostText('', 'input')).toBe('');
    });

    it('returns remaining text for correct input', () => {
      const result = getGhostText('Hello World', 'Hello');
      expect(result).toBe(' World');
    });

    it('returns empty string for incorrect input', () => {
      const result = getGhostText('Hello World', 'Hallo');
      expect(result).toBe('');
    });

    it('returns empty string when input is complete', () => {
      const result = getGhostText('Hello', 'Hello');
      expect(result).toBe('');
    });

    it('handles partial correct input', () => {
      const result = getGhostText('Testing', 'Test');
      expect(result).toBe('ing');
    });

    it('handles single character input', () => {
      const result = getGhostText('Hello', 'H');
      expect(result).toBe('ello');
    });

    it('handles input with errors at the end', () => {
      const result = getGhostText('Hello World', 'Hello Worlx');
      expect(result).toBe('');
    });

    it('ignores easyMode parameter (not used in current implementation)', () => {
      const result1 = getGhostText('Hello World', 'Hello', true);
      const result2 = getGhostText('Hello World', 'Hello', false);
      expect(result1).toEqual(result2);
    });
  });

  describe('calculateAccuracy', () => {
    it('returns 0 for empty inputs', () => {
      expect(calculateAccuracy('', '')).toBe(0);
      expect(calculateAccuracy('reference', '')).toBe(0);
      expect(calculateAccuracy('', 'input')).toBe(0);
    });

    it('returns 100 for exact match', () => {
      const result = calculateAccuracy('Hello World', 'Hello World', false);
      expect(result).toBe(100);
    });

    it('calculates accuracy for partial match', () => {
      const result = calculateAccuracy('Hello', 'Hell', false);
      expect(result).toBe(80); // 4 out of 5 characters = 80%
    });

    it('calculates accuracy for mismatched characters', () => {
      const result = calculateAccuracy('Hello', 'Hallo', false);
      expect(result).toBe(80); // 4 out of 5 characters match = 80%
    });

    it('returns 100 for typing complete in easy mode', () => {
      // Mock isTypingComplete to return true
      const originalIsTypingComplete = require('./typingUtils').isTypingComplete;
      const mockIsTypingComplete = jest.fn().mockReturnValue(true);
      
      // Temporarily replace the function
      jest.doMock('./typingUtils', () => ({
        ...jest.requireActual('./typingUtils'),
        isTypingComplete: mockIsTypingComplete
      }));

      const { calculateAccuracy: mockedCalculateAccuracy } = require('./typingUtils');
      const result = mockedCalculateAccuracy('Hello.', 'Hello', true);
      
      expect(result).toBe(100);
      
      // Restore original
      jest.unmock('./typingUtils');
    });

    it('handles input longer than reference', () => {
      const result = calculateAccuracy('Hi', 'Hello', false);
      // For 'Hi' vs 'Hello': comparing first 2 chars 'Hi' vs 'He'
      // H vs H = match, i vs e = no match
      // 1 match out of 2 reference chars = 50%
      expect(result).toBe(50);
    });

    it('handles no matching characters', () => {
      const result = calculateAccuracy('abcd', 'efgh', false);
      expect(result).toBe(0);
    });

    it('calculates accuracy correctly for mixed case', () => {
      const result = calculateAccuracy('Hello', 'hello', false);
      // H vs h = no match, e vs e = match, l vs l = match, l vs l = match, o vs o = match
      // 4 matches out of 5 characters = 80%
      expect(result).toBe(80);
    });

    it('handles whitespace correctly', () => {
      const result = calculateAccuracy('a b c', 'a c c', false);
      // Position 0: a vs a = match
      // Position 1: ' ' vs ' ' = match  
      // Position 2: b vs c = no match
      // Position 3: ' ' vs ' ' = match
      // Position 4: c vs c = match
      // 4 matches out of 5 = 80%
      expect(result).toBe(80);
    });

    it('calculates partial accuracy correctly', () => {
      const result = calculateAccuracy('Testing', 'Test', false);
      expect(result).toBeCloseTo(57.14, 2); // 4 out of 7 characters ≈ 57.14%
    });
  });

  // Property-based testing for robust validation
  describe('property-based tests', () => {
    // Helper to generate random strings
    const generateRandomString = (length) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    it('isInputCorrect properties', () => {
      for (let i = 0; i < 50; i++) {
        const reference = generateRandomString(Math.floor(Math.random() * 20) + 1);
        const input = reference.substring(0, Math.floor(Math.random() * reference.length));
        
        // Property: any prefix of the reference should be correct
        expect(isInputCorrect(input, reference)).toBe(true);
        
        // Property: empty input should always be correct
        expect(isInputCorrect('', reference)).toBe(true);
      }
    });

    it('checkCorrectness properties', () => {
      for (let i = 0; i < 50; i++) {
        const reference = generateRandomString(Math.floor(Math.random() * 20) + 1);
        const input = generateRandomString(Math.floor(Math.random() * 20) + 1);
        
        const result = checkCorrectness(reference, input);
        
        // Properties that should always hold
        expect(result.correctIndex).toBeGreaterThanOrEqual(0);
        expect(result.correctIndex).toBeLessThanOrEqual(Math.min(input.length, reference.length));
        expect(typeof result.isCorrect).toBe('boolean');
        
        // If isCorrect is true, correctIndex should equal input length
        if (result.isCorrect) {
          expect(result.correctIndex).toBe(input.length);
        }
      }
    });

    it('calculateAccuracy properties', () => {
      for (let i = 0; i < 50; i++) {
        const reference = generateRandomString(Math.floor(Math.random() * 20) + 1);
        const input = generateRandomString(Math.floor(Math.random() * 20) + 1);
        
        const accuracy = calculateAccuracy(reference, input, false);
        
        // Properties that should always hold
        expect(accuracy).toBeGreaterThanOrEqual(0);
        expect(accuracy).toBeLessThanOrEqual(100);
        expect(typeof accuracy).toBe('number');
        
        // Exact match should give 100% (unless affected by isTypingComplete)
        if (input === reference) {
          expect(accuracy).toBe(100);
        }
      }
    });
  });

  // Fuzz testing for edge cases
  describe('fuzz testing', () => {
    const fuzzInputs = [
      '',
      ' ',
      '\n',
      '\t',
      'a',
      'A',
      '!',
      '123',
      '...',
      '   multiple   spaces   ',
      'Mixed123!@#$%^&*()',
      'Very long text that goes on and on and includes many different characters and edge cases',
      'Unicode: 你好世界 🌍',
      'Emoji: 😀😃😄😁',
      '\n\r\t',
      Array(1000).fill('a').join(''), // Very long string
    ];

    it('handles various input combinations without crashing', () => {
      fuzzInputs.forEach(input => {
        fuzzInputs.forEach(reference => {
          // These should not throw errors
          expect(() => isInputCorrect(input, reference)).not.toThrow();
          expect(() => checkCorrectness(reference, input, true)).not.toThrow();
          expect(() => checkCorrectness(reference, input, false)).not.toThrow();
          expect(() => getGhostText(reference, input, true)).not.toThrow();
          expect(() => getGhostText(reference, input, false)).not.toThrow();
          expect(() => calculateAccuracy(reference, input, true)).not.toThrow();
          expect(() => calculateAccuracy(reference, input, false)).not.toThrow();
          expect(() => isTypingComplete(input, reference, true)).not.toThrow();
          expect(() => isTypingComplete(input, reference, false)).not.toThrow();
        });
      });
    });

    it('returns valid results for all fuzz inputs', () => {
      fuzzInputs.forEach(input => {
        fuzzInputs.forEach(reference => {
          const correctness = checkCorrectness(reference, input);
          expect(typeof correctness.isCorrect).toBe('boolean');
          expect(typeof correctness.correctIndex).toBe('number');
          
          const accuracy = calculateAccuracy(reference, input, false);
          expect(typeof accuracy).toBe('number');
          expect(accuracy).toBeGreaterThanOrEqual(0);
          expect(accuracy).toBeLessThanOrEqual(100);
          
          const ghostText = getGhostText(reference, input);
          expect(typeof ghostText).toBe('string');
          
          const isCorrect = isInputCorrect(input, reference);
          expect(typeof isCorrect).toBe('boolean');
          
          const isComplete = isTypingComplete(input, reference, false);
          expect(typeof isComplete).toBe('boolean');
        });
      });
    });
  });
});