import { renderHook, act } from '@testing-library/react';
import useStatistics from './useStatistics';
import { useAppState } from '../../contexts/AppStateContext';

// Mock the AppStateContext
jest.mock('../../contexts/AppStateContext', () => ({
  useAppState: jest.fn()
}));

describe('useStatistics', () => {
  const mockSetStep = jest.fn();

  beforeEach(() => {
    // Reset mocks
    mockSetStep.mockClear();
    useAppState.mockReturnValue({
      setStep: mockSetStep
    });
  });

  describe('initialization', () => {
    it('returns an object with handleViewBestTimes function', () => {
      const { result } = renderHook(() => useStatistics());
      
      expect(result.current).toEqual({
        handleViewBestTimes: expect.any(Function)
      });
    });

    it('does not call setStep on initialization', () => {
      renderHook(() => useStatistics());
      
      expect(mockSetStep).not.toHaveBeenCalled();
    });
  });

  describe('handleViewBestTimes', () => {
    it('calls setStep with value 4', () => {
      const { result } = renderHook(() => useStatistics());
      
      act(() => {
        result.current.handleViewBestTimes();
      });
      
      expect(mockSetStep).toHaveBeenCalledTimes(1);
      expect(mockSetStep).toHaveBeenCalledWith(4);
    });

    it('can be called multiple times', () => {
      const { result } = renderHook(() => useStatistics());
      
      act(() => {
        result.current.handleViewBestTimes();
        result.current.handleViewBestTimes();
        result.current.handleViewBestTimes();
      });
      
      expect(mockSetStep).toHaveBeenCalledTimes(3);
      expect(mockSetStep).toHaveBeenNthCalledWith(1, 4);
      expect(mockSetStep).toHaveBeenNthCalledWith(2, 4);
      expect(mockSetStep).toHaveBeenNthCalledWith(3, 4);
    });

    it('provides a new function reference after re-renders', () => {
      const { result, rerender } = renderHook(() => useStatistics());
      const firstHandleViewBestTimes = result.current.handleViewBestTimes;

      rerender();
      const secondHandleViewBestTimes = result.current.handleViewBestTimes;

      expect(firstHandleViewBestTimes).not.toBe(secondHandleViewBestTimes);
    });
  });

  describe('error handling', () => {
    it('handles when setStep throws an error', () => {
      const mockError = new Error('Test error');
      mockSetStep.mockImplementation(() => {
        throw mockError;
      });
      
      const { result } = renderHook(() => useStatistics());
      
      expect(() => {
        act(() => {
          result.current.handleViewBestTimes();
        });
      }).toThrow('Test error');
    });

    it('works when useAppState returns undefined setStep', () => {
      useAppState.mockReturnValue({
        setStep: undefined
      });
      
      const { result } = renderHook(() => useStatistics());
      
      expect(() => {
        act(() => {
          result.current.handleViewBestTimes();
        });
      }).toThrow();
    });
  });

  describe('integration with different AppState contexts', () => {
    it('works with different setStep implementations', () => {
      const alternateSetStep = jest.fn();
      useAppState.mockReturnValue({
        setStep: alternateSetStep
      });
      
      const { result } = renderHook(() => useStatistics());
      
      act(() => {
        result.current.handleViewBestTimes();
      });
      
      expect(alternateSetStep).toHaveBeenCalledWith(4);
      expect(mockSetStep).not.toHaveBeenCalled();
    });

    it('adapts when AppState context changes', () => {
      const { result, rerender } = renderHook(() => useStatistics());
      
      // First call with original mock
      act(() => {
        result.current.handleViewBestTimes();
      });
      expect(mockSetStep).toHaveBeenCalledWith(4);
      
      // Change the mock
      const newSetStep = jest.fn();
      useAppState.mockReturnValue({
        setStep: newSetStep
      });
      
      rerender();
      
      // Second call with new mock
      act(() => {
        result.current.handleViewBestTimes();
      });
      expect(newSetStep).toHaveBeenCalledWith(4);
    });
  });

  describe('hook stability', () => {
    it('returns objects with consistent keys across re-renders', () => {
      const { result, rerender } = renderHook(() => useStatistics());
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      expect(Object.keys(firstResult)).toEqual(Object.keys(secondResult));
    });

    it('does not cause unnecessary re-renders when called', () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useStatistics();
      });
      
      const initialRenderCount = renderCount;
      
      act(() => {
        result.current.handleViewBestTimes();
      });
      
      // Should not cause additional renders
      expect(renderCount).toBe(initialRenderCount);
    });
  });
});