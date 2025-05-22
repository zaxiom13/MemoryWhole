import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils/memoryUtils';

/**
 * Timer component that displays elapsed time
 * @param {Object} props Component props
 * @param {boolean} props.isRunning Whether the timer is running
 */
export default function Timer({ isRunning = false }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    let timer;
    
    if (isRunning) {
      // Start timer
      const startTime = Date.now() - elapsedTime;
      
      timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, elapsedTime]);
  
  return (
    <div className="font-mono text-xl font-semibold text-gray-800 dark:text-gray-200">
      {formatTime(elapsedTime)}
    </div>
  );
}