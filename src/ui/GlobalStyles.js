import React from 'react';

/**
 * Global styles component
 */
function GlobalStyles() {
  return (
    <style>
      {`
        /* Removed redundant scrollbar styles - Handled in modern.css */
        .h-[70vh]:hover::-webkit-scrollbar {
          opacity: 1;
        }
      `}
    </style>
  );
}

export default GlobalStyles;