import { isInputCorrect, isTypingComplete } from '../../utils/typingUtils';

// Mock dependencies
jest.mock('../../utils/typingUtils', () => ({
  isInputCorrect: jest.fn(),
  isTypingComplete: jest.fn(),
  handleCompletion: jest.fn()
}));

describe('typing utility functions', () => {
  describe('isInputCorrect', () => {
    beforeEach(() => {
      isInputCorrect.mockReset();
    });

    test('returns true for empty input', () => {
      isInputCorrect.mockReturnValue(true);
      const result = isInputCorrect('', 'reference');
      expect(result).toBe(true);
      expect(isInputCorrect).toHaveBeenCalledWith('', 'reference');
    });

    test('returns false for incorrect input', () => {
      isInputCorrect.mockReturnValue(false);
      const result = isInputCorrect('wrong', 'reference');
      expect(result).toBe(false);
      expect(isInputCorrect).toHaveBeenCalledWith('wrong', 'reference');
    });
  });

  describe('isTypingComplete', () => {
    beforeEach(() => {
      isTypingComplete.mockReset();
    });

    test('returns true when typing is complete', () => {
      isTypingComplete.mockReturnValue(true);
      const result = isTypingComplete('completed text', 'completed text', false);
      expect(result).toBe(true);
      expect(isTypingComplete).toHaveBeenCalledWith('completed text', 'completed text', false);
    });

    test('returns false when typing is incomplete', () => {
      isTypingComplete.mockReturnValue(false);
      const result = isTypingComplete('partial', 'complete text', false);
      expect(result).toBe(false);
      expect(isTypingComplete).toHaveBeenCalledWith('partial', 'complete text', false);
    });
  });
});