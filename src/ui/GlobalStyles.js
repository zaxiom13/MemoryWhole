import React from 'react';

/**
 * Global styles component
 * Active styles have been migrated to index.css or component-specific Tailwind classes.
 */
function GlobalStyles() {
  return (
    <style>
      {`
        /* No active global styles here anymore. */
        /* Scrollbar styles are in index.css. */
        /* Other base styles are handled by Tailwind's preflight and index.css layers. */
      `}
    </style>
  );
}

export default GlobalStyles;