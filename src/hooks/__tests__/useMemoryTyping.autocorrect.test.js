import { renderHook, act } from '@testing-library/react';
import useMemoryTyping from '../useMemoryTyping';

describe('useMemoryTyping autocorrect behavior', () => {
  test('wrong case letters are corrected in easy mode', () => {
    const { result } = renderHook(() =>
      useMemoryTyping({ referenceText: 'Hello', easyMode: true })
    );

    act(() => {
      result.current.handleInputChange({ target: { value: 'h' } });
    });
    expect(result.current.userInput).toBe('H');

    act(() => {
      result.current.handleInputChange({ target: { value: 'HE' } });
    });
    expect(result.current.userInput).toBe('He');
  });

  test('punctuation is inserted automatically after correct input', () => {
    const { result } = renderHook(() =>
      useMemoryTyping({ referenceText: 'Wow?!', easyMode: true })
    );

    act(() => {
      result.current.handleInputChange({ target: { value: 'W' } });
    });
    act(() => {
      result.current.handleInputChange({ target: { value: 'Wo' } });
    });
    act(() => {
      result.current.handleInputChange({ target: { value: 'Wow' } });
    });

    expect(result.current.userInput).toBe('Wow?!');
  });
});
