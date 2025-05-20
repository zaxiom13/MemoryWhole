import React from 'react';

/**
 * Global styles component
 */
function GlobalStyles() {
  return (
    <>
      {/* Import modern fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700&family=Petrona:ital,wght@0,400;0,500;0,600;1,400&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <style>
        {`
          /* Optimize scrollbar visibility */
          .h-[70vh]:hover::-webkit-scrollbar {
            opacity: 1;
          }
          
          /* Improved focus styles for accessibility */
          *:focus-visible {
            outline: 2px solid currentColor;
            outline-offset: 2px;
          }
        `}
      </style>
    </>
  );
}

export default GlobalStyles;