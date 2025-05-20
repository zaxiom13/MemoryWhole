import { useAppState } from '../../contexts/AppStateContext';

/**
 * Custom hook for statistics related functionality
 * @returns {Object} Statistics handlers
 */
function useStatistics() {
  const { setStep } = useAppState();
  
  // View best times handler
  const handleViewBestTimes = () => {
    setStep(4);
  };
  
  return {
    handleViewBestTimes
  };
}

export default useStatistics;