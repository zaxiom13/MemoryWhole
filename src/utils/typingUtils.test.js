import { isInputCorrect, isTypingComplete, handleCompletion } from './typingUtils';
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
      handleCompletion('test reference', true, false, true);
      
      // Verify it called the save function with the right parameters
      // We can't test the exact time since it will vary, but we can check other params
      expect(savePersonalBestTime).toHaveBeenCalledWith(
        'test reference', 
        expect.any(Number), // don't test the exact time value
        true, 
        false, 
        true
      );
      
      // Clean up
      window.startTime = oldStartTime;
    });
  });
});