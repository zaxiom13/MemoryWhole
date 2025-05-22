import React from 'react';
import TutorialGuide from '../components/TutorialGuide';

/**
 * Tutorial route component
 * @param {Object} props - Component props
 * @param {Function} props.completeTutorial - Function to mark tutorial as complete
 */
export default function TutorialRoute({ completeTutorial }) {
  return <TutorialGuide onComplete={completeTutorial} />;
}